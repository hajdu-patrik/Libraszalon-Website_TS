# Prompt — Fázis 1: Alapréteg (a minőségi kapu és a globális CSS)

Ez a fájl **nem** dokumentáció, hanem egy futtatható prompt. Másold be egészében egy új
Claude Code munkamenetbe ebben a repóban (vagy hivatkozz rá: „Hajtsd végre a
`docs/prompts/frontend-phase-1.md`-ben leírt feladatot").

A fázis a `docs/design/frontend-design-execution-plan.md` 3. szakaszát valósítja meg.
A miért kérdésre a `docs/design/frontend-design-principles.md` válaszol.

---

<szerep>
Senior frontend fejlesztő vagy, aki egy kis, egy ember által karbantartott statikus
oldalon dolgozik. Két dolgot tartasz szem előtt: a változás legyen a lehető legkisebb,
ami a célt eléri, és a kód maradjon olyan, amilyen — a repó kódkommentjeinek hangja,
elnevezései és sűrűsége a mérce, nem a tiéd.

Nem hiszel abban, hogy valami kész, amíg nem mérted meg. Ha egy ellenőrzés zöld, de
tudod, hogy vak, akkor az ellenőrzést javítod, nem a jelentést írod meg.
</szerep>

<feladat>
Élesítsd a projekt saját minőségi kapuját, és javítsd ki a globális CSS-réteg azon
hibáit, amelyek egyetlen fájlból javíthatók.

Nyolc feladat van, `1.1`-től `1.8`-ig. Mindegyik egy vagy több elvhez tartozik a
`frontend-design-principles.md`-ből — az elv kódját (`L2`, `H2`…) minden feladatnál
kiírom. Ha egy feladatnál elakadsz vagy más megoldást látsz jobbnak, az elv
`*Ellenőrzés.*` sora dönt: az a feltétel nem alkudható, a hozzá vezető út igen.

**A sorrend kötött.** Előbb a kapu (1.1–1.5), utána a javítások (1.6–1.8) — hogy a
javításokat már az éles kapuval tudd mérni.
</feladat>

<olvasd_el_eloszor>
Kutatnod nem kell semmit; minden döntés meg van hozva. De ezeket olvasd el, mielőtt
bármihez hozzányúlsz:

1. `docs/design/frontend-design-execution-plan.md` — a 3. szakasz a te fázisod, a 8.
   szakasz a tiltólista, a 10. szakasz két pontosítást tartalmaz, amit ismerned kell.
2. `docs/design/frontend-design-principles.md` — ezekből az elvekből: `L2`, `H2`, `H3`,
   `M3`, `M1`, `K1`, `T5`. A többit nem kell.
3. `scripts/verify.mts` — teljes egészében. Ez a fázis fő munkaterülete.
4. `app/globals.css` — teljes egészében.
5. `components/ui/Reveal.tsx`, `components/layout/MobileNav.tsx`,
   `components/home/Hero.tsx`, `components/home/StarRating.tsx`,
   `components/layout/Footer.tsx` — csak a mozgással és a célmérettel érintett részek.
6. `README.md` „Ellenőrzések" és „Amire figyelni kell" szakasza.
</olvasd_el_eloszor>

<munkamenet>

### 1.1 — A kapu bekötése

A `verify.mts` létezik, de semmi nem hívja: nincs benne a `package.json`-ben, és nincs
CI. Vedd fel `npm run verify` néven. A script futó statikus szervert vár
(`npx serve out -l 4877`), ezért a bekötés vagy indítsa is el, vagy a script írjon
érthető hibaüzenetet, ha a `BASE` nem válaszol — ne timeoutoljon 30 másodpercig
oldalanként. A README „Ellenőrzések" blokkját frissítsd az új parancsra.

### 1.2 — (L2) Elemenkénti túlcsordulás-ellenőrzés

**A hiba:** az első check `document.documentElement.scrollWidth > window.innerWidth + 1`
— pontosan azt a jelet nézi, amit a `body { overflow-x: hidden }` elnyel. A gyanús elemek
listája (`overflowing`) csak akkor íródik ki, ha ez a check már elbukott. Következmény: a
320 px-en kilógó elem csendben levágódik, a script zöldet jelez.

**Amit csinálj:** az `overflowing` lista legyen **önálló hibafeltétel**, a
scrollWidth-checktől függetlenül. Három részlet, ami nélkül a check zajos lesz:

- a referencia `document.documentElement.clientWidth` legyen, ne `window.innerWidth`
  (utóbbi a görgetősávot is beleszámolja);
- **zárd ki azt az elemet, aminek valamelyik őse `overflow-x: hidden|clip` vagy
  `overflow: hidden|clip`** — enélkül a `MobileNav` szándékosan levágott,
  viewport-méretű keretében parkoló drawer minden futásnál hamis riasztást ad
  (a `MobileNav.tsx:104-112` kommentje leírja, miért van ott az a keret);
- a `body`-n lévő `overflow-x: hidden` **marad** — az valódi backstop egy olyan
  hibaosztály ellen, ami mobilon azonnal használhatatlanná tesz egy lapot. Nem azt
  szereljük le, hanem a kaput élesítjük mellette.

**Elfogadási feltétel:** ha kézzel beteszel egy `<div style="width:120vw">`-t bármelyik
oldalra, a check jelez — a `body`-n lévő `hidden` mellett is. Ezt próbáld ki, aztán vedd
ki a próbaelemet.

### 1.3 — (H2) 44 px-es célméret a kapuban

**A hiba:** a script `r.height < 24 || r.width < 24`-nél húz határt, miközben a saját
fejléc-kommentje 44 px-ről beszél, és a komponensek is 44-et követnek (`Button`
`min-h-11`, hamburger `size-11`, karusszel-nyilak `size-11`, `BackToTop` `size-11`,
mobil menüpontok `min-h-14`).

**Amit csinálj:** a küszöb 44. Két kizárás kell hozzá, különben használhatatlanul zajos:

- **WCAG 2.5.8 inline-kivétel:** a folyó szövegbe ágyazott, `display: inline` link ne
  bukjon el — ott a méretet a sortörés adja, nem a design.
- **Dokumentált kivétel a kódban:** a `ReviewsCarousel` pöttyei `h-11 w-6`-osak
  (24 px a keskeny tengelyen). Ez tudatos, indokolt kivétel — a komponens kommentje le
  is írja, miért. Vezess be egy explicit, a DOM-ban látható jelölést (pl.
  `data-target-exempt="..."` a rövid indoklással), amit a script kihagy. Ne
  osztálynév-mintára szűrj, és ne írj a scriptbe komponensnevet.

**Amit ez fel fog hozni és most javíts:** a `Footer` navigációs és kapcsolat-linkjei
`min-h-9`-en (36 px) állnak → `min-h-11`. Ha más is előjön, döntsd el, hogy a
komponens hibája-e (javítsd), vagy indokolt kivétel (jelöld meg, és írd le, miért).

### 1.4 — (H3) Nagyítás-ellenőrzés

**A hiba:** a script hat szélességen tölt be, de mindig 100%-os nagyítással. Két külön
eset marad ki:

- **WCAG 1.4.10 Reflow.** Az 1280 px @ 400% page zoom geometriailag *azonos* egy
  320×256-os viewporttal (page zoom a `rem`-et, a `px`-et és a `vw`-t együtt skálázza).
  A ma futó 320×900 a szélességet lefedi, a **magasságot nem**: 256 px-en a sticky
  fejléc a képernyő negyedét viszi el. → Új futás: **320×256**.
- **WCAG 1.4.4 Resize Text.** Itt válik el a `rem` a `vw`-től: szövegnagyításkor csak a
  `rem` nő. Ez az az eset, ami a `clamp()` skálát és a kódba írt `px` értékeket tényleg
  próbára teszi. → Új futás: **1280×1024, `:root { font-size: 200% }`** (Playwrightben
  `page.addStyleTag`, a navigáció *után*, a mérés *előtt*).

Mindkét futásra ugyanaz a hibakészlet érvényes, mint a többire (túlcsordulás, célméret,
reveal, `h1`). A kimenet maradjon olvasható: a konfiguráció neve jelenjen meg a
`320`/`360`/… mellett.

### 1.5 — (M3) A no-JS ág

**A hiba:** a `[data-reveal] { opacity: 0 }` szabály a stíluslapból azonnal érvényes, de
a feloldó `[data-revealed]` attribútumot a `Reveal.tsx` `IntersectionObserver`-e teszi
rá, hidratálás után. Ha a JS nem fut le, a lap tartalmának túlnyomó része véglegesen
láthatatlan marad. Statikus exportnál, ahol a HTML amúgy is teljes, ez ingyen
orvosolható.

**Javasolt megoldás:** `<noscript>` blokk az `app/layout.tsx`-ben, benne `<style>`, ami
felülírja: `[data-reveal] { opacity: 1; transform: none }`. Nulla JS, nulla
villanás-kockázat.

**Ha a `<noscript>` nem a kívánt helyre kerül a buildben:** a rejtett állapot kerüljön
egy `html.js` osztály mögé, amit egy `beforeInteractive` inline script rak fel — ekkor
viszont *ellenőrizd*, hogy nincs villanás (elemek, amik láthatóan felvillannak, majd
eltűnnek). Ha villan, térj vissza a `<noscript>`-hez és oldd meg máshogy a
beillesztést.

**Kötelező:** a megoldást az `out/` alatti **épített HTML-en** igazold, ne a
devserveren. `npm run build`, aztán nézd meg a kimenetet.

**A kapuba:** egy `javaScriptEnabled: false` browser context, ami mind a hat oldalon
ellenőrzi, hogy minden `[data-reveal]` elem számított `opacity`-ja `1`. Ez a futás nem
görget és nem vár reveal-t — csak a láthatóságot méri.

### 1.6 — (M1) Időtartamok és stagger

**A cél:** belépő animáció ≤ 400 ms, egy csoporton belül a halmozott késleltetés
≤ 200 ms. Az NN/g mérése szerint az 500 ms fölötti scroll-fade-et a felhasználók
lassúnak érzékelik; az ajánlott sáv 100–400 ms.

| Hely | Ma | Cél |
|---|---|---|
| `globals.css` `[data-reveal]` transition | 700 ms | ≤ 400 ms (javasolt 350) |
| `globals.css` `transition-delay` | `index × 80ms`, korlát nélkül | `index × 60ms`, és az `index` a `Reveal.tsx`-ben 3-ra vágva → max 180 ms |
| `MobileNav` menüpontok | `120 + index × 40 ms`, 400 ms átmenet | halmozott késleltetés ≤ 200 ms, átmenet ≤ 400 ms |
| `Hero` `line-rise` | 900 ms | ≤ 400 ms |
| `Hero` `hero-image` | 1100 ms | ≤ 400 ms |
| `StarRating` `fade-in` késleltetés | `index × 70 ms` (5 csillag → 280 ms) | halmozott ≤ 200 ms |

**Amihez ne nyúlj:** az `--ease-out-expo` görbéhez. A lágyságot az adja, nem az
időtartam — ugyanaz a görbe 350 ms-on ugyanolyan lágy, csak nem várat.

**Amihez most még ne nyúlj:** a reveal *hatóköréhez*. Az, hogy a 14 házirend-szabály és
minden bekezdés animál, valós hiba (`M2`), de az a Fázis 4 dolga, mert hat oldalt érint.
Itt csak a sebesség változik.

### 1.7 — (K1) A `--color-gold-ink` értéke

**A hiba:** a token kódkommentje szerint „clears 4.5:1", de a `#a2732f` egyik tényleges
háttéren sem éri el. Ezen fut az `eyebrow` (13px), az aktív navlink (17px), a „Tovább" /
„Kevesebb" / „Részletek" gombok (14px) és az `/arak/` továbbvezető linkje (16px) — mind
normál méretű szöveg.

Számított kontrasztértékek (a módszer a `#767676` = 4,54:1 referenciával hitelesítve):

| Jelölt | `#ffffff` | `#fafafa` | `#faf5ee` (= `color-mix(gold 10%, white)`, a `NoticeBar` háttere) |
|---|---|---|---|
| `#a2732f` (mai) | 4,18 | 4,00 | 3,85 |
| `#96692a` | 4,83 | 4,62 | **4,45** ✗ |
| **`#936728`** | **4,99** | **4,78** | **4,60** ✓ |
| `#8f6526` | 5,18 | 4,96 | 4,77 |

**Amit csinálj:** `--color-gold-ink: #936728`. Számold újra magad is, mielőtt beírod —
és **javítsd a kommentet is**, hogy a szám igaz legyen (mondja meg, melyik háttérre
vonatkozik: a legszorosabb eset a közleménysáv, nem a fehér).

**Amihez ne nyúlj:** a `--color-gold` (`#cc9955`) az örökölt márkaszín, ornamensként
semmilyen kritériumot nem sért. Változatlan marad. A `--color-line`, `--color-muted`,
`--color-ink` szintén.

**Ez legyen külön, önmagában visszavonható commit** — ez a fázis egyetlen olyan lépése,
ami 49 helyen hoz látható színváltozást.

### 1.8 — (T5) Elválasztás teljes lefedéssel

**A hiba:** a `hyphens: auto` ma a `p, li, blockquote` hármason van. A `figcaption`, a
kártyafejlécek és a táblázatcellák kimaradnak — `masszázsszolgáltatásaimat` 24 betű,
`ajándékutalvány` 15, és ezek 320 px-en, kétoszlopos rácsban vagy egy
`w-[min(85vw,22rem)]` karusszel-kártyában elválasztás nélkül túlcsordulnak.

**Amit csinálj:** `hyphens: auto` a `body`-ra, öröklődéssel — ez a legegyszerűbb teljes
lefedés. A böngésző csak akkor választ el, ha a szó nem fér ki, tehát széles képernyőn
nincs mellékhatása. A `text-wrap: balance` a címsorokon marad.

**Amit ne csinálj:** `overflow-wrap: break-word` globálisan. Az bárhol elvág egy szót,
ami magyarul olvashatatlan; az `auto` a szótár szerinti helyeken tör. (A magyar szótár
támogatottsága 95,77% — Chrome/Edge 87+, Safari 9.1+, Firefox 9+ —, tehát ez működő
megoldás, nem remény.)

</munkamenet>

<ellenorzes>
A fázis akkor kész, ha mindez igaz:

1. `npm run lint` és `npm run typecheck` tiszta.
2. `npm run build` lefut, és `npm run verify` végigmegy **mind a nyolc konfiguráción**:
   320 / 360 / 390 / 768 / 1024 / 1440, plusz 320×256, plusz 1280×1024 @ 200% szöveg.
3. A no-JS futás zöld: mind a hat oldalon minden `[data-reveal]` elem látható.
4. Kézzel beszúrt `width:120vw` elemre a túlcsordulás-check **jelez** (aztán vedd ki).
5. Nincs a kódban 400 ms-nál hosszabb belépő animáció, és nincs 200 ms-nál nagyobb
   halmozott `transition-delay`.
6. Minden `text-gold-ink` előfordulásnál a számított kontraszt a tényleges háttérrel
   szemben ≥ 4,5:1.
7. Vizuális összevetés a K1 előtt/után: eyebrow, aktív navlink, `Button` outline
   variáns, „Tovább" / „Részletek" linkek. Screenshot vagy leírás — de nézd meg.

**Ami ezután is piros marad:** ne javítsd, ha nem az 1.1–1.8 hatókörébe esik. Írd ki
`docs/design/verify-baseline.md`-be: mi a hiba, melyik oldalon, melyik szélességen, és a
végrehajtási terv melyik fázisa fogja megoldani. Ez a fájl a Fázis 2 bemenete.
</ellenorzes>

<hatarok>
**Benne van:** `scripts/verify.mts`, `package.json`, `README.md`, `app/globals.css`,
`app/layout.tsx`, és a mozgással/célmérettel érintett komponensek (`Reveal.tsx`,
`MobileNav.tsx`, `Hero.tsx`, `StarRating.tsx`, `Footer.tsx`) — utóbbiak **kizárólag**
az 1.3 és 1.6 pont miatt.

**Nincs benne** (más fázis dolga, ne kezdd el, még „menet közben" sem):

- a reveal *hatókörének* szűkítése — Fázis 4 (`M2`)
- telefon a fejlécbe, nyitvatartás a láblécbe — Fázis 2 (`N2`, `C5`)
- `<h1>` és eyebrow szemantika — Fázis 3 (`T1`, `T4`)
- hover-emelés a kártyákról — Fázis 4 (`C1`)
- csillagsor és karusszel-pötty kontraszt — Fázis 4 (`A2`)
- `sizes` a háttérképeken — Fázis 5 (`P1`)
- billentyűzetes végigjárás — Fázis 5 (`H1`)
</hatarok>

<kotelezo_megkotesek>
1. **Statikus export.** Nincs szerver, nincs futásidejű logika. Minden kép build-időben
   készül.
2. **Nincs új futásidejű függőség.** Animációs könyvtár, polyfill, UI-készlet nem jöhet
   szóba. Dev-függőség is csak akkor, ha nélküle a feladat nem oldható meg — és akkor
   indokold.
3. **Az URL-ek nem változhatnak.** `trailingSlash: true`.
4. **Nincs szövegátírás.** A `content/` alatti magyar szövegekhez ebben a fázisban nem
   nyúlsz.
5. **Nincs rebrand.** A `--color-gold`, a betűtípusok és a logó változatlanok. A
   `--color-gold-ink` igazítása a saját, kódban deklarált céljához nem rebrand.
6. **Emoji nincs** — sem az oldalon, sem a kódban, sem a kimeneti üzenetekben.
7. **`prefers-reduced-motion` teljes kikapcsoló.** Bármit is állítasz be a mozgásnál, a
   `globals.css` reduced-motion blokkjának továbbra is mindent semlegesítenie kell.
8. **Nulla layout shift.** A `<Picture>` minden `<img>`-re kiírja a `width`/`height`-et.
   Ami ezt megtörné, az nem opció.
9. **A `body { overflow-x: hidden }` marad.** Backstop, nem hiba.
</kotelezo_megkotesek>

<stilus>
- **A kommentek a repó hangját kövessék:** angolul, tömören, és a *miértet* mondják el,
  ne azt, amit a kód amúgy is elmond. A `Reveal.tsx`, a `MobileNav.tsx` és a
  `Section.tsx` kommentjei a minta — mindegyik egy elvetett alternatívát vagy egy
  konkrét, megtörtént hibát dokumentál.
- Ahol egy meglévő komment mostantól hazudik (a `--color-gold-ink` „clears 4.5:1"
  sora, a `verify.mts` fejléce a 44 px-ről), ott a kommentet is javítsd. Egy hamis
  komment rosszabb, mint a hiányzó.
- A `verify.mts` konzolkimenete magyar, ékezet nélkül — ahogy ma is. Tartsd meg.
- Ne refaktorálj olyat, ami nem a nyolc feladat része.
</stilus>

<antipatternok>
- Ne írd meg a jelentést arról, hogy zöld, ha nem futtattad le. Minden állítást, ami
  méréssel eldönthető, méréssel dönts el.
- Ne lazíts a kapun, hogy zöld legyen. Ha az 1.3 után harminc elem bukik el, az harminc
  valós hiba vagy harminc indokolt kivétel — mindkettőt le kell írni, egyiket sem
  szabad elrejteni.
- Ne szereld le a `body { overflow-x: hidden }`-t azért, hogy a scrollWidth-check
  működjön. Az a védelem valódi; a kaput élesítjük mellette.
- Ne vezess be új tokent, új árnyékot, új rádiuszt. A vizuális eszközkészlet zárt (`A1`).
- Ne kezdd el a Fázis 2–5 munkáját, még akkor sem, ha „épp ott vagy a fájlban".
- Ne találgass kontrasztértéket. Számold ki, és írd le a számot.
</antipatternok>

<befejezes>
Amikor kész vagy, a chatben ne idézd vissza a diffet. Írj helyette:

1. **Mi változott** — feladatonként (`1.1`–`1.8`) egy-két mondat, a módosított fájlokkal.
2. **A kapu állapota** — a `npm run verify` kimenetének lényege: hány konfiguráció fut,
   mi zöld, mi piros.
3. **A baseline** — mi került a `docs/design/verify-baseline.md`-be, és melyik fázishoz.
4. **Amit másképp oldottál meg**, mint ahogy a prompt írja, és miért.
5. **Amiben nem vagy biztos** — kifejezetten az 1.5-ös `<noscript>` megoldás
   viselkedése a buildben, és az 1.3 után előjövő kivételek megítélése.
</befejezes>
