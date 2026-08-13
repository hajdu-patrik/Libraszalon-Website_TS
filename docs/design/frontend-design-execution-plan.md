# Frontend design végrehajtási terv — Libra Masszázs Szalon

**Készült:** 2026-08-08. **Forrás:** `docs/design/frontend-design-principles.md`
(a repó `ccde34b` commitjához mérve).

Ez a dokumentum a *hogyan*: az elvek dokumentumában rögzített 30 elvből azt a 24-et
viszi végig, amelyik ma nem teljesül vagy csak részben. Minden feladat egy vagy több
elvre hivatkozik (`K1`, `M2`, `H2`…); ami nincs elvhez kötve, az nem került be.

Öt fázis. Mindegyik önállóan kiadható, önállóan verifikálható, és önmagában is
javítja az oldalt — nincs olyan köztes állapot, amit ne lehetne deployolni.

---

## 1. A sorrend logikája

**Először a mérce, aztán a mérés.** A `scripts/verify.mts` ma nincs bekötve sem a
`package.json`-be, sem a CI-be, és három ponton rosszul mér (L2, H2, H3). Amíg a kapu
vak, minden későbbi fázis „kész" jelzése hiedelem. Ezért a Fázis 1 a kaput élesíti,
*mielőtt* bármit javítanánk vele.

**Globális réteg → oldalréteg → komponensréteg.** A `--color-gold-ink` értéke 49 helyen
hat, a reveal időtartam mind a hat oldalon. Ezeket egy fájlban javítani egyszer, és utána
mindenhol mérni olcsóbb, mint fordítva.

**A legnagyobb üzleti hatás előre.** Az oldal egyetlen konverziós útja a telefon. Az a
fázis, ami a telefont és a nyitvatartást minden oldalra kiteszi (Fázis 2), nem várhat
tipográfiai finomításokra.

**A kockázatos, sok fájlt érintő átalakítás hátra.** A reveal hatókörének szűkítése
(M2) hat oldal minden bekezdését érinti — akkor jöjjön, amikor a kapu már megbízhatóan
jelez.

---

## 2. Fázisáttekintés

| # | Fázis | Elvek | Jelleg | Fő fájlok |
|---|---|---|---|---|
| 1 | Alapréteg: a kapu és a globális CSS | L2, H2, H3, M3, M1, K1, T5 | infrastruktúra + token | `scripts/verify.mts`, `package.json`, `app/globals.css`, `app/layout.tsx`, `Reveal.tsx`, `MobileNav.tsx`, `Hero.tsx` |
| 2 | Elérhetőség: telefon és nyitvatartás | C5, N2, B1, B2, N1 | tartalom-megjelenítés | `Header.tsx`, `MobileNav.tsx`, `Footer.tsx`, `content/site.ts`, `lib/hours.ts` (új), mind a 6 oldal |
| 3 | Szemantika és tipográfiai hierarchia | T1, T4, F2, K2, T3 | dokumentumszerkezet | `Hero.tsx`, `app/page.tsx`, `ContactDetails.tsx`, `Footer.tsx`, `Section.tsx`, `app/bemutatkozas/`, `app/arak/elso-masszazs/` |
| 4 | Komponens-igazság és mozgás | C1, M2, A2, L1, C3 | komponens-viselkedés | `ServiceCard.tsx`, `PriceCard.tsx`, `StarRating.tsx`, `ReviewsCarousel.tsx`, `SectionHeading.tsx`, mind a 6 oldal |
| 5 | Záró audit és teljesítmény | H1, P1 + teljes visszamérés | kézi ellenőrzés | `Header.tsx`, `Section.tsx`, `PageHeader.tsx`, `scripts/verify.mts`, a forrásdokumentum |

Az `A1`, `T2`, `C2`, `C4`, `F1`, `P2` elvek ma teljesülnek. Ezekhez nincs feladat —
a dolguk annyi, hogy egyik fázis se rontsa el őket. A Fázis 5 visszaméri mind a hatot.

