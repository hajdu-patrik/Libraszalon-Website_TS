/**
 * Pulls the salon's Google reviews through the Business Profile API.
 *
 *   npm run reviews:fetch
 *
 * This is the only way reviews reach the site. Scraping the public Maps page
 * was tried and removed: Google serves an automated browser a stripped place
 * page with no review pane at all, so it returned nothing however it was
 * written.
 *
 * What this gives that scraping never did: every review rather than the five
 * the Places API caps at, the full body text rather than a 240-character
 * ellipsis, real timestamps rather than "2 éve" parsed back into a guess, and
 * a licence to keep the data — these are the salon's own reviews about the
 * salon's own listing, not Places content under the Maps Platform terms.
 *
 * ---------------------------------------------------------------------------
 * SETUP — all of this is one-time, and most of it only the business owner can do
 *
 *  1. Create a Google Cloud project and enable three APIs:
 *       - My Business Account Management API
 *       - My Business Business Information API
 *       - Google My Business API           (this is the one with reviews)
 *
 *  2. Request access. A new project's quota for these APIs is zero, which
 *     reads exactly like a permissions bug: every call returns 403 and the
 *     quota page shows a limit of 0. Submit the "Application for Basic API
 *     Access" form — it wants the Cloud project number, and the Business
 *     Profile has to be verified and at least 60 days old. Approval takes
 *     weeks, not minutes.
 *
 *  3. Create an OAuth client (type: Desktop app) and publish the consent
 *     screen. Publishing is not optional: while it is in Testing, Google
 *     expires refresh tokens after seven days, and a nightly job that dies
 *     every Monday is worse than no job.
 *
 *  4. Authorise once as the account that owns the listing, with scope
 *     https://www.googleapis.com/auth/business.manage, and keep the refresh
 *     token.
 *
 *  5. Set three secrets — locally in .env.local, in CI as repository secrets:
 *       GOOGLE_CLIENT_ID
 *       GOOGLE_CLIENT_SECRET
 *       GOOGLE_REFRESH_TOKEN
 *     Optionally GOOGLE_LOCATION_NAME ("accounts/123/locations/456") to skip
 *     discovery — worth setting once you know it, since it saves two calls and
 *     removes the only step that can pick the wrong listing if the account
 *     ever manages more than one.
 * ---------------------------------------------------------------------------
 */

import {
  MIN_RATING,
  commitReviews,
  guessAvatar,
  reviewId,
  stripEmoji,
  type StoredReview,
} from './reviews-store.ts';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ACCOUNTS_URL = 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts';
const LOCATIONS_HOST = 'https://mybusinessbusinessinformation.googleapis.com/v1';
const REVIEWS_HOST = 'https://mybusiness.googleapis.com/v4';

/** starRating arrives as a word, not a number. */
const STAR_VALUES: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

type GoogleReview = {
  reviewId?: string;
  name?: string;
  comment?: string;
  starRating?: string;
  createTime?: string;
  updateTime?: string;
  reviewer?: { displayName?: string; isAnonymous?: boolean };
};

async function call<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const body = await response.text();
    // The 403 that means "approved but no quota yet" is indistinguishable from
    // a real permissions error unless you read the body, so pass it through.
    throw new Error(`${response.status} ${url.replace(/\?.*$/, '')} — ${body.slice(0, 300)}`);
  }
  return (await response.json()) as T;
}

/** Trades the long-lived refresh token for an hour-long access token. */
async function accessToken(): Promise<string> {
  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN ?? '',
    grant_type: 'refresh_token',
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = (await response.json()) as { access_token?: string; error?: string; error_description?: string };

  if (!response.ok || !json.access_token) {
    // invalid_grant here almost always means the consent screen is still in
    // Testing and the seven-day refresh token has aged out.
    throw new Error(
      `Token csere sikertelen: ${json.error ?? response.status}` +
        (json.error_description ? ` — ${json.error_description}` : ''),
    );
  }
  return json.access_token;
}

/**
 * Finds the listing. The reviews endpoint is on v4 and wants the full
 * "accounts/{a}/locations/{l}" path, while the Business Information API
 * returns locations as bare "locations/{l}" — so the account has to be
 * carried across and stitched back on.
 */
