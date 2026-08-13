# Frontend design elvek — Libra Masszázs Szalon

**Készült:** 2026-08-08. **Állapot:** a repó `ccde34b` commitjához mérve.

Ez a dokumentum azokat az elveket rögzíti, amelyekből a libraszalon.hu vizuális és
viselkedési döntései levezethetők. Három forrásból áll össze: mi van ma megépítve a
repóban, mit mond a 2026-os mérce (WCAG 2.2 AA, Core Web Vitals, publikált
UX-kutatás), és e kettő metszetéből mi érvényes *erre* a szalonra — egy masszőr,
telefonos időpontfoglalás, 3-4 hetes várólista, örökölt paletta és betűkészlet.

**Ez nem végrehajtási terv.** Nincs benne fázisolás, feladatlista, sorrend vagy
becslés. Az elvek a *mit* és a *miért* kérdésre válaszolnak; a *hogyan* egy külön
dokumentum tárgya. Minden elv mellett ott a mai állapot (`✓` teljesül / `~` részben /
`✗` hiányzik / `?` olvasásból nem eldönthető), hogy a végrehajtási terv innen tudjon
indulni.

---

## 1. Vezetői összefoglaló

1. **A `--color-gold-ink` nem teljesíti a saját célját.** A `globals.css` kommentje
   szerint ez a lépcső „clears 4.5:1", de a `#a2732f` fehéren **4,18:1**,
   `--color-subtle`-ön 4,00:1, a közleménysáv hátterén 3,85:1. Ez a token viszi az
   összes `eyebrow`-t (13px), az aktív navlinket (17px) és a „Tovább" / „Részletek"
   gombokat (14px) — mind normál méretű szöveg, mind AA alatt.
2. **A scroll-reveal kétszer lassabb a kutatási küszöbnél.** NN/g mérése szerint az
   500 ms fölötti fade-et a felhasználók lassúnak érzékelik, az ajánlott sáv
   100–400 ms [11]. A repó 700 ms-mal fut, plusz `index × 80 ms` stagger.
3. **A fő szövegtörzs animál, pedig nem kellene.** A kutatás a scroll-reveal-t
   másodlagos tartalomra korlátozza, a fő szövegre kifejezetten nem ajánlja [10][11].
   A repóban a 14 házirend-szabály, a 7 gyakorlati tanács, mind a 7 árkártya és
   gyakorlatilag minden bekezdés `opacity: 0`-ról indul.
4. **A nyitvatartás sehol nem látszik.** A 9–17, mind a hét napra, kizárólag a
   JSON-LD-ben szerepel. Egy telefonhívásra épülő szalonnál ez a legdrágább hiány:
   a látogató nem tudja, mikor van értelme tárcsázni.
5. **A telefonszám négy helyen létezik, négy oldal tartalmában nulla helyen.** Az
   `/arak/`, `/arak/elso-masszazs/`, `/hazirend/` és `/bemutatkozas/` törzsében
   nincs `tel:` link; a desktop headerben sincs. NN/g megfogalmazása erre: „Never
   hide or remove phone numbers" [13].
6. **A vélemény-csillag nem fog megjelenni a találati listában.** Google policy:
   ha az értékelt entitás maga kontrollálja a róla szóló véleményeket, a
   `LocalBusiness` / `Organization` oldalak nem jogosultak a csillagos rich resultra
   [16]. A `businessJsonLd()` pontosan ezt teszi. Designkövetkezmény: az 5,0-s átlagot
   és a 7-es darabszámot magán az oldalon kell megmutatni.
7. **Két kártyatípus kattinthatóságot ígér, amit nem vált be.** A `ServiceCard` és a
   `PriceCard` `<article>`, nem link, mégis `hover:-translate-y-1`, `shadow-lift` és
   `group-hover:scale-105` van rajtuk.
8. **A `body { overflow-x: hidden }` megvakítja a saját minőségi kaput.** A
   `verify.mts` első ellenőrzése `scrollWidth > innerWidth + 1`-et néz — amit a
   backstop elnyel. A túlcsordulás-detektálás gyakorlatilag nem tud tüzelni. A script
   ráadásul nincs bekötve sem a `package.json`-be, sem a CI-be.
9. **A főoldal `<h1>`-e egy kézírásos idézet**, nem a szalon megnevezése. A Caveat
   28→56px-en, mint az oldal egyetlen legfelső szintű címe, egyszerre tipográfiai és
   információs architektúra kérdés.
10. **A szekcióváltás színjelzése láthatatlan.** A `--color-surface` és a
    `--color-subtle` közötti kontraszt 1,04:1. Ami elválasztja a szekciókat, az a
    térköz és a `GoldRule`, nem a tónus.
11. **A szegmensben az ár rejtett, a nyitvatartás látszik — a Libra fordítva csinálja.**
    Öt megnézett magyar szalonoldalból négy nem közöl árat, három napi bontásban
    kiírja a nyitvatartást [20]. A teljes, magyarázott árlista megtartandó
    differenciátor; a nyitvatartás hiánya pótolandó.
12. **Amit a repó jól csinál, és nem szabad elrontani:** a fluid típusskála minden
    lépcsője max ≤ 2,5× min, rem+vw preferált értékkel — ez az a feltétel, amivel a
    `clamp()` biztosan átmegy a WCAG 1.4.4-en [18]. A `<Picture>` minden képre
    width/height-ot ír (CLS = 0). A térkép kattintásra tölt. A `prefers-reduced-motion`
    egyetlen kapcsoló, ami mindent kivesz.

---

## 2. A design karakter tézise

A Libra oldalának karaktere egy *csendes szakmai rendelő*, nem egy wellness-márka.
Aki ideérkezik, vagy fájdalommal érkezik, vagy ajándékot keres — mindkét esetben azt
akarja tudni, hogy kihez megy, mennyibe kerül, meddig tart, és mikor hívhatja fel. A
szalon tele van, tehát nem meggyőzni kell, hanem *informálni*: a jó látogató az, aki
reális elvárással veszi fel a telefont. Ebből következik, hogy minden vizuális eszköz
alárendelt a szöveg olvashatóságának és az elérhetőség megtalálhatóságának. Az arany
vonal, az ellazult fotó és a kézírásos mottó a hangulatért felel — de egyetlen tényt
sem hordozhat.

- **Nyugodt, de nem élettelen.** Van mozgás, de rövid és egyszeri; a nyugalom a
  térközből jön, nem a mozdulatlanságból.
- **Meleg, de nem édeskés.** Az arany akcentus, nem felület; nincs pasztell keret,
  nincs virágornamens.
- **Szakmai, de nem klinikai.** Végzettség és pontos időtartamok — de fehér köpeny
  és ikonrácsos „szolgáltatásportfólió" nélkül.
- **Személyes, de nem intim.** Egy arc, egy név, egy hang; nem életmódblog.
- **Átlátható, de nem hivataloskodó.** Az árlista és a házirend teljes — de nem
  szerződésszerű, hanem kérdés-válasz.
- **Visszafogott, de nem szegényes.** Kevés eszköz, mindegyik szándékos: két
  háttértónus, egy vonal, egy árnyékpár, egy 4px-es rádiusz.
- **Türelmes, de nem passzív.** Semmi nem sürget; a telefon viszont mindig kéznél van.

Ha egy döntésnél nincs explicit elv, ebből a hét párból kell levezetni.

---

## 3. Elvek

### A — Márkakarakter és vizuális hang

**A1. A vizuális eszközkészlet zárt.**

*Elv.* Két háttértónus (`--color-surface`, `--color-subtle`), egy 4px-es rádiusz, két
árnyék (`--shadow-card`, `--shadow-lift`), egy 3px×48px arany vonal (`GoldRule`). Új
dekoratív elem — keret, minta, gradiens, ikonháttér, harmadik tónus — nem kerül be. Ha
egy szekció üresnek tűnik, a válasz több térköz vagy kevesebb tartalom, nem több dísz.

*Miért.* A rendszer épp elég szűk ahhoz, hogy konzisztens maradjon egy olyan kódbázison,
amin nem designer dolgozik naponta. Egy bővülő dísztár első áldozata mindig a
konzisztencia — és ezen az oldalon minden vizuális zaj a hosszú magyar szövegtől veszi
el a figyelmet, ami a tényleges tartalom.

*Hogyan látszik itt.* `app/globals.css` `@theme` blokkja és a `:root` árnyékpárja;
`components/ui/GoldRule.tsx`; a `rounded` (0.25rem) az egyetlen használt rádiusz a
`rounded-full` ikongombokon kívül.

*Elvetett alternatíva.* Nagyobb rádiusz (`rounded-xl`) és erősebb árnyék a kártyákon.
Elvetve: a 4px-es rádiusz és a halvány, ink-alapú árnyék az örökölt Elementor-esztétika
legjobb része, és a nagy rádiusz a 14 elemű házirendlista mellett dobozosabbá, nem
lágyabbá teszi az oldalt.

*Ellenőrzés.* Nincs új `--shadow-*` vagy `--radius-*` token, és nincs `rounded-lg` /
`rounded-xl` / `rounded-2xl` a kódban.

*Állapot.* ✓ teljesül.

*Forrás.* `app/globals.css`.

---

**A2. A dísz sosem hordoz információt.**

*Elv.* A `--color-gold` (`#cc9955`) és a `--color-line` (`#e8e4e0`) csak olyan elemen
jelenhet meg, amelynek eltávolítása után is teljes az információ: elválasztó vonal,
ikon egy szöveges címke mellett, sorszám egy `<ol>`-ban, keret egy címkével azonosított
gombon. Amint egy ilyen elem az egyetlen hordozója egy adatnak vagy állapotnak, kap
mellé alakot vagy szöveget.

*Miért.* A `#cc9955` fehéren 2,5:1, a `#e8e4e0` 1,26:1 — mindkettő a WCAG 1.4.3
4,5:1-es és az 1.4.11 3:1-es küszöbe alatt van [3][4]. Ez nem javítható a márka
feláldozása nélkül, tehát a megoldás nem a színek sötétítése, hanem a szerepük
szűkítése. A 1.4.11 kifejezetten megengedi a gyenge kontrasztú keretet, ha a vezérlőt a
látható tartalma azonosítja [4] — a kérdés mindig az, hogy azonosítja-e. Ma két helyen
nem: a `StarRating` kitöltött csillaga az értékelés egyedüli vizuális hordozója, és a
`ReviewsCarousel` pöttyeinek állapotát 1,26:1 és 2,5:1 színpár közli (a 6px→16px
szélességváltozás az egyetlen érvényes jelzés).

*Hogyan látszik itt.* `GoldRule`; a `Footer` és a `ContactDetails` ikonjai (mind
szöveges címke mellett); a házirend és a tippek `01`–`14` sorszámai (`aria-hidden`, az
`<ol>` viszi a szemantikát); `components/ui/Button.tsx` `outline` variánsa
(`--color-ink` címkével); határeset: `components/home/StarRating.tsx`,
`components/home/ReviewsCarousel.tsx:125-129`.

