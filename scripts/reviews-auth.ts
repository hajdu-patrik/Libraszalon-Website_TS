/**
 * One-time OAuth helper: turns a client id and secret into a refresh token.
 *
 *   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... npm run reviews:auth
 *
 * The refresh token is the only credential that cannot be copied out of a
 * console page — it exists only as the result of somebody signing in and
 * approving the scope, once. This runs that exchange locally and prints it.
 *
 * It listens on 127.0.0.1 for the redirect rather than asking you to paste a
 * code out of a URL bar, because the codes are single-use and expire in
 * minutes; a paste step is where this usually goes wrong.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS PRINTS IS A PASSWORD
 *
 * A refresh token is long-lived and, with the client id and secret, grants
 * access to the Business Profile. Put it straight into .env.local (which is
 * gitignored) or into GitHub's secret store. Do not paste it into a chat, an
 * issue, or a commit. If it ever leaks, revoke it at
 * https://myaccount.google.com/permissions.
 * ---------------------------------------------------------------------------
 */

import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';

const SCOPE = 'https://www.googleapis.com/auth/business.manage';
const PORT = 53682;
const REDIRECT = `http://127.0.0.1:${PORT}`;

async function main() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Hianyzik a GOOGLE_CLIENT_ID vagy a GOOGLE_CLIENT_SECRET.');
    console.error('');
    console.error('Google Cloud Console → APIs & Services → Credentials →');
    console.error('Create credentials → OAuth client ID → Web application.');
    console.error(`Az "Authorized redirect URIs" kozott szerepeljen: ${REDIRECT}`);
    process.exitCode = 1;
    return;
  }

  // Guards against a stray request to the loopback port being mistaken for the
  // real redirect.
  const state = randomBytes(16).toString('hex');

  const authUrl =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: REDIRECT,
      response_type: 'code',
      scope: SCOPE,
      // Both are required to get a refresh token at all: without offline
      // access Google returns only a one-hour access token, and without the
      // forced prompt it returns nothing on the second and later runs, because
      // it only issues a refresh token the first time an account approves.
      access_type: 'offline',
      prompt: 'consent',
      state,
    }).toString();

  console.log('Nyisd meg ezt a linket, es jelentkezz be a listat birtoklo fiokkal:');
  console.log('');
  console.log(authUrl);
  console.log('');
  console.log(`Varakozas a valaszra a ${REDIRECT} cimen...`);

  const code = await new Promise<string>((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? '/', REDIRECT);
      const received = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (url.searchParams.get('state') !== state) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Ervenytelen state.');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        error
          ? `<p>Hiba: ${error}. Visszaterhetsz a terminalba.</p>`
          : '<p>Kesz. Ezt az ablakot bezarhatod, a token a terminalban van.</p>',
      );
      server.close();
      if (error) reject(new Error(error));
      else if (received) resolve(received);
      else reject(new Error('Nem erkezett kod.'));
    });
    server.on('error', reject);
    server.listen(PORT, '127.0.0.1');
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT,
      grant_type: 'authorization_code',
    }),
  });

  const json = (await response.json()) as {
    refresh_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !json.refresh_token) {
    console.error('');
    console.error(`Sikertelen: ${json.error ?? response.status} ${json.error_description ?? ''}`);
    if (!json.refresh_token && response.ok) {
      console.error(
        'Access token jott, refresh token nem. Ez akkor fordul elo, ha a fiok mar ' +
          'engedelyezte ezt a klienst — vond vissza a hozzaferest a ' +
          'https://myaccount.google.com/permissions oldalon, es futtasd ujra.',
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log('');
  console.log('Kesz. Ird be a .env.local fajlba (es a GitHub secretek koze):');
  console.log('');
  console.log(`GOOGLE_REFRESH_TOKEN=${json.refresh_token}`);
  console.log('');
  console.log('Ez jelszo ertekű — ne kuldd el senkinek es ne commitold.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