---

## 3. Fázis 1 — Alapréteg: a kapu és a globális CSS

**Cél.** A `verify.mts` azt mérje, amit állít magáról, be legyen kötve, és a globális
CSS-réteg minden olyan hibája javuljon, ami egyetlen fájlból javítható.

### Feladatok

**1.1 A kapu bekötése.** `npm run verify` script a `package.json`-be (a `serve out`
indítását is beleértve vagy dokumentálva), és a README „Ellenőrzések" blokkja frissítve.
Ma a script létezik, de semmi nem hívja.

**1.2 (L2) Elemenkénti túlcsordulás-ellenőrzés.** A jelenlegi első check
(`scrollWidth > innerWidth + 1`) pontosan azt a jelet nézi, amit a `body { overflow-x:
hidden }` elnyel — gyakorlatilag nem tud tüzelni. A `overflowing` lista *önálló
hibafeltétel* legyen, ne a scrollWidth-check alárendeltje. Feltételek:

- referencia `document.documentElement.clientWidth` (nem `innerWidth`, ami a görgetősávot is számolja);
- ki kell zárni azt az elemet, aminek az ősei között van `overflow-x: hidden|clip`
  vagy `overflow: hidden|clip` — különben a `MobileNav` szándékosan levágott,
  viewport-méretű keretében parkoló drawer minden futásnál hamis riasztást ad;
- a `body`-n lévő backstop marad; a check tőle függetlenül mér.

**1.3 (H2) 44 px-es célméret a kapuban.** A `r.height < 24 || r.width < 24` küszöb
44-re. Két dolog kell hozzá, különben a check használhatatlanul zajos lesz:

- a WCAG 2.5.8 inline-kivétele: a folyó szövegbe ágyazott, `display: inline` link ne
  bukjon el (a bekezdésen belüli linkeknél a méret a sortörésből adódik);
- explicit, a kódban látható kivételjelölés (pl. `data-target-exempt="..."` attribútum
  indoklással) a `ReviewsCarousel` pöttyeire, amelyek `h-11 w-6`-osak — ez a doksiban
  dokumentált, elfogadott kivétel.

Ami ezután pirosra vált és Fázis 1-be tartozik: a `Footer` navigációs és
kapcsolat-linkjei `min-h-9`-en (36 px) állnak → `min-h-11`.

**1.4 (H3) Nagyítás-ellenőrzés.** Két új futás a hat szélesség mellé:

- **320×256** — ez a WCAG 1.4.10 referenciahelyzetének (1280 px @ 400% page zoom)
  pontos geometriai megfelelője. A ma futó 320×900 a szélességet lefedi, a magasságot
  nem: 256 px-en a sticky fejléc a képernyő negyedét viszi el.
- **1280×1024, `:root { font-size: 200% }`** — ez a WCAG 1.4.4 Resize Text esete.
  Itt válik el a `rem` a `vw`-től: page zoomnál mindkettő skálázódik, szövegnagyításnál
  csak a `rem`. Ez az a futás, ami a `clamp()` skálát és a kódba írt `px`-eket tényleg
  próbára teszi. (Lásd 6. szakasz.)

**1.5 (M3) A no-JS ág.** Ma a `[data-reveal] { opacity: 0 }` a stíluslapból azonnal
érvényes, a feloldó `[data-revealed]`-et viszont JS teszi rá. JS nélkül az oldal
tartalmának túlnyomó része véglegesen láthatatlan — statikus exportnál, ahol a HTML
amúgy is teljes, ez ingyen orvosolható.

- Megoldás: `<noscript>` blokk a `app/layout.tsx`-ben, benne `<style>`, ami
  `[data-reveal] { opacity: 1; transform: none }`-t ír felül. Nulla JS, nulla
  villanás-kockázat. Alternatíva, ha a `<noscript>` a build során nem a kívánt helyre
  kerül: a rejtett állapotot egy `html.js` osztály mögé kell tenni, amit egy
  `beforeInteractive` inline script rak fel — ekkor viszont ellenőrizni kell, hogy nincs
  villanás.
