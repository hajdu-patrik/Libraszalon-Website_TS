# Libraszalon

A [libraszalon.hu](https://libraszalon.hu) weboldala — a Libra Masszázs Szalon
(Dévényi Krisztina, okleveles gyógymasszőr, Budapest II. kerület) bemutatkozó
oldala.

Ez a projekt a korábbi WordPress + Elementor oldal kiváltása. A tartalom és a
vizuális karakter változatlan; a technikai megvalósítás teljesen új.

---

## Mi ez technikailag

| | |
|---|---|
| Framework | Next.js 16, App Router, TypeScript |
| Kimenet | **Statikus export** (`output: 'export'`) — tiszta HTML, nincs szerver |
| Stílus | Tailwind CSS v4, CSS-first tokenekkel |
| Betűtípus | Source Sans 3, Roboto, Caveat — `next/font`-tal self-hosted |
| Kép | Build előtt előfeldolgozott AVIF + WebP szettek |
| Analytics | Vercel Web Analytics + Speed Insights (süti nélküli) |

A statikus kimenet miatt az oldal **bárhol futtatható**: Vercel, Cloudflare
Pages, Netlify, vagy bármilyen statikus tárhely — ugyanaz az `out/` könyvtár.

---

## Fejlesztés

```bash
npm install
npm run dev          # http://localhost:3000
```

Produkciós build és helyi kiszolgálás:

```bash
npm run build        # -> out/
npx serve out -l 4877
```

Ellenőrzések:

```bash
npm run lint
npm run typecheck
npx tsx scripts/verify.mts    # reszponzivitás-audit, futó szerver mellett
```

A `verify.mts` mind a 6 oldalt végigjárja 320 / 360 / 390 / 768 / 1024 / 1440
px-en, és hibát jelez, ha vízszintes túlcsordulás van, ha egy scroll-animáció
nem fut le (ilyenkor tartalom maradna láthatatlan), ha egy oldalon nem pontosan
egy `<h1>` van, vagy ha egy kattintható elem 24 px alatti.

---

## Hol van a tartalom

**Minden szöveg és ár a `content/` mappában van, nem a komponensekben.**
Egy ár módosításához nem kell a HTML-hez nyúlni.

| Fájl | Mit tartalmaz |
|---|---|
| `content/site.ts` | Név, telefon, e-mail, cím, nyitvatartás, közösségi linkek |
| `content/prices.ts` | A 7 ársor |
| `content/services.ts` | A főoldal 4 szolgáltatás-blokkja |
| `content/reviews.json` | A Google vélemények |
| `content/notice.ts` | A „Kedves Látogató" közlemény |
| `content/seo.ts` | Oldalankénti title és description |
| `content/pages/*.ts` | A hosszabb oldalak szövegei |

Például az árak módosítása:

```ts
// content/prices.ts
{
  duration: '60 / 90 perc',
  title: 'Klasszikus svédmasszázs',
  price: '14.000 Ft / 19.000 Ft',   // <- itt
  amounts: [14000, 19000],          // <- és itt, a strukturált adatok miatt
}
```

Commit + push, és a Vercel automatikusan újraépíti.

---

## Vélemények

A `content/reviews.json` a forrás. A megjelenítés szabályai a
`content/reviews.ts`-ben vannak, egy helyen:

- csak **4 csillag vagy afölött** jelenik meg
- egyszerre legfeljebb **7** vélemény kerül a karusszelbe

### Automatikus frissítés

A `.github/workflows/reviews.yml` naponta 04:00 UTC-kor lefuttatja a
`scripts/scrape-reviews.ts`-t. Ha új vélemény érkezett, commitolja, és a push
elindítja a deployt. Kézzel is indítható az Actions fülről.

**Ez best-effort, nem garancia.** A Google csak egyetlen támogatott csatornán
adja ki a véleményeket: a Places API „Enterprise + Atmosphere" SKU-ján, amihez
bankkártyás Google Cloud projekt kell. Az ingyenes utakat aktívan védi — a
belső `listugcposts` végpont 403-at ad, a hely oldala JavaScript-váz, és a
böngészővel való kiolvasás is csak időszakosan működik. A scraper ezért úgy
készült, hogy **soha ne rontson el semmit**:

- meglévő véleményt soha nem töröl
- üres listát soha nem ír ki
- hiba esetén is `0`-val lép ki, a fájl érintetlen marad

### Vélemény felvétele kézzel

Ez a megbízható út, és fél percbe telik. Nyisd meg a `content/reviews.json`-t,
és tedd az új bejegyzést a `reviews` tömb elejére:

```json
{
  "id": "sajat-egyedi-azonosito",
  "author": "Kovács Anna",
  "rating": 5,
  "text": "A vélemény szövege, emoji nélkül.",
  "avatar": "female",
  "source": "google"
}
```

Az `id` bármi lehet, csak legyen egyedi. Az `avatar` `"female"` vagy `"male"`.

---

## Képek

A képek a régi WordPress oldalról származnak. Az eredetik nincsenek a repóban
(`assets/raw/` gitignore-olt); a `public/images/` alatti, kiszolgált változatok
viszont igen, így a build nem függ hálózattól.

Új kép hozzáadása:

1. vedd fel a `scripts/assets.ts` `RAW_ASSETS` listájába
2. `npm run assets` — letölti és legenerálja az AVIF/WebP szetteket
3. hivatkozz rá a slug nevével: `<Picture slug="uj-kep" alt="..." />`

A `<Picture>` a `lib/images.manifest.json`-ból veszi a méreteket, és minden
`<img>`-re kiírja a `width`/`height`-et — ettől marad a layout shift nullán.

---

## Deploy

### Vercel

1. GitHub repo importálása a Vercelen
2. A framework automatikusan felismerésre kerül; build `npm run build`, kimenet `out`
3. A dashboardon kapcsold be a **Web Analytics**-et és a **Speed Insights**-ot
   (helyben ezek 404-et adnak a konzolba, ez normális)

### Domain átállítása

Csak akkor, ha a preview minden oldalon rendben van:

1. A domain maradhat a jelenlegi regisztrátornál
2. Vercelen add hozzá a `libraszalon.hu` és `www.libraszalon.hu` domaineket
3. A regisztrátornál állítsd az `A` rekordot a Vercel dashboard által kiírt
   IP-re, a `www` CNAME-et pedig `cname.vercel-dns.com`-ra
4. A tanúsítvány automatikusan kiállítódik
5. A WP-hostingot **csak azután** mondd fel, hogy az új oldal minden URL-en
   helyesen válaszol

### Más tárhelyre

Az `out/` könyvtár önmagában elég. Cloudflare Pages: build `npm run build`,
kimenet `out`. Netlify ugyanez. Kódot nem kell módosítani.

---

## Amire figyelni kell

- **Az URL-ek nem változhatnak.** A `trailingSlash: true` miatt minden cím a
  WordPress-szel azonos (`/arak/`, nem `/arak`). Az oldal évek óta indexelt;
  egy átnevezés eldobná a felépített helyezéseket.
- **Statikus exportban a `next.config.ts` `headers()` nem fut.** A cache- és
  biztonsági fejlécek a `vercel.json`-ban vannak.
- **Emoji nincs az oldalon.** A scraper is kiszűri a bejövő véleményekből.
- **A `#CC9955` arany szövegre nem elég kontrasztos** fehér háttéren (2.6:1).
  Vonalakhoz, csillagokhoz, ikonokhoz használd (`text-gold`), szöveghez a
  sötétebb `text-gold-ink` változatot.