*Elvetett alternatíva.* Az arany globális sötétítése `--color-gold-ink`-re, a
`--color-line` sötétítése 3:1-re. Elvetve: a `#cc9955` az örökölt márkaszín, és
ornamensként semmilyen kritériumot nem sért; a kártyakeretek pedig tucatszám vannak az
oldalon, sötétítésük rácsossá tenné a hosszú listákat.

*Ellenőrzés.* Minden `text-gold` / `bg-gold` / `border-line` előfordulás mellett van
olyan szöveg, ikon vagy alakzat, ami a színtől függetlenül közli ugyanazt.

*Állapot.* ~ részben — a csillagsor és a karusszel-pötty még nem felel meg.

*Forrás.* [3], [4]; `app/globals.css:15-16`, `components/home/StarRating.tsx`.

---

### K — Szín és kontraszt

**K1. A `--color-gold-ink` addig nem használható normál méretű szövegre, amíg el nem
éri a 4,5:1-et.**

*Elv.* Az arany szövegváltozat célja explicit a kódban: 4,5:1 fehéren. A jelenlegi
`#a2732f` ezt nem éri el. Amíg a token értéke nem változik, `--color-gold-ink` csak
18,66px félkövér vagy 24px feletti szövegen, illetve nem-szöveg elemen (fókusz-gyűrű,
keret) állhat.

*Miért.* WCAG 2.x relatív-luminancia képlettel számolva a `#a2732f` relatív
luminanciája 0,2015, amiből a kontraszt fehéren **4,18:1**, a `--color-subtle`
(`#fafafa`) hátterén 4,00:1, a közleménysáv `color-mix(gold 10%, white)` hátterén
3,85:1. (A számítást a `#767676` = 4,54:1 ismert referenciaértékkel hitelesítettem.)
Ma ezen fut az `eyebrow` utility (13px), az aktív navlink (17px), a „Tovább" /
„Kevesebb" / „Részletek" gombok (14px) és az `/arak/` oldal továbbvezető linkje (16px)
— mind normál méretű szöveg [3]. A 3:1-es nem-szöveg küszöböt viszont mindenütt
teljesíti [4], tehát a fókusz-gyűrű (`outline: 2px solid var(--color-gold-ink)`)
rendben van.

*Hogyan látszik itt.* `app/globals.css:18-20` (a token és a kommentje); az `eyebrow`
`@utility` blokk; `components/layout/Header.tsx:51`;
`components/home/ReviewCard.tsx:100`; `components/layout/NoticeBar.tsx:85`;
`app/arak/page.tsx`.

*Elvetett alternatíva.* Az érintett feliratokat `--color-ink`-re váltani, a tokent
békén hagyni. Elvetve: az arany szövegakcentus a hierarchia része — az eyebrow és az
aktív navlink épp attól működik, hogy nem fekete. A token célértékhez igazítása nem
rebrand: a `--color-gold-ink` nem örökölt márkaszín, hanem ebben az újraépítésben
született derivátum, amelynek deklarált célja egy kontrasztszám.

*Ellenőrzés.* Minden `text-gold-ink` előfordulásnál a számított kontraszt a tényleges
háttérrel szemben ≥ 4,5:1, vagy a szöveg mérete a „large text" definíció fölött van.

*Állapot.* ✗ hiányzik.

*Forrás.* [2], [3], [4]; `app/globals.css:18-20`.

---

**K2. A szekcióhatárt a ritmus jelöli, nem a tónus.**

*Elv.* A `--color-surface` és a `--color-subtle` váltakozása hangulati finomság, nem
strukturális jelzés. A szekcióhatárt a függőleges térköz (`Section` `spacing` skálája),
az `eyebrow` + `GoldRule` + `h2` hármas és a tartalom típusváltása jelöli. A `spacing`
fokozat a tartalom sűrűségéhez rendelt, nem a sorrendjéhez.

*Miért.* A `#ffffff` és a `#fafafa` közötti kontraszt 1,04:1 — ez napfényben, olcsó
telefonpanelen vagy csökkentett kontrasztú megjelenítésen nem látszik. A kód viszont
több helyen úgy viselkedik, mintha dolgozna: az `/arak/` oldalon egyetlen szekció van a
`PageHeader` után, tehát ott nincs is váltás, a `/bemutatkozas/`-on négy váltás követi
egymást mechanikusan. Közben a `loose` spacing fokozat definiálva van, de sehol nincs
használva — épp a leghosszabb szövegű oldalakon (`/hazirend/` ~630 szó,
`/arak/elso-masszazs/` ~428 szó) hiányzik a tagoló levegő, ahol a szöveg maga is
tagolatlan (lásd T3).

*Hogyan látszik itt.* `components/ui/Section.tsx` `tone` propja és `SPACING` mapje
(`tight` / `normal` / `loose`); `components/ui/PageHeader.tsx` (mindig `bg-subtle`);
`components/layout/Footer.tsx`.

*Elvetett alternatíva.* Erősebb szekció-háttér (pl. `#f2efec`) a látható tagolásért.
Elvetve: az örökölt paletta hűvös-semleges fehérekre épül; egy melegebb harmadik tónus
a 7%-os háttérfotók alá kerülve elszínezi őket, és a `--color-line` határvonalak
elvesznek benne.

*Ellenőrzés.* Szürkeárnyalatosra állított képernyőn is világos, hol kezdődik új
szekció; nincs olyan oldal, ahol három egymást követő szekció azonos `spacing` értéket
kap eltérő tartalomsűrűség mellett.

*Állapot.* ~ részben.

*Forrás.* [3]; `app/globals.css:14-16`, `components/ui/Section.tsx`.

---

### T — Tipográfia

**T1. A Caveat legfeljebb egy mondat, sosem UI-felirat, és sosem `<h1>`.**

*Elv.* A `--font-script` szerepe az idézet és a mottó: rövid, érzelmi, kihagyható. Nem
lehet benne gombfelirat, listaelem, hosszú bekezdés, és nem lehet olyan szövegben, amit
a látogatónak el *kell* olvasnia a döntéshez.

*Miért.* A kézírásos betűk irreguláris betűformái lassabban dolgozhatók fel, és
hosszabb szövegben akadálymentességi szempontból problémásak. A főoldal `<h1>`-e ma a
Caveat mottó 28→56px-en — ez a lap egyetlen legfelső szintű címe, és se a szalon nevét,
se a szolgáltatás tárgyát nem közli. Az `<h1>` viszont az az elem, amiből a
képernyőolvasót használó látogató és a keresőmotor is megállapítja, miről szól az oldal.
A `verify.mts` ellenőrzi, hogy pontosan egy `<h1>` van — azt nem, hogy mit mond.

*Hogyan látszik itt.* `components/home/Hero.tsx:17`; `app/page.tsx:46` (záró CTA);
`app/bemutatkozas/page.tsx` (Hippokratész-idézet és a záró mondat);
`components/layout/Footer.tsx:19` (tagline). Négy előfordulás, amiből egy `<h1>`.

*Elvetett alternatíva.* A hero átrendezése a mottó eltávolításával. Elvetve: a mottó a
szalon hangja, és a `content/pages/home.ts` `heroQuote` szerkezete kifejezetten a
soronkénti animációra készült. Nem a mottóval van baj, hanem azzal, hogy `<h1>`-ként
áll — a tartalom nem változik, a szerep igen.

*Ellenőrzés.* Egyetlen `font-script` elem sem `<h1>`, `<button>` vagy `<label>`, és
egyik sem hosszabb két mondatnál.

*Állapot.* ✗ hiányzik.

*Forrás.* [1]; `components/home/Hero.tsx`, `content/pages/home.ts`.

---

**T2. Minden fluid típuslépcső maximuma legfeljebb 2,5-szerese a minimumának, és a
preferált érték rem-et is tartalmaz.**

*Elv.* Új `--text-*` token csak akkor kerülhet be, ha teljesíti ezt a két feltételt.
Tiszta `vw`-alapú preferált érték nem megengedett.

*Miért.* A `vw` egység nem skálázódik böngészőnagyítással, tehát önmagában használva a
szöveg nem nagyítható 200%-ra — ez WCAG 1.4.4 bukás [7]. A `clamp()` akkor biztosan
átmegy, ha a maximum ≤ 2,5× minimum, mert így a rem-komponens nagyításkor mindig eléri
a szükséges méretet, mielőtt a felső korlát elvágná [18]. A jelenlegi skála mindenütt
teljesíti: `--text-hero` pontosan 2,0×, `--text-h1` 1,6×, `--text-h2` 1,5×,
`--text-h3` 1,22×, `--text-body` 1,06×, `--text-price` 1,33×.

*Hogyan látszik itt.* `app/globals.css:26-33`. A komponensek
`text-[length:var(--text-h2)]` formában hivatkoznak a tokenekre — ez a hivatkozási
minta is része az elvnek, mert így egy tokenérték változtatása mindenütt egyszerre hat.

*Elvetett alternatíva.* Oldalanként hangolt betűméretek arbitrary értékekkel. Elvetve:
hat oldal és hat töréspont mellett ez azonnal szétcsúszik, és a 2,5×-ös szabályt sem
lehetne rajta ellenőrizni.

*Ellenőrzés.* Minden `--text-*` tokenre `max / min ≤ 2.5`, és minden `clamp()`
preferált értékében szerepel `rem`.

*Állapot.* ✓ teljesül.

*Forrás.* [7], [18]; `app/globals.css:25-33`.

---

**T3. Ahol a forrásszöveg egyetlen 200+ szavas bekezdés, ott a tipográfia kompenzál —
nem a szöveg.**

*Elv.* A szöveg szó szerint az örökölt oldalról jön, és ez szándékos. Ezért a hosszú,
tagolatlan bekezdéseknél a mérték (`prose-measure`, 68ch), a sorköz (1,75) és a
bekezdés körüli térköz veszi át a tagolás szerepét. Ilyen blokk nem kerülhet szűk
oszlopba, és nem kaphat mellé sticky elemet.

*Miért.* A `content/pages/first-massage.ts` `assessment.body` 237 szó / 1777 karakter
egyetlen bekezdésben; az `about.ts` `intro` 153 szó, a `balance` 115 szó, szintén
egyben. A Baymard ajánlása 50–75 karakter/sor, a WCAG 1.4.8 felső határa 80 [15]. A
68ch a sáv felső részén van — hosszú tömbnél ez a maximum, nem a célérték. A
`first-massage` oldalon ez a bekezdés ma egy `1fr / 20rem` rácsban áll, mellette
`lg:sticky lg:top-28` képpel: a leghosszabb szövegblokkot kíséri a legmozdulatlanabb
elem.

*Hogyan látszik itt.* `app/globals.css` `prose-measure` `@utility`;
`app/arak/elso-masszazs/page.tsx`; `app/bemutatkozas/page.tsx`.

*Elvetett alternatíva.* A bekezdések feldarabolása a `content/` fájlokban. Elvetve: a
szövegátírás explicit tiltás, és a szó szerinti átvétel az oldal indexelési
történetének és a tulajdonos hangjának megőrzése miatt szándékos.

*Ellenőrzés.* Minden 150 szónál hosszabb bekezdés `prose-measure`-ben van, és nincs
mellette `sticky` elem.

*Állapot.* ~ részben.