- **A megoldást a `out/` alatti *épített* HTML-en kell igazolni, nem a devserveren.**
- A kapuba: egy `javaScriptEnabled: false` context, ami mind a hat oldalon ellenőrzi,
  hogy minden `[data-reveal]` elem számított `opacity`-ja 1.

**1.6 (M1) Időtartamok és stagger.** Célérték: belépő animáció ≤ 400 ms, halmozott
stagger ≤ 200 ms.

| Hely | Ma | Cél |
|---|---|---|
| `globals.css` `[data-reveal]` transition | 700 ms | ≤ 400 ms (javasolt 350) |
| `globals.css` `transition-delay` | `index × 80ms`, korlát nélkül | `index × 60ms`, `index` a komponensben 3-ra vágva → max 180 ms |
| `MobileNav` menüpontok | `120 + index × 40 ms`, 400 ms átmenet | ≤ 200 ms halmozott késleltetés, ≤ 400 ms átmenet |
| `Hero` `line-rise` | 900 ms | ≤ 400 ms |
| `Hero` `hero-image` | 1100 ms | ≤ 400 ms |
| `StarRating` `fade-in` delay | `index × 70 ms` (5 csillag → 280 ms) | ≤ 200 ms halmozott |

A lágyságot az `--ease-out-expo` görbe adja, nem az időtartam — a görbe nem változik.

**1.7 (K1) A `--color-gold-ink` értéke.** A token deklarált célja a kódkommentben
„clears 4.5:1"; a jelenlegi `#a2732f` ezt egyik tényleges háttéren sem éri el.
Számított értékek (a módszer a `#767676` = 4,54:1 referenciával hitelesítve):

| Jelölt | `#ffffff` | `#fafafa` | `#faf5ee` (közleménysáv) |
|---|---|---|---|
| `#a2732f` (mai) | 4,18 | 4,00 | 3,85 |
| `#96692a` | 4,83 | 4,62 | **4,45** ✗ |
| **`#936728`** | **4,99** | **4,78** | **4,60** ✓ |
| `#8f6526` | 5,18 | 4,96 | 4,77 |

Javasolt érték: **`#936728`** — a legkisebb sötétítés, ami mind a három valós háttéren
átmegy, és a színezet (35°-os amber) változatlan. A `--color-gold` (`#cc9955`)
**érintetlen marad**: az az örökölt márkaszín, ornamensként semmilyen kritériumot nem
sért. A `globals.css` kommentjét is javítani kell, hogy a szám igaz legyen.

**1.8 (T5) Elválasztás teljes lefedéssel.** A `hyphens: auto` ma a `p, li, blockquote`
hármason van. A `figcaption`, a kártyafejlécek (`h3`) és a táblázatcellák kimaradnak —
`masszázsszolgáltatásaimat` 24 betű, ami 320 px-en kilóg. Legegyszerűbb teljes megoldás:
`hyphens: auto` a `body`-ra, öröklődéssel. A böngésző csak akkor választ el, ha a szó
nem fér ki, tehát széles képernyőn nincs mellékhatása; a `text-wrap: balance` a
címsorokon marad.

### Kilépési feltétel

- `npm run verify` fut, és mind a nyolc konfiguráción (6 szélesség + 320×256 + 200%
  szövegnagyítás) végigmegy, plusz a no-JS futás.
- Ami ezután is piros, az `docs/design/verify-baseline.md`-be kerül, fázishoz rendelve.
  A Fázis 1 nem a piros eltüntetéséről szól, hanem arról, hogy a piros *igaz* legyen.
