# Verify baseline — a Fázis 1 lezárása után

**Készült:** 2026-08-13. **Mérve:** a `46c0ffc` commit `out/` kimenetén,
`npm run build && npm run verify`, Chromium headless.

Ez a fájl a Fázis 2 bemenete. Két dolgot rögzít: mit jelent pontosan, hogy a kapu
zöld, és mi az, ami ezután is hibás, csak a kapu nem látja.

---

## 1. A kapu állapota: zöld

`npm run verify` mind a hat oldalt végigméri nyolc konfigurációban, plusz egy
JavaScript nélküli futásban. **Nulla problémát jelez.**

| Oldal | reveal elem | mind a 8 konfiguráción lefut | JS nélkül látható |
|---|---|---|---|
| `/` | 6 | 6/6 | 6/6 |
| `/bemutatkozas/` | 7 | 7/7 | 7/7 |
| `/arak/` | 9 | 9/9 | 9/9 |
| `/arak/elso-masszazs/` | 12 | 12/12 | 12/12 |
| `/hazirend/` | 19 | 19/19 | 19/19 |
| `/kapcsolat/` | 5 | 5/5 | 5/5 |

Konfigurációk: 320 / 360 / 390 / 768 / 1024 / 1440 px, továbbá 320×256
(WCAG 1.4.10 reflow) és 1280×1024 `:root { font-size: 200% }` mellett
(WCAG 1.4.4 resize text).

Amit a zöld **igazol**: nincs vízszintes túlcsordulás egyetlen elemen sem (a
`body { overflow-x: hidden }` backstop mellett, elemenkénti méréssel — kézzel
beszúrt `width:120vw` elemre mind a nyolc konfiguráción jelez); minden
kattintható elem legalább 44×44, két dokumentált kivétellel; oldalanként
pontosan egy `<h1>`; és JavaScript nélkül sem marad rejtve tartalom.

Egy külön, kézi méréssel ellenőrizve (nincs a kapuban, Fázis 5 / 7.3 teszi be):
`prefers-reduced-motion: reduce` mellett a `/`, `/hazirend/` és
`/arak/elso-masszazs/` oldalon 0 rejtett reveal elem és 0 olyan elem, aminek
bármilyen animáció- vagy átmenet-időtartama nagyobb 1 ms-nál.

---

## 2. Ami piros marad — a kapu vakfoltjai, fázishoz rendelve

Egyik sem a kapu hibája: olyan hibák, amiket géppel ebben a formában nem lehet
eldönteni, vagy amikhez a kapu bővítése a következő fázisok dolga.

### Fázis 4 — `M2`: a fő szövegtörzs animál

Mért adat, 320 px-en (de minden szélességen ugyanez):

| Oldal | `[data-reveal]` összesen | ebből `<li>` / `<p>` / címsor |
|---|---|---|
| `/hazirend/` | 19 | **14** (`LI` — a 14 házirend-szabály) |
| `/arak/elso-masszazs/` | 12 | **7** (`LI` — a 7 tanács) |
| `/` | 6 | 0 (`ARTICLE`, `DIV`) |
| `/arak/` | 9 | 0 (`DIV`, `ARTICLE`) |
| `/bemutatkozas/` | 7 | 0 (`DIV`, `FIGURE`) |
| `/kapcsolat/` | 5 | 0 (`DIV`) |

A Fázis 1 csak a *sebességet* állította (700 → 350 ms, stagger 180 ms-ra vágva);
a hatókör szűkítése a Fázis 4 dolga. Onnantól a fenti reveal-számok csökkenni
fognak — ez várt, nem regresszió.

### Fázis 4 — `C1`: hover-emelés nem kattintható elemen

Mért: olyan elem, amin `hover:-translate-y-*` van, de sem maga nem link/gomb,
sem link/gomb nincs benne.

| Oldal | darab | mi |
|---|---|---|
| `/` | 4 | `ServiceCard` `<article>` |
| `/arak/` | 7 | `PriceCard` `<article>` |

A `ServiceCard` képének `group-hover:scale-105`-e ugyanide tartozik.

### Fázis 4 — `A2`: szín az egyetlen információhordozó

Számított kontrasztértékek (WCAG relatív luminancia, a módszer `#767676` =
4,54:1 referenciával hitelesítve):

| Elem | Szín | Fehéren | `--color-subtle`-ön |
|---|---|---|---|
| Kitöltött csillag, aktív pötty | `--color-gold` `#cc9955` | 2,54:1 | 2,44:1 |
| Kitöltetlen csillag, inaktív pötty | `--color-line` `#e8e4e0` | 1,26:1 | 1,21:1 |