*Forrás.* [15]; `content/pages/first-massage.ts`, `content/pages/about.ts`.

---

**T4. Az `eyebrow` rövid kategóriacímke — nem mondat és nem címsor.**

*Elv.* Az `eyebrow` utility (13px, 600, `letter-spacing: 0.08em`, `uppercase`)
legfeljebb három-négy szót visel, mondatvégi írásjel nélkül. Ugyanakkor nem állhat
heading elemen sem: ami `<h2>`, az `--text-h2` méretű, és ami eyebrow, az `<p>`.

*Miért.* A csupa nagybetűs szöveg elveszíti a szóképformát, ami a gyors olvasás alapja,
és fix 13px-en (a skála egyetlen nem-fluid tagja) ez a leggyengébb pont az oldalon —
ráadásul `--color-gold-ink`-en fut, tehát K1 is érinti. Ma mindkét irányban sérül. A
tartalom felől: a `home.reviews.eyebrow` hét szó, két kérdő mondat, a
`houseRules.scope.heading` hat szó kisbetűs forrásszöveggel, amit a CSS verzálba tesz.
A szemantika felől: a `ContactDetails` és a `Footer` négy `<h2>`-je 13px-es eyebrow-ként
renderelődik, miközben a `scope.heading` vizuálisan címként viselkedik, de `<p>`. Aki
képernyőolvasóval navigál címsorok között, mást lát, mint aki a képernyőt nézi — és a
`verify.mts` ezt nem fogja meg, mert csak az `<h1>` darabszámát ellenőrzi.

*Hogyan látszik itt.* `app/globals.css` `eyebrow` `@utility`; `content/pages/home.ts`
`reviews.eyebrow`; `content/pages/house-rules.ts` `scope.heading`;
`components/contact/ContactDetails.tsx:10` és `:47`; `components/layout/Footer.tsx:26`
és `:43`.

*Elvetett alternatíva.* A `text-transform: uppercase` elhagyása az `eyebrow`-ról, vagy
a szemantikus `<h2>` szint leépítése `<p>`-vé. Elvetve: a verzál eyebrow az örökölt
tipográfia felismerhető eleme, és rövid címkéknél (`90 perc`, `Elérhetőségek`) jól
működik; a lábléc- és kapcsolat-blokkok pedig valódi alszekciók, amelyekre a
landmark-szerkezet épül — a helyes irány a vizuális súly emelése, nem a szemantika
gyengítése.

*Ellenőrzés.* Egyetlen `eyebrow` osztályú elem szövege sem hosszabb négy szónál és nem
tartalmaz mondatvégi írásjelet; `eyebrow` osztály nem áll heading elemen; minden `<h2>`
mérete `--text-h2`.

*Állapot.* ✗ hiányzik.

*Forrás.* [1]; `app/globals.css`, `components/contact/ContactDetails.tsx`.

---

**T5. Az elválasztás a magyar szövegnél alaprendszer, nem finomhangolás.**

*Elv.* Minden folyó szöveget tartó elemen `hyphens: auto` van a `<html lang="hu">`
mellett — nem csak a `p`, `li`, `blockquote` hármason, hanem mindenütt, ahol összetett
szó kerülhet szűk oszlopba (`figcaption`, kártyafejléc, táblázatcella).

*Miért.* A magyar összetett szavak (`ajándékutalvány` 15 betű, `állapotfelmérés`,
`masszázsszolgáltatásaimat` 24 betű) 320 px-en, kétoszlopos rácsban vagy egy
`w-[min(85vw,22rem)]` karusszel-kártyában elválasztás nélkül túlcsordulnak. A böngészők
csak akkor választanak el, ha a `lang` attribútum jelen van és van hozzá szótár [19]; a
magyar szótár globális támogatottsága 95,77% (Chrome/Edge 87+, Safari 9.1+, Firefox
9+) [19], tehát ez működő megoldás, nem remény. A jelenlegi szabály jó, csak nem
teljes: a `h1`–`h4` kimarad (ott a `text-wrap: balance` a stratégia, ami viszont
Chromiumban csak hat sorig hat [19]), és a `figcaption` sem szerepel.

*Hogyan látszik itt.* `app/globals.css:95-101` (a szabály és a kommentje);
`app/layout.tsx` (`lang={site.lang}` = `"hu"`, és a `latin-ext` alszett mind a három
betűtípusnál); `app/bemutatkozas/page.tsx`, `app/hazirend/page.tsx` (`figcaption`).

*Elvetett alternatíva.* `overflow-wrap: break-word` globálisan az elválasztás helyett.
Elvetve: az bárhol elvág egy szót, ami magyarul olvashatatlan eredményt ad; az `auto` a
szótár szerinti helyeken tör.

*Ellenőrzés.* 320 px-en egyetlen szó sem csordul túl a tárolójából, és minden
szövegtartó elemen érvényes a `hyphens: auto`.

*Állapot.* ~ részben.

*Forrás.* [19]; `app/globals.css:95-101`, `app/layout.tsx`.

---

### L — Layout, rács, vertikális ritmus, reszponzivitás

**L1. Az egy rácsban álló kártyák hosszkülönbségét a komponens viseli, nem a rács.**

*Elv.* Ahol azonos szerepű elemek kerülnek egy rácsba, ott a komponensnek kell
kezelnie, hogy a tartalom hossza nagyságrendekkel szórhat: alsó igazítás, clamp +
kibontás, vagy egyoszlopos elrendezés — de nem az, hogy a rács úgy tesz, mintha
egyenlők lennének.

*Miért.* A `content/pages/house-rules.ts` 14 szabálya 46 és 905 karakter között szór
(20×), a `first-massage.ts` hét tanácsa 47 és 284 karakter között (6×), és ez utóbbi
`sm:grid-cols-2` rácsban áll — tehát egy háromsoros és egy tízsoros kártya kerül egymás
mellé. A hét árkártyából háromnak nincs `note` mezője, egynek kétsoros. A repóban
mindkét megoldásminta megvan már, csak nem mindenhol: a `PriceCard` alsó igazítással
egy vonalba hozza az összegeket, a `ReviewCard` nyolcsoros clampet és mért „Tovább"
gombot használ. Ugyanez hiányzik a házirend- és tipplistáról.

*Hogyan látszik itt.* `components/prices/PriceCard.tsx:26` (`mt-auto`);
`components/home/ReviewCard.tsx` (`CLAMP_LINES = 8`, `useLayoutEffect` mérés);
`app/hazirend/page.tsx` (`<ol className="mt-10 space-y-4">`);
`app/arak/elso-masszazs/page.tsx` (`<ol className="mt-10 grid gap-4 sm:grid-cols-2">`).

*Elvetett alternatíva.* Fix magasságú kártyák egységes vágással. Elvetve: a
házirendnél a levágott szöveg gyakorlatilag releváns információt tüntetne el (a 08-as
lemondási szabály a leghosszabb és a legfontosabb), a véleményeknél pedig a
`ReviewCard` kommentje dokumentálja, miért nem működik a karakterszám-alapú becslés.

*Ellenőrzés.* 320 px-en egyik lista sem hoz létre olyan párt, ahol a két elem magassága
háromszorosan tér el, és egyik kártyából sem tűnik el szöveg kibontási lehetőség nélkül.

*Állapot.* ~ részben.

*Forrás.* `content/pages/house-rules.ts`, `components/prices/PriceCard.tsx`.

---

**L2. Az `overflow-x: hidden` nem megoldás, hanem a hiba elrejtése.**

*Elv.* A `body { overflow-x: hidden }` backstop marad, de nem számít megoldásnak:
minden vízszintes túlcsordulás a kilógó elemnél javítandó, és a minőségi kapunak a
backstop mellett is látnia kell a problémát.

*Miért.* A `verify.mts` első ellenőrzése `document.documentElement.scrollWidth >
window.innerWidth + 1` — pontosan azt a jelet nézi, amit a `body`-n lévő
`overflow-x: hidden` elnyel. A gyanús elemek listája pedig csak akkor íródik ki, ha ez
a check már elbukott. Következmény: egy 320 px-en kilógó elem csendben levágódik, és a
script zöldet jelez. A `MobileNav` fejlécében szereplő komment bizonyítja, hogy ez
valós hibaosztály — a drawer `translate-x-full` parkolása minden oldalon, minden
szélességen túlcsordulást okozott, amíg viewport-méretű vágókeretbe nem került. A 320
px-es alsó határ nem szélső eset: az egyben a WCAG 1.4.10 Reflow referenciahelyzete is,
egy 1280 px-es ablak 400%-os nagyítása [6].

*Hogyan látszik itt.* `app/globals.css:70-77`; `scripts/verify.mts` (az első
`problems.push` ág); `components/layout/MobileNav.tsx:104-112`.

*Elvetett alternatíva.* Az `overflow-x: hidden` eltávolítása, hogy a kapu működjön.
Elvetve: a backstop valódi védelmet ad egy olyan hibaosztály ellen, ami mobilon azonnal
használhatatlanná tesz egy lapot; a megoldás a kapu élesítése, nem a védelem
leszerelése.

*Ellenőrzés.* A túlcsordulás-ellenőrzés akkor is jelez, ha a `body`-n rajta van a
`hidden` — önálló hibafeltételként, elemenkénti `getBoundingClientRect()` vizsgálatból.

*Állapot.* ✗ hiányzik.

*Forrás.* [6]; `app/globals.css:70-77`, `scripts/verify.mts`.

---

### F — Fotográfia és képi világ

**F1. A háttérfotó textúra: 7–12%-os opacitáson nem hordozhat információt.**

*Elv.* A `Section background` és a `PageHeader background` képei dekoratívak:
`alt=""`, `aria-hidden`, és tartalmilag felcserélhetők. Egyetlen olyan információ sem
kerülhet háttérképbe, amit a látogatónak látnia kell.

*Miért.* A `Section` 7%-on, a `PageHeader` 12%-on rajzolja őket, fölöttük
`from-surface via-transparent to-surface` gradienssel — ezen a szinten a kép színfolt,
nem kép. A `Section.tsx` kommentje pontosan ezt a szándékot rögzíti: az eredeti oldal
95%-os fehér panelt tett a fotók fölé, ami kimosta őket; itt a fotó eleve alacsony
opacitáson van, hogy textúraként működjön. Az elv másik iránya, hogy ezért fel is
cserélhetők: a `/hazirend/` ma a `bg-prices-alt`, a `/kapcsolat/` a
`service-aromatherapy` képet használja — ez nem hiba, mert egyik sem közöl semmit.

*Hogyan látszik itt.* `components/ui/Section.tsx:44-58`; `components/ui/PageHeader.tsx`;
`scripts/assets.ts` (`decorative: true` → AVIF q32 / WebP q55).

*Elvetett alternatíva.* Erősebb (25-30%) háttérfotó a hangulatért. Elvetve: ezen a
szinten a fotó már versenyez a szöveggel, és a `--color-muted` kontrasztja fotóra
rajzolva nem garantálható — a WCAG 1.4.3 a tényleges háttérrel szemben mér [3].