- Vizuális összevetés a K1 előtt/után minden olyan felületről, ahol `text-gold-ink`
  fut: eyebrow, aktív navlink, `Button` outline, „Tovább" / „Részletek" linkek.

### Kockázat

A K1 tokenváltás 49 helyen hat egyszerre. Ez a fázis egyetlen olyan lépése, ami látható
színváltozást hoz — szándékosan egyedül áll, hogy egy commitban visszavonható legyen.

---

## 4. Fázis 2 — Elérhetőség: telefon és nyitvatartás

**Cél.** A látogató bármelyik oldalról, görgetés és menünyitás nélkül fel tudjon hívni,
és tudja, mikor van értelme tárcsázni.

### Feladatok

**2.1 (C5) Nyitvatartás a láblécbe.** A 9–17, mind a hét napra, ma kizárólag a
JSON-LD-ben van. Egy új `lib/hours.ts` helper képezze a magyar megjelenítési alakot
közvetlenül a `site.openingHours`-ból (egymást követő azonos napok összevonásával), hogy
a látható érték és a strukturált adat *ugyanabból* jöjjön — ne két, kézzel szinkronban
tartott mezőből. A helper kimenete a `Footer` „Elérhetőségek" oszlopába kerül, ikonnal és
szöveges címkével (A2 miatt az ikon önmagában nem hordozhat információt).

**2.2 (N2) Telefon a fejlécbe.** 1024 px felett látható `tel:` link a navigáció mellett
(`site.phone` megjelenítéshez, `site.phoneHref` a `href`-be, `dir="ltr"`). 1024 px alatt
önálló, 44×44-es telefon-ikon gomb a hamburger mellett — nem a drawerben. A fejléc
magassága nem nőhet: a `--header-height: 4.5rem` a `scroll-padding-top` alapja, és a H1
kockázatát is emeli, ha elcsúszik.

**2.3 (B1 + N1) Záró CTA a két zsákutca-oldalra.** A `/bemutatkozas/` és a `/hazirend/`
ma két fotóval ér véget, link és CTA nélkül. Mindkettő kap egy záró blokkot telefonos
CTA-val. Ezzel B1 (`tel:` a láblécen kívül minden oldalon) és N1 (nincs zsákutca)
egyszerre teljesül; az `/arak/` és az `/arak/elso-masszazs/` záró linkje már megvan, azt
csak ki kell egészíteni a 2.4-es kísérőszöveggel.

**2.4 (B2) Kísérőadat minden `tel:` CTA mellé.** Egy új, kicsi komponens (javasolt:
`components/ui/CallNote.tsx`), ami a nyitvatartást és a várakozási időt tömören közli, és
mind a három helyen ugyanaz: főoldali záró CTA, `/bemutatkozas/`, `/hazirend/`.

- A nyitvatartás a 2.1-es helperből jön.
- A várakozási idő a `content/notice.ts`-ből — új, rövid mező (pl. `waitShort`), hogy a
  sávval egy helyen legyen frissítve. **A 43 szavas sávszöveg nem ismételhető meg**; a
  CTA mellé tömör tényközlés kell, nem a teljes közlemény.
- Ez nem szövegírás: meglévő tények tömör megjelenítése. A precedens a `content/pages/home.ts`
  fejléc-kommentje, ami a gombfeliratokat „interface chrome"-ként különbözteti meg a
  tartalomtól. Minden új string a `content/` alá kerül, nem a komponensbe.

### Kilépési feltétel

Mind a hat oldalon: `tel:` a fejlécben, görgetés és menünyitás nélkül; `tel:` a láblécen
kívül a tartalomban is; minden `tel:` CTA-gomb mellett látható a nyitvatartás és a
várakozási idő; a lábléc nyitvatartása megegyezik a JSON-LD-vel. `npm run verify` zöld.

---

## 5. Fázis 3 — Szemantika és tipográfiai hierarchia

**Cél.** Amit a képernyőolvasó lát a dokumentumszerkezetből, egyezzen azzal, amit a
látogató lát a képernyőn.