Egyik sem éri el a nem-szöveg elemekre előírt 3:1-et, és az értékelés egyetlen
vizuális hordozója ma a szín. A `--color-gold` értéke **nem változhat** (örökölt
márkaszín), tehát a megoldás alakkülönbség, nem színcsere. Minden oldalon, minden
szélességen fennáll; a csillagsor a `/` és a `/kapcsolat/` oldalon látszik.

### Fázis 2 — `C5`, `N2`, `B1`, `B2`, `N1`: elérhetőség

Változatlanul igaz a végrehajtási terv 4. szakaszának leírása: a nyitvatartás
csak a JSON-LD-ben van, a fejlécben nincs `tel:` link egyetlen szélességen sem, a
`/bemutatkozas/` és a `/hazirend/` CTA nélkül ér véget. A kapu ezekből semmit nem
mér — nincs is olyan géppel eldönthető feltétel, amit itt megfogalmazhatnánk.

### Fázis 3 — `T1`, `T4`, `F2`, `K2`, `T3`: szemantika

A `h1`-check továbbra is pontosan egyet vár oldalanként, és mind a hat oldalon
teljesül — de azt nem tudja megmondani, hogy a főoldal `<h1>`-e a Caveat mottó,
ami se a szalon nevét, se a szolgáltatás tárgyát nem közli. Ugyanígy vak a
`Footer` és a `ContactDetails` eyebrow-ként renderelt `<h2>`-jeire.

### Fázis 5 — `H1`, `P1`

A billentyűzetes végigjárás és a `sizes` értékek nincsenek mérve.

---

## 3. Amit maga a kapu nem lát — a következő bővítések

Ezek a `verify.mts` ismert korlátai. Egyik sem hiba ma, de mindegyik olyan pont,
ahol a kapu csendben átenged valamit.

1. **A célméret-ellenőrzés csak `a[href]` és `button` elemeket néz.** Ma nincs
   más interaktív elem az oldalon (nincs űrlap, nincs `role="button"`, nincs
   `<summary>`), de ha lesz, a kapu nem fogja mérni.
2. **Az inline-kivétel bármilyen `display: inline` linket átenged**, nem csak a
   folyó szövegben állót. Ma összesen **egy** elemet érint: a `/kapcsolat/`
   bekezdésébe ágyazott link (320 px-en 279×75, tehát kivétel nélkül is átmenne).
   Ez a kivétel jelenleg semmit nem takar el.
3. **A `data-target-exempt` egyetlen helyen szerepel:** a `ReviewsCarousel`
   pöttyein (24×44). Ha máshol is megjelenik, azt tételesen indokolni kell.
4. **A túlcsordulás-ellenőrzés kihagyja azt az elemet, amit egy őse levág vagy
   görget.** Ez kell ahhoz, hogy a `MobileNav` szándékosan levágott drawere és a
   `ReviewsCarousel` sávja ne adjon hamis riasztást — de ezzel együtt egy olyan
   elem, ami *egy vágó konténeren belül* lóg ki (és így vizuálisan csonkul), nem
   látszik. A drawer ma 320 px-en 272 px-rel lóg túl a vágókeretén, szándékosan.
5. **A hibalisták oldalanként és konfigurációnként 4 elemre vannak vágva.** Ha
   egy futás négy túl kicsi elemet ír ki, lehet, hogy több van.
6. **A no-JS futás csak a `[data-reveal]` opacitását nézi, egyetlen szélességen
   (390 px).** Azt nem méri, hogy a karusszel és a mobil menü használható-e JS
   nélkül (a `ReviewsCarousel` kommentje szerint natív görgetésre esik vissza —
   ez ellenőrizetlen állítás).
7. **A `prefers-reduced-motion` nincs a kapuban.** A végrehajtási terv 7.3-a
   írja elő; addig kézi mérés (lásd 1. szakasz).
8. **A `T5` elválasztás lefedettsége nincs mérve.** A `hyphens: auto` most a
   `body`-ról öröklődik, tehát oldalanként 50–99 olyan elem kapja meg, ami eddig
   kimaradt (`figcaption`, `h1`–`h3`, `span`, `td`). Mérés szerint viszont ma
   **egyetlen** ilyen elem sem csordulna túl nélküle 320 és 360 px-en: a változás
   megelőzés, nem meglévő hiba javítása. Ha a `content/` alá hosszabb összetett
   szó kerül, a védelem ott lesz.