*Ellenőrzés.* Minden háttérként használt `<Picture>` `alt=""`, a szülője `aria-hidden`,
és a szekció szövege háttérkép nélkül is teljes.

*Állapot.* ✓ teljesül.

*Forrás.* [3]; `components/ui/Section.tsx`, `components/ui/PageHeader.tsx`.

---

**F2. A masszőr arca, neve és végzettsége egy egységként jelenik meg.**

*Elv.* Ahol a tulajdonos portréja vagy neve címként szerepel, ott közvetlenül mellette
ott a szakmai címe is — a látható szövegben, nem csak az `alt` attribútumban és a
bemutatkozó bekezdés belsejében.

*Miért.* Kutatás szerint a felhasználók figyelmet fordítanak a valódi, a témához tartozó
emberekről készült fotókra, a generikus stock-modelleket viszont figyelmen kívül hagyják
[14]; a hitelesség faktorai közé tartozik a szakértelem gyorsan felfogható bizonyítéka
[12]. A repó félig már jól csinálja: az `about-portrait` alt-ja `"Dévényi Krisztina,
okleveles gyógymasszőr, a Libra Masszázs Szalon alapítója"`, és a fotók a fájlnevek
alapján saját felvételek, nem stock — ami a szegmensben megkülönböztető, mert a
stock-wellness (gyertya, kőrakás, orchidea) a domináns klisé. A látható `<h2>` viszont
csak a nevet írja; a végzettség a 153 szavas `intro` bekezdés belsejében van. Vagyis a
képernyőolvasót használó látogató paradox módon jobb helyzetben van, mint a látó.

*Hogyan látszik itt.* `app/bemutatkozas/page.tsx` (`<h2>{about.name}</h2>` + az `alt`);
`content/site.ts` `ownerTitle`; `lib/jsonld.ts:57-61` (`founder.jobTitle`);
`app/arak/elso-masszazs/page.tsx` (`about-detail`).

*Elvetett alternatíva.* Külön „képesítések" doboz felsorolással. Elvetve: az
`about.intro` már részletesen elmondja a szakmai utat (Nemzetközi Masszázs Akadémia,
svéd, gyógy, nyirok, köpöly, kinesio-tape, triggerpont, talpreflexológia), egy
párhuzamos kiemelt lista ezt duplikálná — a hiányzó lépés a végzettség rögzítése a
névnél, nem egy új blokk.

*Ellenőrzés.* Nincs a site-on olyan ember-fotó, amelyik nem a szalonban készült, és
ahol a tulajdonos neve címként áll, ott olvasható a szakmai címe is.

*Állapot.* ~ részben.

*Forrás.* [12], [14]; `app/bemutatkozas/page.tsx`, `content/site.ts`.

---

### C — Komponens-nyelv

**C1. Hover-emelés csak azon van, ami tényleg kattintható.**

*Elv.* A `hover:-translate-y-1` + `shadow-lift` páros kattinthatóságot ígér. Csak olyan
elemen szerepelhet, ami `<a>`, `<button>`, vagy egészében egy linkre visz.

*Miért.* A `ServiceCard` és a `PriceCard` `<article>` elem — nincs bennük link, nem
vezetnek sehova —, mégis megemelkednek, árnyékot váltanak, és a `ServiceCard` képe
`group-hover:scale-105`-tel be is nagyít. Egérrel érkező látogatónál ez konkrét hiba:
rákattint, nem történik semmi. Érintőképernyőn a hover-állapot ragadós marad az első
koppintás után, tehát még zavaróbb.

*Hogyan látszik itt.* `components/home/ServiceCard.tsx:20`;
`components/prices/PriceCard.tsx:15`.

*Elvetett alternatíva.* A kártyák linkké alakítása. Elvetve az árkártyáknál: nincs cél,
ahova vezethetnének, és az URL-készlet nem bővíthető. A szolgáltatáskártyáknál elvi
lehetőség volna, de a főoldali négy kártya és az árlista hét tétele nem feleltethető meg
egymásnak, tehát a link félrevezetne.

*Ellenőrzés.* Minden `hover:-translate-y-*` osztályú elem `<a>` vagy `<button>`, vagy
tartalmaz teljes felületű linket.

*Állapot.* ✗ hiányzik.

*Forrás.* `components/home/ServiceCard.tsx`, `components/prices/PriceCard.tsx`.

---

**C2. Az ár soha nem jelenik meg magyarázat nélkül, és a hierarchiáját a méret adja.**

*Elv.* Minden ársor mellett ott az időtartam és az, hogy mi van benne. Az összeget a
`--text-price` méret emeli ki, nem szín — az ár `--color-ink`, a magyarázat
`--color-muted`, arany nem szerepel benne.