### Feladatok

**3.1 (T1) A főoldal `<h1>`-e.** Ma a Caveat mottó 28→56px-en az oldal egyetlen
legfelső szintű címe — se a szalon nevét, se a szolgáltatás tárgyát nem közli. A mottó
marad a hero vizuális főszereplője, de `<p>`-ként; mellé kerül egy látható `<h1>`,
kisebb méretben (`--text-h3` környéke), ami megnevezi, hova érkezett a látogató.

- **Az `<h1>` szövege meglévő `content/` értékekből álljon össze**, ne újonnan írt
  mondat legyen: `site.legalName` + a `pageSeo.home.description` első tagmondata
  („Budapest II. kerületében") már pontosan ezt mondja.
- **Elvetett megoldás:** `sr-only` `<h1>`. A doksi T1 indoklása szerint az `<h1>` az az
  elem, amiből *mindkét* látogató megállapítja, miről szól az oldal — a vizuálisan
  rejtett cím a szemantikát javítaná, a látható információs hiányt nem.

**3.2 (T4) Az eyebrow két hibája.** Az elv mindkét irányban sérül, és a megoldás
mindkétszer a *megjelenítési szerep* váltása, nem a szöveg átírása:

- *Szemantika:* a `Footer` és a `ContactDetails` négy `<h2>`-je 13 px-es verzál
  eyebrow-ként renderelődik. A heading elem marad `<h2>` (a landmark-szerkezet erre
  épül), de kap vizuális súlyt — az `eyebrow` osztály lekerül róla.
- *Hossz:* a `home.reviews.eyebrow` hét szó, két kérdő mondat; a
  `houseRules.scope.heading` hat szó, kisbetűs forrásszöveggel, amit a CSS verzálba tesz.
  Ezek nem eyebrow-ként jelennek meg, hanem lead szövegként (`<p>`, normál méret,
  kisbetű). A `SectionHeading` komponensnek ehhez engednie kell, hogy az eyebrow slot
  üresen maradjon.
- Az `eyebrow` `@utility` maga nem változik: rövid címkéknél (`90 perc`,
  `Elérhetőségek`) jól működik.

**3.3 (F2) Név és végzettség egy egységben.** A `/bemutatkozas/` `<h2>{about.name}</h2>`
mellé a `site.ownerTitle` látható szövegként. Ma a végzettség a 153 szavas `intro`
belsejében és az `alt` attribútumban van — a képernyőolvasót használó látogató jobb
helyzetben van, mint a látó. Ugyanez az `/arak/elso-masszazs/` `about-detail` blokkjánál,
ha ott is név áll címként.

**3.4 (K2) A vertikális ritmus a tartalomhoz igazodik.** A `loose` spacing fokozat
definiálva van, sehol nincs használva — épp a leghosszabb szövegű oldalakon
(`/hazirend/` ~630 szó, `/arak/elso-masszazs/` ~428 szó) hiányzik a tagoló levegő. A
`spacing` értéket tartalomsűrűség szerint kell kiosztani, nem sorrend szerint; a `tone`
váltakozás felülvizsgálata ugyanitt (a `/bemutatkozas/` négy mechanikus váltása 1,04:1-es
kontraszttal semmit nem jelöl).

**3.5 (T3) A hosszú bekezdések mértéke.** A `first-massage.ts` `assessment.body` 237 szó
egyetlen bekezdésben, ma egy `1fr / 20rem` rácsban, mellette `lg:sticky lg:top-28`
képpel: a leghosszabb szövegblokk mellett a legmozdulatlanabb elem. Ez a blokk kikerül a
szűk oszlopból, `prose-measure`-be, sticky kísérő nélkül. Ellenőrzés: minden 150 szónál
hosszabb bekezdés `prose-measure`-ben áll.

### Kilépési feltétel

Egyetlen `font-script` elem sem `<h1>`, `<button>` vagy `<label>`; egyetlen `eyebrow`
osztályú elem sem heading, nem hosszabb négy szónál, és nincs benne mondatvégi írásjel;
minden `<h2>` mérete `--text-h2`; nincs 150+ szavas bekezdés `prose-measure`-en kívül
vagy sticky elem mellett. `npm run verify` zöld (a `h1`-check továbbra is pontosan
egyet vár oldalanként).

---

## 6. Fázis 4 — Komponens-igazság és mozgás

**Cél.** Egyetlen komponens se ígérjen olyat, amit nem vált be — se kattinthatóságot, se
információt, ami csak színben van meg.

### Feladatok

**4.1 (C1) Hover-emelés csak kattinthatón.** A `ServiceCard` és a `PriceCard`
`<article>` elem, nincs bennük link, mégis `hover:-translate-y-1` + `shadow-lift` van
rajtuk, a `ServiceCard` képe ráadásul `group-hover:scale-105`. Egérrel: rákattint, nem
történik semmi. Érintőn: ragadós hover-állapot. Mindhárom hover-állapot lekerül. A
`Button` `hover:-translate-y-0.5`-e marad — az tényleg kattintható.

**4.2 (M2) A fő szövegtörzs nem animál.** Ma a `/hazirend/` mind a 14 szabálya, az
`/arak/elso-masszazs/` mind a 7 tanácsa, mind a 7 `PriceCard` és gyakorlatilag minden
bekezdés `opacity: 0`-ról indul. A `[data-reveal]` hatóköre szűküljön kísérő elemekre:
kép, kártya mint egész, `GoldRule`, ornamens. Ami kikerül alóla: `<p>`, `<li>`, `<h2>`,
`<h3>`, `<ol>`, és a `SectionHeading` címsor-része. Ez hat oldal és három komponens
(`SectionHeading`, `PriceCard`, `ServiceCard`) átnézése.

> A `verify.mts` reveal-checkje ettől kevesebb elemet fog látni — ez várt, nem regresszió.

**4.3 (A2) A csillagsor szín nélkül is olvasható.** A `StarRating` kitöltött csillaga ma
`text-gold` (2,54:1), a kitöltetlen `text-line` (1,27:1) — az értékelés egyedüli
vizuális hordozója a szín. Megoldás alakkal: a kitöltetlen csillag körvonalas, a
kitöltött tömör (`Icons.tsx` bővítése egy outline változattal). A `role="img"` +
`aria-label` marad.

**4.4 (A2) A karusszel-pöttyök.** Az aktív állapotot ma 1,27:1 és 2,54:1 színpár közli;
az egyetlen érvényes jelzés a 6px→16px szélességváltozás. Két dolog kell: az inaktív
pötty érje el a 3:1-et a háttérrel szemben (a konkrét értéket ki kell számolni és
igazolni), és az alakkülönbség maradjon meg. Az `aria-current` már megvan.

**4.5 (L1) A kártya viseli a hosszkülönbséget.** A `house-rules.ts` 14 szabálya 46 és
905 karakter között szór (20×), a `first-massage.ts` hét tanácsa 47 és 284 között (6×) —
és ez utóbbi `sm:grid-cols-2` rácsban áll, tehát egy háromsoros és egy tízsoros kártya
kerül egymás mellé. Javasolt megoldás a tanácsoknál: egyoszlopos elrendezés
`prose-measure`-ben. A minta már megvan a repóban (`PriceCard` `mt-auto` alsó igazítás,
`ReviewCard` clamp + mért „Tovább" gomb) — fix magasságú vágás nem opció, mert a
házirendnél a leghosszabb szabály (08, lemondás) egyben a legfontosabb is.

**4.6 (C3) Aggregált értékelés és külső forráslink.** A `reviewStats` (`{count: 7,
average: 5}`) ma sehol nem jelenik meg, és a `site.social.googleMaps` link sem áll a
vélemények mellett. A csillagos rich result a Google policy szerint nem fog megjelenni a
találati listában (self-serving review szabály `LocalBusiness` entitáson), tehát ezt az
információt magán az oldalon kell megmutatni: átlag, darabszám, és egy link, ahol
ellenőrizhető. Beágyazott Google-widget kizárva (P2).

### Kilépési feltétel

Nincs `hover:-translate-y-*` nem-interaktív elemen; nincs `[data-reveal]` a fő szöveget
vivő elemeken; a `StarRating` és a karusszel-pöttyök szürkeárnyalatos képernyőn is
olvashatók; egyik listában sincs háromszoros magasságkülönbségű pár 320 px-en; a
vélemény-szekcióban látszik az átlag, a darabszám és a külső link.

---

## 7. Fázis 5 — Záró audit és teljesítmény

**Cél.** Az, amit gép nem tud mérni, plusz a teljes készlet visszamérése.

**7.1 (H1) Billentyűzetes végigjárás.** Ez az egyetlen `?` státuszú elv: olvasásból nem
eldönthető, hogy a `--header-height: 4.5rem` valóban fedi-e a tényleges fejlécmagasságot,
amikor a `NoticeBar` is látszik és a logó `sm:h-14`-en áll. Tabbal végig mind a hat
oldalon, mind a hat szélességen; minden fókuszált elem maradjon legalább részben látható
(WCAG 2.4.11, az F110 hibaminta pont a sticky fejléc). Ha nem fedi: a `Header` írja ki a
tényleges magasságát CSS változóként (a komponens már `'use client'`, tehát nincs új
függőség és nincs új réteg).

**7.2 (P1) A dekoratív háttérképek `sizes` értéke.** A `Section` háttere `sizes="100vw"`-t
kér, tehát 1440 px-es viewporton a böngésző az 1920 px-es változatot tölti le — a
`bg-home` esetében 35 KB AVIF olyan képért, ami 7%-os opacitáson színfolt. Ez tisztán
designdöntés következménye: mi mondtuk ki, hogy a háttér textúra (F1), ebből következik,
hogy nem kell hozzá teljes felbontás. Ugyanez a `PageHeader` 12%-os hátterére. Az
oldalanként egy `<Picture priority>` szabály nem változik — az ma rendben van.

**7.3 Teljes visszamérés.** `npm run verify` mind a nyolc konfiguráción + no-JS +
`prefers-reduced-motion`; a hat teljesülő elv (`A1`, `T2`, `C2`, `C4`, `F1`, `P2`)
tételes újraellenőrzése; LCP/CLS spot-check a főoldalon és egy aloldalon.

**7.4 A forrásdokumentum státuszainak frissítése.** A
`docs/design/frontend-design-principles.md` `*Állapot.*` sorai és a 4. szakasz
hézag-táblázata a valós állapotra. Ez az egyetlen pont, ahol a végrehajtás visszaír a
forrásba — és csak akkor, ha a 7.3 tényleg lefutott.

---

## 8. Amit ez a terv nem csinál

A megkötések a forrásdokumentumból és a repó tényeiből jönnek; egyik fázis sem lépi át
őket:

- **Nincs rebrand.** Nincs új logó, betűtípus vagy alapszín. A `--color-gold` értéke
  nem változik; a `--color-gold-ink` igazítása a *deklarált saját céljához* nem
  identitásváltás.
- **Nincs szövegátírás.** Új string csak akkor keletkezik, ha meglévő `content/` adatból
  áll össze vagy interface chrome (gombfelirat, címke), és akkor is a `content/` alá kerül.
- **Nincs új futásidejű függőség.** Se animációs, se karusszel-, se UI-könyvtár.
- **Nem mozdul URL.** `trailingSlash: true`, a címek a WordPress-szel azonosak.
- **Nincs sötét téma.** A forrásdokumentum ezt rögzített döntésként zárja le, költséggel
  együtt.
- **Nincs szerveroldali funkció.** Statikus export marad; nincs foglalás, űrlap, kereső.

---

## 9. Nyitott kérdések és blokkolások

A forrásdokumentum 6. szakaszának kérdései fázishoz rendelve. Egyik sem blokkolja a
munka megkezdését — mindegyikhez van alapértelmezés, ami ha téves, egy `content/` fájl
egy sorát érinti.

| # | Kérdés | Melyik fázist érinti | Alapértelmezés, ha nincs válasz |
|---|---|---|---|
| 2 | Tényleg mind a hét napra 9–17? | 2 (C5, B2) | A `site.openingHours` a forrás — ez ma is publikus állítás a JSON-LD-ben. Ha változik, csak `content/site.ts` módosul. |
| 4 | Kirakható a Google-profil linkje és a nyilvános átlag? | 4 (C3) | A `site.social.googleMaps` link ma is szerepel a láblécben, a `reviewStats` a saját `reviews.json`-ból számol. Megjelenítjük, forrásmegjelöléssel. |
| 6 | A `sensitiveSkin.heading` nagybetűzése és a `scope.heading` kisbetűs kezdete szándékos? | 3 (T4) | Örökölt szöveg, nem írjuk át; a megjelenítési szerepet váltjuk (nem verzál eyebrow). |
| 1 | Ki és milyen ritmusban frissíti a várakozási időt? | 2 (B2) | A `content/notice.ts` marad az egyetlen hely; a CTA-kísérő onnan olvas. |
| 3 | Van-e visszahívási ígéret? | 2 (B2) | **Van** — a `home.cta.body` már tartalmazza: „Ha dolgozok, nem tudom felvenni a telefont, de vissza foglak hívni." Ez a kérdés a forrásdokumentumban nyitva maradt, de a `content/` már megválaszolja. |
| 5 | Begyűjthető a vélemények dátuma? | 4 (C3) | Nem jelenítünk meg dátumot; a `publishedAt` egyetlen véleményen sincs kitöltve. |
| 7 | Készül-e új portré? | — | Nem érinti a tervet; a `about-portrait` marad. |

---

## 10. Két pontosítás a forrásdokumentumhoz

**H3 — page zoom vs. text zoom.** A forrásdokumentum H3 indoklása azt írja, hogy
„nagyításkor a `rem` értékek nőnek, a `vw` értékek nem". Ez a *szövegnagyításra* igaz;
a böngésző page zoomja a `rem`-et, a `px`-et és a `vw`-t együtt skálázza, tehát az
1280 px @ 400% geometriailag azonos egy 320×256-os viewporttal. A két eset valóban külön
tesztet érdemel, csak nem úgy, ahogy az indoklás sugallja — ezért ír elő a Fázis 1
mindkettőre külön futást (1.4). Az elv maga („a 320 px-es ellenőrzés nem helyettesíti a
nagyítást") változatlanul áll.

**K1 — konkrét célérték.** A forrásdokumentum megállapítja, hogy a token nem éri el a
4,5:1-et, de nem ad értéket. Az 1.7-es táblázat ezt pótolja: `#936728` a legkisebb
sötétítés, ami mind a három tényleges háttéren átmegy, változatlan színezet mellett.

---

## 11. Promptok

Minden fázishoz külön, kiadható prompt készül a `docs/prompts/` alá, a repóban már
használt formátumban (`frontend-design-research.md` mintájára).

| Fázis | Prompt | Állapot |
|---|---|---|
| 1 | `docs/prompts/frontend-phase-1.md` | kész |
| 2–5 | `docs/prompts/frontend-phase-{2..5}.md` | az előző fázis lezárása után készül |

A 2–5. prompt szándékosan nem készül előre: mindegyik az előző fázis tényleges
kimenetére épül — a Fázis 2 például a Fázis 1 `verify-baseline.md`-jére.