async function resolveLocation(token: string): Promise<string> {
  const configured = process.env.GOOGLE_LOCATION_NAME;
  if (configured) return configured;

  const accounts = await call<{ accounts?: { name: string; accountName?: string }[] }>(
    ACCOUNTS_URL,
    token,
  );
  const account = accounts.accounts?.[0];
  if (!account) throw new Error('Nem talalhato Business Profile fiok ehhez a tokenhez.');

  const locations = await call<{ locations?: { name: string; title?: string }[] }>(
    `${LOCATIONS_HOST}/${account.name}/locations?readMask=name,title&pageSize=100`,
    token,
  );
  const location = locations.locations?.[0];
  if (!location) throw new Error(`A(z) ${account.name} fiokban nincs telephely.`);

  if ((locations.locations?.length ?? 0) > 1) {
    console.warn(
      `Tobb telephely is van; a(z) "${location.title ?? location.name}" lett kivalasztva. ` +
        'Allitsd be a GOOGLE_LOCATION_NAME valtozot, ha nem ez kell.',
    );
  }

  const resolved = `${account.name}/${location.name}`;
  console.log(`Telephely: ${location.title ?? ''} (${resolved})`);
  return resolved;
}

/** Walks every page; the API caps a page at 50. */
async function listReviews(token: string, location: string): Promise<GoogleReview[]> {
  const all: GoogleReview[] = [];
  let pageToken: string | undefined;

  do {
    const url =
      `${REVIEWS_HOST}/${location}/reviews?pageSize=50` +
      (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '');
    const page = await call<{ reviews?: GoogleReview[]; nextPageToken?: string; totalReviewCount?: number }>(
      url,
      token,
    );
    all.push(...(page.reviews ?? []));
    pageToken = page.nextPageToken;
  } while (pageToken);

  return all;
}

async function main() {
  const missing = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN'].filter(
    (key) => !process.env[key],
  );
  if (missing.length > 0) {
    console.warn(`Hianyzo kornyezeti valtozo: ${missing.join(', ')}`);
    console.warn('A Business Profile lekeres kimarad — reszletek a fajl tetejen.');
    // Not an error: this is the expected state on a machine that has not been
    // set up; the file simply keeps whatever it already had.
    process.exitCode = 0;
    return;
  }

  const token = await accessToken();
  const location = await resolveLocation(token);
  const raw = await listReviews(token, location);

  const belowThreshold = raw.filter(
    (r) => (STAR_VALUES[r.starRating ?? ''] ?? 0) < MIN_RATING,
  ).length;

  const incoming = raw
    .map<StoredReview | null>((r) => {
      const rating = STAR_VALUES[r.starRating ?? ''] ?? 0;
      const text = stripEmoji(r.comment ?? '');
      // A reviewer who left only a star rating, or who posted anonymously,
      // has nothing to quote — the card is a quotation, not a scoreboard.
      const author = r.reviewer?.isAnonymous ? '' : (r.reviewer?.displayName ?? '').trim();
      const id = r.reviewId ?? r.name ?? '';
      if (!id || !author || rating < MIN_RATING || text.length === 0) return null;

      return {
        id: reviewId(id),
        author,
        rating,
        text,
        avatar: guessAvatar(author),
        source: 'google',
        // A real timestamp at last, rather than "2 éve" turned back into a date.
        publishedAt: (r.createTime ?? r.updateTime ?? '').slice(0, 10) || undefined,
      };
    })
    .filter((r): r is StoredReview => r !== null);

  console.log(`Lekert velemeny:            ${raw.length}`);
  console.log(`${MIN_RATING} csillag alatt kiszurve:   ${belowThreshold}`);
  console.log(`Publikalhato:               ${incoming.length}`);

  await commitReviews(incoming, 'Business Profile API');
}

main().catch((error) => {
  // Exits 0 on purpose: a failed fetch leaves the last good data in place and
  // the site keeps working. A red job every night only teaches people to stop
  // reading the notifications.
  console.warn(
    `A lekeres hibaba utkozott, a tartalom valtozatlan: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
});