*Miért.* 13.000–18.000 Ft egy kezelésért olyan összeg, amit a látogató mérlegel; a
kontextus („90 perc, szóbeli állapotfelméréssel egybekötött diagnosztikai masszázs") a
döntés alapja, nélküle az összeg csak akadály. Az adatszerkezet ezt már támogatja: a
`PriceItem` `duration`, `title`, `note` és `price` mezőkből áll. A szín kizárása azért
fontos, mert az arany szövegváltozat ma nem éri el a kontrasztküszöböt (K1), tehát az
árat nem szabad tőle függővé tenni.

*Hogyan látszik itt.* `components/prices/PriceCard.tsx` (eyebrow = időtartam, `h3` =
név, `note` = magyarázat, `--text-price` = összeg); `content/prices.ts`.

*Elvetett alternatíva.* „Ártól" jellegű összefoglaló a főoldalon, horgonyzási céllal.
Elvetve: a szalon egy masszőrrel dolgozik és tele van, tehát nem árversenyben áll — a
részletes, kontextusos ár többet használ a bizalomnak. A megnézett magyar szalonoldalak
többsége egyáltalán nem közöl árat [20]; a teljes árlista itt tudatos megkülönböztetés,
nem hiányosság.

*Ellenőrzés.* Nincs a site-on olyan Ft-összeg, ami mellett ne állna időtartam és
leírás; egyetlen ár sem `text-gold` vagy `text-gold-ink`.

*Állapot.* ✓ teljesül — a főoldalon nincs ár, és a terv nem is javasolja.

*Forrás.* [20]; `content/prices.ts`, `components/prices/PriceCard.tsx`.

---

**C3. A vélemény-blokk az aggregált értékelést és a külső forrás linkjét is mutatja.**

*Elv.* A véleményszekcióban látható az átlag és a darabszám (5,0 / 7 értékelés), és egy
link a Google-profilra, ahol ez ellenőrizhető. Nem csak idézetek állnak ott.

*Miért.* Két ok fut össze. Egy: a bizalom egyik faktora a webes ökoszisztémához való
kapcsolódás — a látogatók jobban hisznek a külső oldalon ellenőrizhető véleménynek,
mint annak, amit a cég a saját oldalán idéz [12]. Kettő: a `businessJsonLd()` ma
`aggregateRating` + `review[]` mezőket ad ki egy `MassageTherapy` (azaz
`LocalBusiness`) entitáson, amiről a Google policy kimondja, hogy „ineligible for star
review feature", ha az entitás maga kontrollálja a róla szóló véleményeket [16]. A
csillagos rich result tehát nem fog megjelenni a találati listában — amiből az
következik, hogy azt az információt magán az oldalon kell megmutatni. A
`content/reviews.ts` `reviewStats` már számolja (`{count: 7, average: 5}`), csak nem
jelenik meg sehol; a `reviewsNote` szövegesen közli az eredetet, de a
`site.social.googleMaps` link nem áll mellette. A megnézett magyar referenciák közül
kettő kiírja az aggregált Google-értékelést [20].

*Hogyan látszik itt.* `content/reviews.ts` (`reviewStats`, `reviewsNote`, `Review`
típus `source` és opcionális `publishedAt` mezővel — utóbbi egyetlen véleményen sincs
kitöltve, tehát dátum ma nem jeleníthető meg); `components/home/ReviewsCarousel.tsx`;
`lib/jsonld.ts:63-82`.

*Elvetett alternatíva.* Beágyazott Google-review widget. Elvetve: futásidejű, harmadik
féltől jövő script, ami ütközik a statikus exporttal, a nulla új függőséggel és a
`MapEmbed` bevált „kattintásra tölt" mintájával.

*Ellenőrzés.* A vélemények szekcióban látható az átlag, a darabszám és egy külső link;
a `StarRating` nem az egyetlen hordozója az értékelésnek.

*Állapot.* ✗ hiányzik.

*Forrás.* [12], [16], [20]; `content/reviews.ts`, `lib/jsonld.ts`.

---

**C4. A közleménysáv tájékoztat: nem sürget és nem takar.**

*Elv.* A kapacitás-közlemény sáv marad a tartalom fölött, elutasítható, mobilon két
sorra vágott, és teljes szövege mindig benne van a DOM-ban. Modallá, overlay-jé vagy
sticky elemmé nem alakul, és nem használ hibaszemantikát vagy szűkösségi keretet. Az
oldalon sehol nincs visszaszámláló, „utolsó szabad időpont" jellegű elem vagy felugró
ajánlat.

*Miért.* Az örökölt WordPress-oldalon ez teljes képernyős modal volt, amit el kellett
tüntetni, mielőtt bármit el lehetett olvasni. A Google ezt mobilon intrusive
interstitialként kezeli, és a page experience jelzések része, hogy a tartalom azonnal
hozzáférhető legyen [17]. Ugyanakkor a tartalma valóban foglalás-releváns (3-4 hét
várakozás, ajándékutalványokra is), tehát nem elhagyható. A hangnem is döntés: a
`content/notice.ts` szövege tájékoztató és bocsánatkérő („Köszönöm szíves
megértését!") — egy scarcity-keret vagy riasztó színezés ezzel szemben áll, és a szalon
helyzetében nincs is rá szükség: nem lead-mennyiségre van szükség, hanem felkészült
érdeklődőre.

*Hogyan látszik itt.* `components/layout/NoticeBar.tsx` (`<aside>` a `Header` felett,
`useSyncExternalStore` a `localStorage`-ra, `line-clamp-2 sm:line-clamp-none`,
`notice.version` az újramegjelenítéshez, arany-halvány háttér `text-sm`-mel);
`content/notice.ts`.

*Elvetett alternatíva.* Sticky pozíció vagy figyelmeztető színezés a jobb
észrevehetőségért. Elvetve: a sticky `Header` alatt egy második ragadó sáv 320 px-en a
viewport jelentős részét elvinné és a WCAG 2.4.11 kockázatát növelné [5]; a riasztó
színezés pedig pont az ellenkezőjét kelti annak a nyugalomnak, amit a szolgáltatás ígér.

*Ellenőrzés.* A sáv a normál dokumentumfolyamban van, elutasítható, teljes szövege
elutasítás előtt is szerepel a HTML-ben; nincs a site-on időfüggő, csökkenő vagy villogó
elem.

*Állapot.* ✓ teljesül.

*Forrás.* [5], [17]; `components/layout/NoticeBar.tsx`, `content/notice.ts`.

---

**C5. A lábléc a NAP-blokk kanonikus helye, és tartalmazza a nyitvatartást is.**

*Elv.* Egy helyen, minden oldalon, azonos formátumban áll a név, a cím, a telefon, az
e-mail és a nyitvatartás. Ez a blokk az igazságforrás; ha valahol máshol is megjelenik
egy adat, onnan származik.

*Miért.* A `Footer` ma e-mailt, telefont és címet visz — nyitvatartást nem. A
`site.openingHours` (mind a hét nap, 9–17) kizárólag a JSON-LD-be jut el. Egy oldalon,
ahol az egyetlen konverziós út a telefonhívás, a látogató nem tudja eldönteni, mikor
van értelme tárcsázni; NN/g az „hours of operation"-t kifejezetten a kötelező
kapcsolati adatok közé sorolja [13]. A megnézett magyar szalonoldalak közül három napi
bontásban kiírja [20]. Járulékos előny, hogy a mindennap azonos 9–17 egyetlen sorban
közölhető, tehát nem is kerül helybe.

*Hogyan látszik itt.* `components/layout/Footer.tsx` (`Elérhetőségek` oszlop);
`content/site.ts:36-48` (`openingHours` — angol napnevekkel, schema.org alakban, tehát
magyar megjelenítéshez fordítás kell); `lib/jsonld.ts:49-56`.

*Elvetett alternatíva.* A nyitvatartás csak a `/kapcsolat/` oldalra. Elvetve: a
telefonálási szándék bármelyik oldalon megszülethet — leggyakrabban az `/arak/`-on —, és
a lábléc az egyetlen komponens, ami mindenütt ott van.

*Ellenőrzés.* A láblécben látható a nyitvatartás, és a megjelenített érték megegyezik a
`site.openingHours` és a JSON-LD tartalmával.

*Állapot.* ✗ hiányzik.

*Forrás.* [13], [20]; `components/layout/Footer.tsx`, `content/site.ts`.

---

### M — Mozgás és mikrointerakció

**M1. A belépő animáció legfeljebb 400 ms, a stagger összesen legfeljebb 200 ms.**

*Elv.* Egyetlen belépő animáció sem tart tovább 400 ms-nál, és egy csoporton belül az
utolsó elem sem indulhat 200 ms-nál később.

*Miért.* NN/g mérése szerint az 500 ms fölötti scroll-fade-et a felhasználók lassúnak
érzékelik; az ajánlott sáv 100–400 ms [11]. A repó `[data-reveal]` transitionje 700 ms,
és `transition-delay: calc(var(--reveal-index, 0) * 80ms)` késleltetéssel indul. Az
`/arak/` oldal háromoszlopos rácsában az `index % 3` miatt a harmadik kártya 160 ms-ot
vár, majd 700 ms alatt jön fel — 860 ms azután, hogy a látogató odagörgetett. A
`MobileNav` menüpontjai ennél is rosszabbak: `120 + index * 40 ms` késleltetés 400 ms-os
átmenettel, tehát az ötödik menüpont ~720 ms-mal a koppintás után áll össze.

*Hogyan látszik itt.* `app/globals.css:155-164`; `components/ui/Reveal.tsx`
(`--reveal-index`); `components/layout/MobileNav.tsx:144-149`;
`components/home/Hero.tsx` (`line-rise 0.9s`, `hero-image 1.1s`).

*Elvetett alternatíva.* A jelenlegi 700 ms megtartása, mert lágyabb. Elvetve: a
lágyságot az `--ease-out-expo` görbe adja, nem az időtartam; ugyanaz a görbe 350 ms-on
ugyanolyan lágy, csak nem várat.

*Ellenőrzés.* Nincs a kódban 400 ms-nál hosszabb `transition-duration` vagy
`animation-duration` belépő animáción, és nincs 200 ms-nál nagyobb halmozott
`transition-delay`.

*Állapot.* ✗ hiányzik.

*Forrás.* [11]; `app/globals.css`, `components/ui/Reveal.tsx`.

---

**M2. A fő szövegtörzs nem animál.**

*Elv.* A scroll-reveal másodlagos, kísérő elemeken használható: kép, kártya,
elválasztó, ornamens. A folyó szöveg, a listaelemek és a címsorok azonnal láthatók.

*Miért.* A kutatás explicit: a scroll-triggered animációt másodlagos, kísérő tartalomra
kell használni, nem a fő szövegre, és feladatorientált látogatóknál (egészségügyi,
pénzügyi kontextus) a késleltetés kifejezetten frusztrál [10]. A kiegészítő ajánlás
mobilon a teljes mellőzés [11]. A Libra egészségügyi jellegű szolgáltatás, ahol a
látogató a fájdalmához keres választ — ez pontosan a feladatorientált eset. Ma viszont
a `/hazirend/` mind a 14 szabálya, a `/arak/elso-masszazs/` mind a 7 tanácsa, mind a 7
árkártya és gyakorlatilag minden bekezdés `[data-reveal]` alatt, `opacity: 0`-ról indul.

*Hogyan látszik itt.* `app/hazirend/page.tsx` (`Reveal as="li"` 14×, index-alapú
stagger nélkül); `app/arak/elso-masszazs/page.tsx` (`Reveal as="li"` 7×, plusz a
szövegblokkok); `app/arak/page.tsx` (mind a 7 `PriceCard`); `app/bemutatkozas/page.tsx`.

*Elvetett alternatíva.* A reveal teljes eltávolítása a site-ról. Elvetve: a mozgás a
karakter része, és a képeken, kártyákon egyszeri, rövid megjelenésként jól működik — a
probléma nem a technika, hanem a hatóköre.

*Ellenőrzés.* Nincs `[data-reveal]` attribútum `<p>`, `<li>`, `<h2>`, `<h3>` vagy
`<ol>` elemen, ami a lap fő szövegét viszi.

*Állapot.* ✗ hiányzik.

*Forrás.* [10], [11]; `app/hazirend/page.tsx`, `app/arak/**`.

---

**M3. Minden animált elem helyes végállapotból indul — JavaScript nélkül és mozgás
nélkül is.**

*Elv.* CSS nem rejthet el tartalmat úgy, hogy a megjelenítéséhez futó JS kell, és a
`prefers-reduced-motion` kapcsoló nem csak az időtartamot nullázza, hanem az animáció
végállapotát is beállítja. Minden tartalom látható, minden állapot felismerhető, minden
görgetés működik mindkét esetben.

*Miért.* Két kockázat ugyanarról a tőről. Egy: a `[data-reveal] { opacity: 0 }` szabály
a stíluslapból azonnal érvényes, de a feloldó `[data-revealed]` attribútumot a
`Reveal.tsx` `IntersectionObserver`-e teszi rá, hidratálás után — ha a JS nem fut le, a
lap tartalmának túlnyomó része véglegesen láthatatlan marad. Statikus exportnál, ahol a
HTML amúgy is teljes, ez különösen olcsón orvosolható. Kettő: a mozgás vesztibuláris
zavarnál, migrénnél és epilepsziánál valós tünetet válthat ki, és az elvárás a
nem-esszenciális mozgás teljes megszüntetése [8][9] — a site-on viszont több animáció
*állapotot* is közöl (a `BackToTop` opacitással, a `MobileNav` menüpontjai
`translate-x` + `opacity` párossal, a `NoticeBar` `slide-down`-nal), tehát ha a kapcsoló
csak a duration-t nullázza, az elem láthatatlan maradhat. A repó tudja, hogy ez valós
hibaosztály: a `Reveal.tsx` kommentje leírja, hogy egy korábbi `rootMargin: -10%` +
`threshold: 0.15` beállítás mellett az oldal alján lévő elemek sosem jelentek meg.

*Hogyan látszik itt.* `app/globals.css:155-160` és `:238-262` (a globális
reduced-motion blokk a `[data-reveal] { opacity: 1 !important }` felülbírálással —
ez az ág megoldott); `components/ui/Reveal.tsx`, `components/ui/BackToTop.tsx`,
`components/home/ReviewsCarousel.tsx` (mindhárom `matchMedia`-t olvas);
`scripts/verify.mts` (a reveal-ellenőrzés — futó JS mellett mér, tehát pont a
kockázatos esetet nem tudja tesztelni).

*Elvetett alternatíva.* Csökkentett, de nem nulla mozgás a reduced-motion ágon.
Elvetve: a `globals.css` fejléc-kommentje egyetlen kapcsolót ígér, és egy ember által
karbantartott oldalon a bináris szabályt lehet betartani, a fokozatosat nem.

*Ellenőrzés.* Kikapcsolt JavaScript mellett mind a hat oldal teljes tartalma látható;
bekapcsolt mozgáscsökkentés mellett ugyanez, és a `BackToTop`, a mobil menü és a
karusszel is használható.

*Állapot.* ✗ hiányzik — a reduced-motion ág megvan, a no-JS ág nincs.

*Forrás.* [8], [9]; `app/globals.css`, `components/ui/Reveal.tsx`.

---

### N — Navigáció és információs architektúra

**N1. Egyetlen oldal sem zsákutca.**

*Elv.* Minden oldal alján van legalább egy továbbvezető lépés: link a következő logikus
oldalra, vagy telefonos CTA.

*Miért.* Ma a `/bemutatkozas/` két köpöly-fotóval, a `/hazirend/` két bérlet-fotóval ér
véget — se link, se CTA, se telefonszám. A látogató, aki épp elolvasta, kihez menne és
milyen szabályok szerint, itt kerülne a legközelebb a hívás gondolatához. Az `/arak/` és
az `/arak/elso-masszazs/` már jól csinálja: mindkettőnek van záró linkje (az első
alkalomra, illetve a házirendre). Ez összeér az információs architektúrával is: a
főmenü lapos marad — az `/arak/elso-masszazs/` az URL-ben az `/arak/` gyereke, a menüben
testvére —, mert az URL-készlet zárt és egy almenü 1024 px alatt a hamburgeren belül
másodszintű nyitást hozna. A hierarchiát így a breadcrumb JSON-LD és a lapon belüli,
látható kereszthivatkozások viszik.

*Hogyan látszik itt.* `app/bemutatkozas/page.tsx` és `app/hazirend/page.tsx` (utolsó
szekció: képpár); ellenpélda: `app/arak/page.tsx` és `app/arak/elso-masszazs/page.tsx`
záró linkjei; `content/nav.ts` (öt egyszintű elem); `lib/jsonld.ts` `breadcrumbJsonLd`.

*Elvetett alternatíva.* Egységes „kapcsolat" sáv minden oldal aljára, illetve almenü az
„Árak" alatt. Elvetve: a lábléc már betölti az elsőt, és egy fölé tett második, azonos
tartalmú sáv duplikáció; az almenü pedig URL-t nem mozgat ugyan, de mobilon aránytalan
interakciós költséget hoz be öt menüponthoz képest.

*Ellenőrzés.* Mind a hat oldalon a lábléc előtti utolsó tartalmi elem link vagy CTA.

*Állapot.* ✗ hiányzik — hat oldalból kettőn.

*Forrás.* `app/bemutatkozas/page.tsx`, `app/hazirend/page.tsx`, `content/nav.ts`.

---

**N2. A telefonszám a fejlécben is jelen van, nem csak a drawerben.**

*Elv.* A sticky fejlécben a logó és a navigáció mellett ott a telefonos elérés is —
1024 px felett látható elemként, alatta a hamburger mellett önálló, koppintható
ikonként, nem a menün belül.

*Miért.* NN/g irányelve szerint a telefonszámot soha nem szabad elrejteni, és a
fejlécben is jól láthatónak kell lennie [13]. Ma a `MobileNav` a telefonszámot a drawer
aljára teszi: két interakció (menü megnyitása, majd görgetés a lista alá) kell hozzá. A
desktop headerben egyáltalán nincs. A `Header` sticky és `backdrop-blur`-os, tehát végig
jelen van — ez a legolcsóbb hely a telefonnak.

*Hogyan látszik itt.* `components/layout/Header.tsx` (logó + `navItems` + `MobileNav`);
`components/layout/MobileNav.tsx:159-166` (a `tel:` link a `mt-auto` blokkban).

*Elvetett alternatíva.* Fix, alul lebegő hívás-sáv mobilon. Elvetve: takarja a
tartalmat, versenyez a `BackToTop` gombbal ugyanabban a sarokban, és a WCAG 2.4.11
(Focus Not Obscured) kockázatát is növeli [5] — a sticky fejléc ugyanazt a folyamatos
jelenlétet adja új takaró réteg nélkül.

*Ellenőrzés.* Mind a hat oldalon, mind a hat töréspontnál a fejlécben van `tel:` link,
görgetés és menünyitás nélkül elérhetően.

*Állapot.* ✗ hiányzik.

*Forrás.* [5], [13]; `components/layout/Header.tsx`, `components/layout/MobileNav.tsx`.

---

### B — Bizalom és konverzió

**B1. A telefonszám minden oldalon egy koppintással elérhető.**

*Elv.* Mind a hat oldalon van legalább egy `tel:` link a tartalomban vagy a fejlécben,
nem csak a láblécben. A szám mindig E.164 formátumú `href`-fel (`+36308532729`) és
`dir="ltr"` megjelenítéssel áll.

*Miért.* Nincs online foglalás; a telefon az egyetlen konverziós út. Ma négy helyen
létezik `tel:` link (lábléc, mobil drawer, `/kapcsolat/` lista, főoldali záró CTA), és
négy oldal tartalmában egy sincs — köztük az `/arak/`-on, ami a leginkább döntés-közeli
lap. A `+` jellel kezdődő nemzetközi formátum az ajánlott alak, mert így minden eszközön
helyesen tárcsázódik és desktopon is átadható a telefonálásra képes alkalmazásnak [21];
a `dir="ltr"` azért kell, hogy a szóközzel tagolt megjelenítés ne törjön el.

*Hogyan látszik itt.* `content/site.ts` (`phone` megjelenítéshez, `phoneHref`
E.164-ben — a szétválasztás már megvan); `components/layout/Footer.tsx:56`;
`components/contact/ContactDetails.tsx:25`; `app/page.tsx:52`;
`components/layout/MobileNav.tsx:161`. A `/kapcsolat/` oldal szövegében az
„Időpontfoglaláshoz telefonszámomon várom hívásod" mondat `strong`, de nem link.

*Elvetett alternatíva.* Kapcsolatfelvételi űrlap a telefon mellé. Elvetve: statikus
export, nincs szerver, és a `contact.ts` szövege is kifejezetten telefonhoz irányít.

*Ellenőrzés.* Mind a hat oldalon van `tel:` link a láblécen kívül is.

*Állapot.* ✗ hiányzik — hat oldalból kettőn van.

*Forrás.* [13], [21]; `content/site.ts`, `app/**`.

---

**B2. A `tel:` CTA mellett mindig ott a nyitvatartás és a várakozási idő.**

*Elv.* Ahol hívásra hívunk fel, ott közvetlenül mellette áll, mikor lehet hívni (9–17,
minden nap) és mire számítson a hívó (3-4 hét). A telefonos CTA sosem áll csupaszon.

*Miért.* Ez a szalon helyzetének legpontosabb designválasza. A cél nem a maximális
hívásszám, hanem a felkészült hívó: aki tudja, hogy három hetet vár, és mégis tárcsáz,
az a jó vendég. A nyitvatartás megjelenítését a kapcsolati adatok között NN/g explicit
elvárásként kezeli [13]. Ma a nyitvatartás sehol nem látszik (C5), a várólista pedig egy
elutasítható sávban van a lap tetején — vagyis a `tel:` gomb megnyomásának pillanatában
egyik információ sincs a látogató előtt. Ennek külön súlyt ad, hogy a sáv elutasítását a
`localStorage` megjegyzi: egy visszatérő látogató soha többé nem látja. A
`content/notice.ts` szövege már pontosan ezt mondja el; csak nem ott van, ahol hatna.

*Hogyan látszik itt.* `app/page.tsx:44-66` (a záró CTA blokk: mottó + `cta.body` + két
gomb, nyitvatartás és várólista nélkül); `content/notice.ts`; `content/site.ts`
`openingHours`.

*Elvetett alternatíva.* A közleménysáv 43 szavas szövegének szó szerinti ismétlése
minden CTA mellett. Elvetve: a sáv regisztere bocsánatkérő és részletező — CTA mellé
tömör tényközlés kell, nem a teljes közlemény.

*Ellenőrzés.* Minden `tel:` CTA-gomb mellett látható a nyitvatartás és a várakozási
idő, görgetés nélkül.

*Állapot.* ✗ hiányzik.

*Forrás.* [13]; `content/notice.ts`, `content/site.ts`, `app/page.tsx`.

---

### H — Akadálymentesség (WCAG 2.2 AA)

**H1. A sticky fejléc nem takarhatja el a fókuszált elemet.**

*Elv.* Billentyűzettel végigtabolva egyetlen oldalon sem kerülhet a fókuszált elem
teljesen a sticky `Header` vagy a `NoticeBar` alá.

*Miért.* A WCAG 2.2 új, AA szintű 2.4.11 kritériuma pontosan ezt írja elő, és a W3C
külön hibamintaként (F110) nevezi meg a sticky fejlécet, ami eltakarja a fókuszált
elemet [5]. A repó a horgony-ugrásokra már gondolt (`scroll-padding-top:
calc(var(--header-height) + 1rem)`), de a kérdés az, hogy a `--header-height: 4.5rem`
valóban fedi-e a tényleges fejlécmagasságot, amikor a `NoticeBar` is látszik és a logó
`sm:h-14`-en áll. Ezt olvasásból nem tudom eldönteni; billentyűzettel, mind a hat
töréspontnál végig kell menni rajta.

*Hogyan látszik itt.* `app/globals.css:53` (`--header-height: 4.5rem`) és `:60-62`
(`scroll-padding-top`); `components/layout/Header.tsx` (`sticky top-0 z-40`, `py-3`,
logó `h-11` / `sm:h-14`, scrollolva `h-10` / `sm:h-11`); `components/layout/NoticeBar.tsx`.

*Elvetett alternatíva.* A sticky fejléc elhagyása. Elvetve: a fejléc a navigáció és —
N2 szerint — a telefonszám folyamatos jelenlétét adja, ami ezen az oldalon a konverzió
alapja.

*Ellenőrzés.* Tabbal végigmenve mind a hat oldalon, mind a hat szélességnél minden
fókuszált elem legalább részben látható marad.

*Állapot.* ? nem eldönthető olvasásból.

*Forrás.* [1], [5]; `app/globals.css`, `components/layout/Header.tsx`.

---

**H2. A célméret minimuma 44 px, és a minőségi kapu is ezt méri.**

*Elv.* Minden kattintható elem legalább 44×44 CSS pixel, kivéve a folyó szövegbe
ágyazott linkeket és a dokumentált kivételeket. A `verify.mts` küszöbe ugyanez a szám,
nem kevesebb.

*Miért.* A WCAG 2.2 AA minimuma valóban 24×24 [22], de az AAA szintű 2.5.5 44×44-et mond
[23], és a repó a saját komponenseiben már az utóbbit követi: a `Button` `min-h-11`, a
hamburger `size-11`, a karusszel-nyilak `size-11`, a `BackToTop` `size-11`, a mobil
menüpontok `min-h-14`. A `verify.mts` viszont 24-nél húz határt — miközben a fájl saját
fejléc-kommentje 44 px-ről beszél. Így egy 30×30-as gomb átmenne a kapun, pedig sérti a
rendszer saját szabályát. Egy telefonon, sokszor fájdalommal használt oldalon a nagyobb
célterület nem luxus.

*Hogyan látszik itt.* `scripts/verify.mts` (`r.height < 24 || r.width < 24`, és csak
`a[href]` meg `button` elemeket néz); `components/ui/Button.tsx`. Tudatos kivétel: a
karusszel-pöttyök `h-11 w-6` — 24 px a keskeny tengelyen, ami az AA minimumot
teljesíti, és a komment meg is indokolja, hogy hét pötty mellett a nyilak így
maradhatnak 44 px-esek 320 px-en.

*Elvetett alternatíva.* A 24-es küszöb megtartása, mert az a jogszabályi minimum.
Elvetve: a kapu célja nem a minimum igazolása, hanem a rendszer saját szabályának
őrzése — és a rendszer 44-et mond.

*Ellenőrzés.* A `verify.mts` 44 px-nél jelez, és mind a hat oldal átmegy rajta a
dokumentált kivételekkel.

*Állapot.* ~ részben — a komponensek megfelelnek, a kapu nem méri.

*Forrás.* [22], [23]; `scripts/verify.mts`, `components/ui/Button.tsx`.

---

**H3. A 320 px-es viewport-ellenőrzés nem helyettesíti a 400%-os nagyítást.**

*Elv.* A reflow-ellenőrzés két külön dolgot jelent: keskeny viewport és nagyított
szöveg. Mindkettőt le kell futtatni.

*Miért.* A `verify.mts` hat szélességen tölti be az oldalakat, de mindig 100%-os
nagyítással. A WCAG 1.4.10 viszont az 1280 CSS pixeles ablak 400%-os nagyítását írja le
referenciahelyzetként [6], ami nem ugyanaz: nagyításkor a `rem` értékek nőnek, a `vw`
értékek nem, tehát a `clamp()` alapú fluid skála máshogy viselkedik, mint egyszerűen
keskeny ablakban. Ugyanez igaz az 1.4.4 Resize Textre 200%-on [7]. A T2-ben rögzített
2,5×-ös szabály alapján a skála elvileg átmegy, de a tényleges layout (68ch-s mérték,
kétoszlopos rácsok, sticky kép) nagyításban nem lett kipróbálva.

*Hogyan látszik itt.* `scripts/verify.mts` (`WIDTHS`, `page.setViewportSize`, nincs
zoom-beállítás); `app/globals.css` (`--text-*` clamp skála, `prose-measure`).

*Elvetett alternatíva.* Csak a 320 px-es ellenőrzésre hagyatkozni. Elvetve: 320 px-es
viewporton a `--container-pad` 16 px és a fluid méretek a minimumon állnak; 400%-os
nagyításnál ugyanez a szélesség jóval nagyobb tényleges betűmérettel párosul, ami más
töréseket hoz elő.

*Ellenőrzés.* 1280×1024-es ablakban 400%-ra nagyítva mind a hat oldal olvasható
vízszintes görgetés nélkül; 200%-os nagyításnál minden szöveg mérete legalább kétszerese
az alapnak.

*Állapot.* ✗ hiányzik.

*Forrás.* [6], [7], [18]; `scripts/verify.mts`.

---

### P — Teljesítmény mint designkényszer

**P1. A letöltés súlyát a designdöntés szabja meg.**

*Elv.* Oldalanként pontosan egy `<Picture priority>` — az, amelyik a nyitóképernyő
legnagyobb eleme. Minden más kép `lazy`. A dekoratív háttérfotók `sizes` értéke a
látható részletgazdagságukhoz igazodik, nem a megjelenítési méretükhöz.

*Miért.* Az LCP jó küszöbe 2,5 másodperc a betöltések 75. percentilisén [24]. A
prioritás nem mérnöki apróság, hanem designdöntés: azt jelöli ki, mi a lap vizuális
belépőpontja. A `Picture` komponens ezt egy propba köti, ami egyszerre állítja a
`loading="eager"`, `fetchPriority="high"` és `decoding="sync"` értékeket — pontosan az
az együttes, amit a böngésző az LCP-jelölt gyors betöltéséhez vár [25]. Ez ma jól
működik: egyetlen `priority` kép van, a főoldali `hero`; az aloldalak `PageHeader`
háttérképe szándékosan nem kap prioritást, tehát ott az LCP-elem a `<h1>` szöveg. A
másik fele viszont nem: a `Section` háttere `sizes="100vw"`-t kér, tehát 1440 px-es
viewporton a böngésző az 1920 px-es változatot tölti le — a `bg-home` esetében 35 KB
AVIF olyan képért, ami 7%-os opacitáson egy színfolt. A tömörítés már agresszív
(`decorative: true` → AVIF q32), a maradék pazarlás kizárólag a `sizes` deklarációból
jön. És ez tisztán designdöntés következménye: mi mondtuk ki, hogy a háttér textúra
(F1) — ebből következik, hogy nem is kell hozzá teljes felbontás.

*Hogyan látszik itt.* `components/ui/Picture.tsx:40-42`; `components/home/Hero.tsx:43`;
`components/ui/Section.tsx:52` (`sizes="100vw"`); `components/ui/PageHeader.tsx`;
`scripts/assets.ts` (`RESPONSIVE_WIDTHS`, `decorative`).

*Elvetett alternatíva.* A háttérfotók teljes elhagyása, illetve a `PageHeader`
háttérképének priorizálása. Elvetve: a `Section.tsx` kommentje dokumentálja, hogy az
eredeti oldal fotó nélküli szekciói üresnek hatottak; és egy 12%-os opacitású textúra
késői betöltése sem elrendezés-változást, sem információvesztést nem okoz.

*Ellenőrzés.* Oldalanként legfeljebb egy `<Picture priority>`; minden dekoratív
háttérkép `sizes` értéke kisebb, mint `100vw`, és a lap vizuálisan változatlan.

*Állapot.* ~ részben — a prioritás rendben, a `sizes` nem.

*Forrás.* [24], [25]; `components/ui/Picture.tsx`, `components/ui/Section.tsx`.

---

**P2. Minden harmadik féltől jövő beágyazás kattintásra tölt.**

*Elv.* Külső szolgáltatás (térkép, közösségi widget, videó) csak explicit felhasználói
művelet után tölthet be, és a placeholder közli, mi fog történni.

*Miért.* A `MapEmbed` ma pontosan így működik: ikon, „Térkép betöltése" gomb, és egy sor
arról, hogy a betöltéssel a Google szervereivel lép kapcsolatba. A komment szerint az
örökölt oldal ~300 KB-ot és Google-sütiket húzott be minden látogatásnál — olyan
költséggel, amiből a látogatók többsége nem profitált. A minta egyszerre szolgálja a
Core Web Vitals küszöböket [24] és az adatvédelmi átláthatóságot, ami maga is bizalmi
tényező [12]. Ez az elv az, ami a C3-ban elvetett review-widgetet is kizárja.

*Hogyan látszik itt.* `components/contact/MapEmbed.tsx`; `content/pages/contact.ts`
(`map.loadLabel`, `map.consentNote`, `map.frameTitle`).

*Elvetett alternatíva.* Statikus térképkép interaktív beágyazás helyett. Elvetve: a
látogatónak útvonaltervezésre van szüksége, amit képpel nem lehet kiváltani — NN/g
helyszínkeresési kutatása szerint az áttekintő és a részletes térkép, plusz az
útbaigazítás együtt kell [12].

*Ellenőrzés.* Nincs olyan `<iframe>` vagy külső `<script>`, ami felhasználói interakció
nélkül töltődik be.

*Állapot.* ✓ teljesül.

*Forrás.* [12], [24]; `components/contact/MapEmbed.tsx`.

---

## 4. Hézag-áttekintés

| Elv | Cím | Állapot | Mi hiányzik |
|---|---|---|---|
| A1 | Zárt vizuális eszközkészlet | ✓ | — |
| A2 | A dísz nem hordoz információt | ~ | A csillagsor és a karusszel-pötty ma a szín egyedüli információhordozó szerepében van. |
| K1 | `--color-gold-ink` normál szövegen | ✗ | A token 4,18:1 fehéren, nem 4,5:1; minden eyebrow, aktív navlink és szöveges gomb ezen fut. |
| K2 | Szekcióhatár ritmusból | ~ | Az 1,04:1-es tónuskülönbség strukturális jelzésként működik; a `loose` spacing sehol nincs használva. |
| T1 | Caveat: egy mondat, sosem `<h1>` | ✗ | A főoldal `<h1>`-e script betűs mottó, ami nem nevezi meg az oldal tárgyát. |
| T2 | Fluid skála max ≤ 2,5× min | ✓ | — |
| T3 | Hosszú bekezdés tipográfiai kompenzációja | ~ | A 237 szavas blokk szűk oszlopban, sticky kép mellett áll. |
| T4 | Eyebrow = rövid címke, nem mondat, nem címsor | ✗ | Két helyen mondat áll verzálban 13px-en; négy `<h2>` renderelődik eyebrow-ként. |
| T5 | Magyar elválasztás mindenütt | ~ | Csak `p, li, blockquote`; `figcaption` és a headingek kimaradnak. |
| L1 | A kártya viseli a hosszkülönbséget | ~ | A házirend- és tipplistán nincs sem clamp, sem alsó igazítás. |
| L2 | `overflow-x: hidden` nem megoldás | ✗ | A backstop elnyeli a jelet, amit a `verify.mts` mér; a check nem tud tüzelni. |
| F1 | Háttérfotó = textúra | ✓ | — |
| F2 | Arc + név + végzettség egy egységben | ~ | A `<h2>` csak a nevet viszi; a szakmai cím a bekezdés belsejében és az `alt`-ban van. |
| C1 | Hover-emelés csak kattinthatón | ✗ | `ServiceCard` és `PriceCard` `<article>`, mégis emelkedik és nagyít. |
| C2 | Ár magyarázattal, méret-hierarchiával | ✓ | — |
| C3 | Aggregált értékelés és külső forráslink | ✗ | A `reviewStats` (5,0 / 7) sehol nem jelenik meg; nincs link a Google-profilra. |
| C4 | Közleménysáv tájékoztat, nem sürget, nem takar | ✓ | — |
| C5 | Lábléc = NAP + nyitvatartás | ✗ | A nyitvatartás csak a JSON-LD-ben van, a látható oldalon sehol. |
| M1 | Belépő animáció ≤ 400 ms | ✗ | 700 ms + 80 ms/elem stagger; a mobil menü utolsó pontja ~720 ms. |
| M2 | A fő szövegtörzs nem animál | ✗ | 14 házirend-szabály, 7 tanács, 7 árkártya és minden bekezdés `opacity: 0`-ról indul. |
| M3 | Helyes végállapot JS és mozgás nélkül is | ✗ | A reduced-motion ág megvan; a no-JS ág nincs — a tartalom nagy része láthatatlan maradna. |
| N1 | Nincs zsákutca oldal | ✗ | `/bemutatkozas/` és `/hazirend/` link és CTA nélkül ér véget. |
| N2 | Telefon a fejlécben | ✗ | Desktopon nincs; mobilon két interakció mögött. |
| B1 | `tel:` minden oldalon | ✗ | Négy oldal tartalmában nincs, a láblécen kívül. |
| B2 | CTA mellett nyitvatartás és várólista | ✗ | A főoldali CTA-nál egyik sem szerepel. |
| H1 | Sticky fejléc nem takarja a fókuszt | ? | Billentyűzetes végigjárás hiányzik; a `--header-height` valós fedése nem igazolt. |
| H2 | 44 px célméret, és a kapu is ezt méri | ~ | A komponensek megfelelnek, a `verify.mts` 24-nél húz határt. |
| H3 | 400%-os nagyítás ellenőrzése | ✗ | Csak keskeny viewporton tesztelünk, nagyításon nem. |
| P1 | A letöltés súlya designdöntés | ~ | A `priority` rendben; a dekoratív háttér `sizes="100vw"`-t kér. |
| P2 | Külső beágyazás kattintásra tölt | ✓ | — |

---

## 5. Feszültségek és kompromisszumok

**A scroll-reveal karaktere vs. „a tartalom sosem maradhat láthatatlan."** A reveal
valódi hangulati értéket ad, és a `verify.mts` külön ellenőrzést szentel neki. De az
alapmechanizmus — CSS rejt el, JS old fel — olyan kockázatot vállal, amit statikus
exportnál nem kellene. **A láthatóság nyer** (M3): a mozgás csak azon az elemen
maradhat, aminek a nem-animált állapota is látható. Ez összeér M2-vel: ha a fő
szövegtörzs eleve nem animál, a kockázat automatikusan a kísérő elemekre szűkül.

**A `--color-gold-ink` mint márkaszín vs. a 4,5:1.** A K1 nem rebrand-javaslat. Az
örökölt paletta három színe (`--color-ink`, `--color-gold`, `--color-muted`) egy az
egyben az Elementor kitből jön; a `--color-gold-ink` viszont ebben az újraépítésben
született, kizárólag azért, hogy elérjen egy kontrasztszámot — és ezt a kódkomment ki is
mondja. Egy derivált token igazítása a deklarált céljához nem identitásváltás. **A
kontraszt nyer**, de a `--color-gold` érintetlen marad.

**A hero mottó mint márkagesztus vs. az `<h1>` mint az oldal tárgyának megnevezése.**
Ez a dokumentum legkényesebb pontja, mert a tartalom nem változtatható. A feloldás nem a
mottó eltávolítása, hanem a szerepének módosítása: a mottó maradhat a hero vizuális
főszereplője Caveat-ben, de a lap `<h1>`-ének azt kell megneveznie, hova érkezett a
látogató. **Az információs szerep nyer** — a márkagesztus így is teljes marad, csak nem
címsorként.

**Az ártranszparencia vs. a szegmenskonvenció.** Öt megnézett magyar szalonoldalból négy
nem közöl árat. A Libra teljes, magyarázott árlistát ad. Ez látszólag konvenció-sértés,
de a szalon helyzetében előny: aki tudja az árat, és mégis hív, az felkészült érdeklődő —
pontosan az, akire szükség van, amikor tele a naptár. **A transzparencia nyer**, és ez
tudatos differenciátor, nem elmaradás.

**A `verify.mts` 24 px-e vs. a `Button` 44 px-e.** Két szám ugyanarra a szabályra
egyetlen kis kódbázison belül. A kapu és a design nem mondhat mást. **A 44 nyer** (H2),
és a karusszel-pöttyök dokumentált kivétele marad kivétel.

**A közleménysáv elutasíthatósága vs. az információ fontossága.** A sáv
`localStorage`-ban jegyzi az elutasítást, tehát egy visszatérő látogató nem látja többé
— miközben a várólista-információ minden hívás előtt releváns. A feloldás nem a sáv
visszakényszerítése (az visszavinne az örökölt modal-mintához), hanem B2: ha a
nyitvatartás és a várakozási idő ott van minden `tel:` CTA mellett, a sáv elutasítása nem
jár információvesztéssel.

**Sötét téma: nem készül.** A brief megengedi a javaslatot, de a szalon karakteréből nem
következik: a vizuális nyelv a meleg fehér és a világos, természetes fényben készült
fotók; sötét felületen a 7-12%-os opacitású háttértextúrák és a `--color-line`
határvonalak logikája összeomlik. A költsége valós és számolható — a teljes tokenkészlet
duplikálása, a 23 kép háttérkezelésének újratervezése, a `verify.mts` 36 futásának
megduplázása —, miközben nincs mérés arról, hány látogató preferálná. **A világos téma
marad**, és ez rögzített döntés, nem elmaradás.

---

## 6. Nyitott kérdések

1. Aktuális-e a 3-4 hetes várakozási idő, és ha változik, ki és milyen ritmusan
   frissíti a `content/notice.ts` szövegét és a `version` mezőt?
2. A 9–17 tényleg mind a hét napra érvényes? Van-e nap, amikor zárva van, és van-e
   ismert éves szünet, amit a nyitvatartás megjelenítésének kezelnie kell?
3. Van-e olyan visszahívási vagy válaszidő-ígéret (pl. „SMS-re aznap válaszolok"), amit
   a telefonos CTA mellé ki lehet írni?
4. Kirakható-e a Google-profil közvetlen linkje a véleményszekcióba, és megjeleníthető-e
   a nyilvános átlagértékelés és darabszám?
5. Van-e mód a vélemények publikálási dátumának begyűjtésére (a `publishedAt` mező
   létezik, de üres), vagy a dátum nélküli megjelenítés marad?
6. A `sensitiveSkin.heading` („Érzékeny Bőrápolás") nagybetűzése és a `scope.heading`
   kisbetűs kezdete szándékos-e, vagy az örökölt szöveg hibája, amit javítani lehet? Ez
   a tipográfiai megjelenítést közvetlenül befolyásolja (T4).
7. Készül-e új fotó a masszőrről, vagy a jelenlegi `about-portrait` marad hosszú távon?

---

## 7. Források

1. **W3C — Web Content Accessibility Guidelines (WCAG) 2.2.** W3C Recommendation,
   2023-10-05, frissítve 2024-12-12; ISO/IEC 40500:2025.
   https://www.w3.org/TR/WCAG22/ — a H szakasz és a T1/T4 mércéje.
2. **W3C — Understanding WCAG 2.2.** https://www.w3.org/WAI/WCAG22/Understanding/ —
   belépő az egyes kritériumok magyarázatához.
3. **W3C — Understanding SC 1.4.3: Contrast (Minimum).**
   https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html — a 4,5:1-es
   küszöb és a „large text" definíció; K1, A2, F1.
4. **W3C — Understanding SC 1.4.11: Non-text Contrast.**
   https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html — a 3:1 vezérlőkre
   és állapotokra, és a „ha a tartalom azonosítja, nem kell keret" kivétel; A2, K1.
5. **W3C — Understanding SC 2.4.11: Focus Not Obscured (Minimum), AA (új a 2.2-ben).**
   https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html —
   H1, C4, N2.
6. **W3C — Understanding SC 1.4.10: Reflow.**
   https://www.w3.org/WAI/WCAG21/Understanding/reflow.html — a 320 CSS pixel eredete
   (1280 px @ 400% zoom); L2, H3.
7. **W3C — Understanding SC 1.4.4: Resize Text.**
   https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html — a 200%-os
   nagyíthatóság; T2, H3.
8. **W3C — Understanding SC 2.3.3: Animation from Interactions.**
   https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html — M3.
9. **MDN — `prefers-reduced-motion`.**
   https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion —
   vesztibuláris kockázat és a nem-esszenciális mozgás teljes megszüntetésének
   elvárása; M3.
10. **NN/g — Scroll-Triggered Text Animations Delay Users.** Aurora Harley, 2017-04-16.
    https://www.nngroup.com/articles/scroll-animations/ — a feladatorientált látogató és
    a fő szöveg animálásának tilalma; M2.
11. **NN/g — Scroll Fading 101.** Sara Paul, 2023-12-08.
    https://www.nngroup.com/articles/scroll-fading-101/ — a 100–400 ms-os sáv, az
    500 ms-os „too slow" küszöb, az egyszeri lejátszás és a mobilon való mellőzés;
    M1, M2.
12. **NN/g — Trustworthiness in Web Design: 4 Credibility Factors.** Aurora Harley,
    2016-05-08. https://www.nngroup.com/articles/trustworthy-design/ — a négy hitelességi
    faktor, köztük a külső oldalakhoz kapcsolódás; C3, F2, P2. (A P2-ben hivatkozott
    helyszínkeresési megállapítás forrása: NN/g — Helping Users Find Physical Locations,
    Jakob Nielsen, 2001-07-07,
    https://www.nngroup.com/articles/helping-users-find-physical-locations/ — régi
    kutatás, csak a térkép + útbaigazítás együttes szerepére hivatkozom belőle.)
13. **NN/g — 'Contact Us' Page Guidelines.** Anna Kaley, 2019-08-18.
    https://www.nngroup.com/articles/contact-us-pages/ — „Never hide or remove phone
    numbers", a nyitvatartás mint kötelező kapcsolati adat, a fejlécben való láthatóság;
    B1, B2, C5, N2.
14. **NN/g — Photos as Web Content.** Jakob Nielsen, 2010-10-31.
    https://www.nngroup.com/articles/photos-as-web-content/ — content vs. decoration
    fotó, a stock-modellek figyelmen kívül hagyása; F1, F2.
15. **Baymard Institute — Readability: The Optimal Line Length.** Edward Scott,
    2022-05-10. https://baymard.com/blog/line-length-readability — 50–75 karakteres
    ajánlás, WCAG 1.4.8 80 karakteres felső határ; T3. (A cikk nem közöl konkrét
    kihagyási arányt — ilyen számot nem is idézek.)
16. **Google Search Central — Review snippet (Review, AggregateRating) Structured Data.**
    Frissítve 2026-07-24.
    https://developers.google.com/search/docs/appearance/structured-data/review-snippet —
    a self-serving review szabály `LocalBusiness` és `Organization` típusra; C3.
17. **Google Search Central — Interstitials and dialogs.**
    https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials —
    az intrusive interstitial mint page experience jelzés; C4.
18. **Smashing Magazine — Addressing Accessibility Concerns With Using Fluid Type.**
    Maxwell Barvian, 2023-11-07.
    https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/
    — a „max ≤ 2,5× min" szabály és a levezetése; T2, H3.
19. **MDN — `text-wrap` / `hyphens`, és Can I use — magyar elválasztási szótár.**
    https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap ·
    https://caniuse.com/mdn-css_properties_hyphens_language_hungarian — a `balance`
    Chromiumban legfeljebb hat sorra hat; a magyar szótár globális támogatottsága
    95,77% (Chrome/Edge 87+, Safari 9.1+, Firefox 9+); T5.
20. **Szegmens-referenciák (megnézve 2026-08-08-án).**
    https://www.elizabeth-masszazs-szalon.hu/ (napi bontású nyitvatartás, `tel:`
    háromszor, Google-attribúciós „5,0/5", masszőr fotóval és bemutatkozással, harmadik
    féltől jövő foglaló, ár nincs) ·
    https://creativeharmony.hu/ (carousel hero, `tel:` kétszer, nyitvatartás nincs,
    vélemény nincs, masszőr-bemutatás nincs) ·
    https://www.nekemamasszazs.hu/ (kizárólag online foglalás, 8+ Google-idézet,
    telefonszám és nyitvatartás nem látható) ·
    https://www.gyogytornaszom.hu/a-gyogymasszazs/ (ár és napi nyitvatartás kiírva,
    telefonos elérés) ·
    https://www.dako-laszlo-gyogymasszor.com/masszazs-otthonaban/ (napi nyitvatartás,
    telefonos elérés). Az összevetés a C2, C3, C5 és B2 elveknél szerepel.
21. **web.dev — Click to Call.** Pete LePage, 2014-06-17.
    https://web.dev/articles/click-to-call — a `tel:` séma, a nemzetközi formátum és a
    desktop viselkedés; B1. (Régi cikk; az itt használt formátumszabály azóta
    változatlan.)
22. **W3C — Understanding SC 2.5.8: Target Size (Minimum), AA.**
    https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — a 24×24
    minimum és az inline-kivétel; H2.
23. **W3C — Understanding SC 2.5.5: Target Size (Enhanced), AAA.**
    https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html — a 44×44,
    amit a repó komponensei már követnek; H2.
24. **web.dev — Web Vitals.** https://web.dev/articles/vitals — LCP 2,5 s, INP 200 ms,
    CLS 0,1, a 75. percentilisen mérve; P1, P2.
25. **web.dev — Optimize resource loading with the Fetch Priority API.**
    https://web.dev/articles/fetch-priority — `fetchpriority="high"` az LCP-képre; P1.

**Módszertani megjegyzések.** A K1, K2 és A2 kontrasztértékeit magam számoltam a
WCAG 2.x relatív-luminancia képletével; a számítást a `#767676` = 4,54:1 ismert
referenciával hitelesítettem. A telefonos CTA optimális elhelyezésére, ismétlési számára
és kísérőszövegére **nem találtam mérvadó, publikált kutatást** — a keresés
SEO-tartalomfarmokat hozott, forrás nélküli számokkal (például „a masszázsfoglalások
70%-a telefonon történik"), amiket nem használok és nem idézek. A B1, B2 és N2 elvek
indoklása ezért két lábon áll: a [13] általános irányelvén és a szalon konkrét helyzetén
(nincs foglalómotor) — az elhelyezés részletei ezen belül **mérlegelt vélemény**, nem
mért tény. Hasonlóképp nincs adatom a szalon látogatóinak eszközmegoszlásáról,
demográfiájáról vagy a hívások számáról; ahol a dokumentum mobilon érkező látogatóról
beszél, az a szegmens általános feltételezése, nem a Libra mért adata.
