# Prompt — Frontend design elvek kutatása és terv

Ez a fájl **nem** dokumentáció, hanem egy futtatható prompt. Másold be egészében
egy új Claude Code munkamenetbe ebben a repóban (vagy hivatkozz rá:
„Hajtsd végre a `docs/prompts/frontend-design-research.md`-ben leírt feladatot").

A prompt kimenete egyetlen dokumentum: `docs/design/frontend-design-principles.md`.
Végrehajtási terv **nem** ennek a feladata — az külön lépés lesz, ebből a
dokumentumból dolgozva.

---

<szerep>
Senior frontend design lead vagy, aki egyszerre ért a vizuális designhoz, a
design system architektúrához és a webes UX-kutatáshoz. A szakterületed a kicsi,
helyi, egyszemélyes szolgáltatóvállalkozások weboldala: ahol nincs marketing
csapat, nincs A/B teszt, nincs online foglalómotor, és a siker egyetlen mérőszáma
az, hogy hányan veszik fel a telefont.

Úgy dolgozol, mint egy tapasztalt tervező, aki *bizonyítékkal* érvel: minden
állításodhoz tudod, honnan tudod, és megmondod, mennyire vagy biztos benne.
</szerep>

<feladat>
Készíts egy átfogó, döntésorientált **frontend design elvek tervet** a repóban
lévő weboldalhoz (Libra Masszázs Szalon, libraszalon.hu).

A terv három forrásból áll össze, ebben a sorrendben:

1. **A repó tényleges állapota** — mi van már most megépítve, milyen tokenekkel,
   milyen komponensekkel, milyen megkötésekkel.
2. **Kutatás** — mai (2026-os) design elvek, akadálymentességi és teljesítmény-
   szabványok, valamint a wellness/masszázs/egészségügyi szolgáltatói szegmens
   bevett vizuális és UX konvenciói.
3. **Szintézis** — az a metszet, ami *ehhez* a szalonhoz passzol. Nem az, ami egy
   általános weboldalhoz passzolna.

A végeredmény egy olyan dokumentum, amiből egy másik AI (vagy ember) később
végrehajtási tervet tud írni anélkül, hogy újra kellene kutatnia bármit.
</feladat>

<kontextus>
**A vállalkozás.** Libra Masszázs Szalon, Budapest II. kerület, Hidegkúti út 174.
Egyetlen masszőr: Dévényi Krisztina, okleveles gyógymasszőr. Szolgáltatások:
aromaterápiás masszázs, klasszikus svédmasszázs, kombinált svédmasszázs, köpölyös
fascia mobilizáció, ajándékutalvány. Árak 13.000–19.000 Ft között. Nyitva minden
nap 9–17.

**Két dolog, ami az egész designt meghatározza:**

- **Nincs online foglalás.** Az egyetlen konverziós út a telefonhívás (és
  másodsorban az e-mail). A site tetején álló közlemény ráadásul azt írja, hogy
  új vendéget csak korlátozottan tud fogadni, és 3-4 hét a várólista. Tehát a
  cél nem a maximális lead-mennyiség, hanem a **bizalom és a jól informált,
  reális elvárású érdeklődő**.
- **A vizuális identitás örökölt, nem tervezhető újra.** A paletta és a
  betűtípusok egy az egyben a régi WordPress/Elementor oldalról jöttek át
  (`app/globals.css` kommentje ezt le is írja), a szövegek pedig szó szerint a
  régi oldalról. A terv ezen belül optimalizál — **nem rebrandel**.

**A weboldal technikailag.** Next.js 16 App Router, TypeScript, statikus export
(`output: 'export'`), Tailwind CSS v4 CSS-first tokenekkel, `next/font`-tal
self-hosted Source Sans 3 / Roboto / Caveat, build-időben előfeldolgozott
AVIF+WebP képszettek. Hat oldal: `/`, `/bemutatkozas/`, `/arak/`,
`/arak/elso-masszazs/`, `/hazirend/`, `/kapcsolat/`.
</kontextus>

<munkamenet>
Dolgozz végig ezen a hat lépésen. Ne ugorj előre: a 2. lépés kutatási kérdéseit
az 1. lépés eredménye élesíti.

**1. lépés — Leltár a repóról (kutatás ELŐTT).**
Olvasd el ténylegesen, ne találgass:

- `app/globals.css` — a teljes tokenkészlet, alaprétegek, animációk
- `app/layout.tsx`, `app/template.tsx`, `app/page.tsx` és mind az 5 aloldal
- `components/` mind a 4 alkönyvtára és a `components/ui/` teljes egésze
- `content/` — `site.ts`, `services.ts`, `prices.ts`, `nav.ts`, `notice.ts`,
  `reviews.ts`, `seo.ts`, `pages/*.ts`
- `lib/images.ts`, `lib/seo.ts`, `lib/jsonld.ts`
- `scripts/verify.mts` — ez mondja meg, milyen minőségi kapukat *állít már fel*
  a projekt magának
- `README.md` — az „Amire figyelni kell" szakasz kötelező
- `next.config.ts`, `vercel.json`, `package.json`

Készíts magadnak (a fejedben vagy jegyzetben, nem a végleges dokumentumba) egy
listát arról, hogy **mi van már megoldva**. A tervben később minden elvnél tudnod
kell, hogy az adott elv már teljesül, részben teljesül, vagy hiányzik.

**2. lépés — Kutatás.**
Használd a web keresést és lekérést. Elsődleges, mérvadó forrásokat keress
(szabványok, platform-dokumentáció, publikált kutatás), nem SEO-tartalomfarmokat
és nem „10 tipp a weboldaladhoz" blogposztokat. Minimum **15 érdemi forrás**,
mindegyiknél jegyezd fel az URL-t és a publikálás/frissítés dátumát.

Amit kutass:

- *Szabvány és mérés*: WCAG 2.2 AA (különösen kontraszt, célméret, fókusz-
  láthatóság, mozgás), Core Web Vitals aktuális küszöbei (LCP, INP, CLS), és hogy
  ezekből mi **design-döntés** és nem mérnöki döntés.
- *Tipográfia*: olvashatóság hosszú szövegnél, sorhossz, sorköz, méretskála,
  fluid típus, és kifejezetten: mikor működik és mikor bukik el egy kézírásos
  (script) betűtípus a UI-ban — a site a Caveat-et használja a hero-idézetre.
- *Szín*: alacsony telítettségű, meleg/„természetes" paletták viselkedése,
  aranyszín mint akcentus, kontrasztkorlátok, és mikor indokolt egy márkaszínnek
  külön „szöveg-változata" (a repóban ez a `--color-gold-ink`).
- *Fotográfia*: mi különbözteti meg a hiteles szolgáltatói fotót a stock
  wellness-kliséktől; hogyan viselkedik a fotó háttérként alacsony opacitáson;
  arányok, fókuszpont, alt-szöveg mint designkérdés.
- *Mozgás*: scroll-reveal minták kockázatai (tartalom, ami sosem jelenik meg),
  `prefers-reduced-motion`, mennyi mozgás fér bele egy nyugalmat ígérő
  szolgáltatás oldalára.
- *Layout és ritmus*: vertikális ritmus, szekcióváltás jelzése színnel vs.
  térközzel, tartalommérték hosszú szövegű oldalakon (házirend, első masszázs).
- *Szegmens-konvenciók*: nézz meg **konkrét valós oldalakat** — magyar masszázs-
  és wellness-szalonokat, és 3-5 nemzetközi referenciát, amit tényleg jól
  csináltak. Írd le, mi a visszatérő minta, és melyiket érdemes követni, melyiket
  nem. Nevezd meg őket URL-lel.
- *Konverzió telefonos foglalásnál*: hogyan viselkedik egy `tel:` CTA mobilon és
  desktopon, hol a helye, hányszor ismételhető, mit kell mellé írni (nyitvatartás,
  visszahívás ígérete, várólista) — és mit tudunk arról, mi épít bizalmat egy
  egészségügyi jellegű szolgáltatásnál (végzettség, arc, tér, vélemények,
  átláthatóság az árban).
- *Helyi vállalkozás*: a Google Business/térkép-jelenlét és a weboldal
  összjátéka annyiban, amennyiben **frontend design** kérdés (NAP-konzisztencia
  megjelenítése, vélemény-megjelenítés, nyitvatartás).

Ahol a kutatás ellentmond a repó jelenlegi megoldásának, azt **külön jelöld** —
ezek lesznek a legértékesebb megállapítások.

**3. lépés — Szűrés erre a szalonra.**
Minden kutatási megállapításnál tedd fel a kérdést: *igaz ez ITT is?* Egy
egyszemélyes szalonnál, ami tele van, aminek 3-4 hét a várólistája, aminek a
látogatói túlnyomórészt mobilon érkeznek, és aki nem tud A/B tesztelni. Ami nem
állja ki ezt a próbát, azt dobd ki — ne kerüljön be „a teljesség kedvéért".

**4. lépés — Elvek megfogalmazása.**
Írj **20–30 elvet**, a `<kimenet>`-ben megadott témakörökbe rendezve. Minden elv
a `<pelda>`-ban megadott formátumot követi. Egy elv akkor jó, ha:

- **állítás**, nem téma („A telefonszám minden oldalon egy koppintással
  elérhető", nem „Telefonos elérhetőség")
- **eldönthető**, hogy teljesül-e — valaki meg tudja nézni és igent vagy nemet
  tud mondani
- **ehhez az oldalhoz** szól, konkrét oldalt, komponenst vagy tokent nevez meg
- lenne olyan **ésszerű alternatívája**, amit elvetettél — ha nincs, akkor az elv
  triviális, és nem kell bele

**5. lépés — Hézagelemzés.**
Minden elvhez rendelj állapotot a repó mai állapotához képest:
`✓ teljesül` / `~ részben` / `✗ hiányzik` / `? nem eldönthető olvasásból`.
Ez a rész lesz a későbbi végrehajtási terv nyersanyaga — de **magát a
végrehajtási tervet ne írd meg** (lásd `<hatarok>`).

**6. lépés — Önkritika, mielőtt kiírod.**
Olvasd vissza a saját tervedet, és javítsd, ha bármelyikre igen a válasz:

- Van benne olyan mondat, ami **bármelyik** weboldalra igaz lenne? Töröld vagy
  élesítsd.
- Van olyan állítás, aminek nincs forrása és nem is a repó ténye? Vagy adj hozzá
  forrást, vagy jelöld meg véleményként.
- Javasoltál bármit, ami a `<kotelezo_megkotesek>`-be ütközik? Vedd ki.
- Elcsúsztál a végrehajtás felé (fájlok, taskok, becslések)? Vedd ki.
- Kimaradt olyan témakör, amiről a szalon látogatója szempontjából muszáj lenne
  beszélni? Pótold.
</munkamenet>

<hatarok>
**Benne van:** kizárólag frontend design elvek — vizuális nyelv, tipográfia,
szín, tér, layout, komponens-viselkedés, mozgás, képi világ, akadálymentesség,
reszponzivitás, és a teljesítmény annyiban, amennyiben designdöntés következménye.

**Nincs benne:**

- backend, CMS, foglalómotor, űrlapkezelés, fizetés, integráció
- szövegírás vagy szövegátírás — a tartalom szó szerint a régi oldalról jön, és
  ez szándékos; a terv arról szól, **hogyan jelenik meg** a szöveg, nem arról,
  mi legyen benne
- SEO-tartalomstratégia, kulcsszavak, linképítés (a strukturált adat és a
  szemantikus jelölés viszont annyiban belefér, amennyiben megjelenési kérdés)
- **kód, kódrészlet, diff, fájlmódosítás** — a `docs/design/`-ba írt egyetlen
  dokumentumon kívül semmilyen fájlt ne hozz létre és ne módosíts
- **végrehajtási terv**: nincs fázisolás, nincs feladatlista, nincs sorrend,
  nincs becslés, nincs „1. lépés: nyisd meg a Header.tsx-et". Az elvek *mit* és
  *miért* kérdésre válaszolnak; a *hogyan* egy külön dokumentum lesz.
- rebrand: új logó, új betűtípus-család, új alapszín. Ha a kutatás alapján
  valamelyik örökölt elem tényleg problémás, azt írd le a „Feszültségek"
  szakaszban érvvel — de ne tervezz rá cserét.
</hatarok>

<kotelezo_megkotesek>
Ezek a repó tényei. Minden elvnek el kell férnie bennük; ami ütközik velük, az
nem javaslat, hanem hiba.

1. **Statikus export.** Nincs szerver, nincs futásidejű logika, nincs
   `next/image` optimalizáló. Minden kép build-időben készül.
2. **Az URL-ek nem változhatnak.** `trailingSlash: true`, a címek a WordPress-szel
   azonosak. Navigációs átszervezés, ami URL-t mozgat, tilos.
3. **Telefon az elsődleges CTA.** Nincs foglalási felület, és nem is tervezünk
   ilyet.
4. **Emoji nincs az oldalon.** Sehol.
5. **`#cc9955` (`--color-gold`) szövegre nem elég kontrasztos fehéren (2.6:1).**
   Vonalhoz, csillaghoz, ikonhoz jó; szöveghez a `--color-gold-ink` (`#a2732f`)
   van. Ezt a megkülönböztetést a terv tartsa tiszteletben és erősítse.
6. **A tokenkészlet adott** (`app/globals.css` `@theme` blokkja): `--color-ink`,
   `--color-gold`, `--color-gold-ink`, `--color-muted`, `--color-surface`,
   `--color-subtle`, `--color-line`, a `--text-*` fluid skála, `--container-width`,
   `--container-pad`, `--ease-out-expo`. Új tokent javasolhatsz, de indokold, és
   nevezd meg, melyik meglévő mintát követi.
7. **Betűtípusok: Source Sans 3 (heading), Roboto (body), Caveat (script)**,
   `latin-ext` alszettel — a magyar `ő`/`ű` miatt kötelező. Betűtípus-cserét ne
   javasolj.
8. **`prefers-reduced-motion` teljes kikapcsolót jelent.** Mozgással kapcsolatos
   minden elvnek működnie kell akkor is, ha nincs mozgás.
9. **320 px-től 1440 px-ig minden töréspont éles.** A `scripts/verify.mts`
   320/360/390/768/1024/1440-en fut, és hibát dob vízszintes túlcsordulásra, le nem
   futó scroll-animációra, hiányzó vagy többszörös `<h1>`-re, és 24 px alatti
   kattintható elemre. A terv ezt a kapurendszert vegye adottnak, és javasolhat
   szigorítást.
10. **Magyar nyelv.** Hosszú összetett szavak (`ajándékutalvány`,
    `állapotfelmérés`), `hyphens: auto`, `lang="hu"`. Ez tipográfiai megkötés.
11. **Jelenleg csak világos téma van** (`colorScheme: 'light'`). Sötét témát
    javasolhatsz, de csak ha a szalon karakteréből és nem divatból következik, és
    írd le a költségét is.
12. **Nulla layout shift.** A `<Picture>` minden `<img>`-re kiírja a
    `width`/`height`-et. Ami ezt megtörné, az nem opció.
13. **Nincs új futásidejű függőség.** Animációs könyvtár, karusszel-könyvtár,
    UI-készlet nem jöhet szóba; a jelenlegi függőségi lista minimális és az is
    marad.
</kotelezo_megkotesek>

<pelda>
Így néz ki egy **jó** elv-bejegyzés:

---
**T3. Az ár soha nem jelenik meg magyarázat nélkül.**

*Elv.* Minden ársor mellett ott a szolgáltatás időtartama és az, hogy mi van
benne — az `/arak/` oldalon és bárhol máshol, ahol ár szerepel. Az összeg
önmagában sosem áll.

*Miért.* 13.000–19.000 Ft egy egyszeri kezelésért olyan összeg, amit a látogató
mérlegel. Az ár melletti kontextus („90 perc, szóbeli állapotfelméréssel
egybekötött diagnosztikai masszázs") a döntés alapja; kontextus nélkül az összeg
csak akadály. A `content/prices.ts` `note` mezője pontosan ezt a célt szolgálja,
tehát az adatszerkezet már támogatja.

*Hogyan látszik itt.* `components/prices/PriceCard.tsx`, `/arak/`; a `--text-price`
token az összegnek, `--color-muted` a magyarázatnak — az árnál a méretkülönbség
adja a hierarchiát, nem a szín.

*Elvetett alternatíva.* „Ártól" jellegű összefoglaló a főoldalon. Elvetve: a
szalon egyetlen masszőrrel dolgozik és tele van, tehát nem árversenyben áll;
a részletes, kontextusos ár többet használ a bizalomnak, mint a horgonyzás.

*Ellenőrzés.* Nincs olyan Ft-összeg a site-on, aminek ne lenne mellette
időtartam és leírás.

*Állapot.* ✓ teljesül — de a főoldalon nincs ár, és a terv nem is javasolja.

*Forrás.* NN/g — pricing transparency in service businesses (URL, dátum);
`content/prices.ts`.

---

Így néz ki egy **rossz** bejegyzés, és emiatt rossz:

> **Használj térközt.** A fehér tér segít, hogy a tartalom lélegezzen, és
> professzionálisabbá teszi az oldalt. Javasolt következetes térközskála.

Bármelyik weboldalra igaz, nem eldönthető, nem nevez meg semmit ebből a repóból,
nincs alternatívája és nincs forrása. Ilyet ne írj.
</pelda>

<kimenet>
Egyetlen fájl: **`docs/design/frontend-design-principles.md`**. Ha létezik,
írd felül. Máshova ne írj, mást ne módosíts.

Szerkezet:

1. **Fejléc** — a dokumentum célja 3-4 mondatban, a készítés dátuma, és egy
   mondat arról, hogy ez elvek gyűjteménye, nem végrehajtási terv.
2. **Vezetői összefoglaló** — 8–12 pont: a legfontosabb megállapítások, köztük
   kifejezetten az, hogy hol tér el a kutatás a jelenlegi megoldástól.
3. **A design karakter tézise** — 1 bekezdés + 5-8 melléknév/tiltás páros
   („nyugodt, de nem élettelen; meleg, de nem édeskés" jelleggel), amiből az
   összes többi elv levezethető. Ez a dokumentum gerince: ha később egy döntésnél
   nincs explicit elv, ebből kell tudni válaszolni.
4. **Elvek** — 20–30 darab, a `<pelda>` formátumában, ezekbe a témakörökbe
   rendezve (a jelölés legyen konzisztens: `K1`, `K2`… színnél, `T1`… tipográfiánál
   stb., hogy a végrehajtási terv hivatkozni tudjon rájuk):
   - **A** — Márkakarakter és vizuális hang
   - **K** — Szín és kontraszt
   - **T** — Tipográfia (beleértve a magyar nyelvi sajátosságokat és a script
     betű szerepét)
   - **L** — Layout, rács, vertikális ritmus, reszponzivitás
   - **F** — Fotográfia és képi világ
   - **C** — Komponens-nyelv (gomb, kártya, ársor, vélemény, közleménysáv,
     navigáció, lábléc)
   - **M** — Mozgás és mikrointerakció
   - **N** — Navigáció és információs architektúra a hat oldalon belül
   - **B** — Bizalom és konverzió (telefonos foglalás, vélemények, várólista,
     szakmai hitelesség)
   - **H** — Akadálymentesség (WCAG 2.2 AA)
   - **P** — Teljesítmény mint designkényszer
5. **Hézag-áttekintés** — egyetlen táblázat: elv azonosítója, rövid címe,
   állapot (`✓ / ~ / ✗ / ?`), és egy mondat arról, mi hiányzik. Semmi több — a
   megoldás nem ide tartozik.
6. **Feszültségek és kompromisszumok** — ahol két elv vagy egy elv és egy
   megkötés ütközik (pl. „a scroll-reveal karaktert ad" vs. „a tartalom sosem
   maradhat láthatatlan"), és melyik nyer, miért.
7. **Nyitott kérdések** — amit a tulajdonosnak vagy egy mérésnek kell eldöntenie.
   Mindegyik konkrét, eldöntendő kérdés legyen, ne téma.
8. **Források** — számozott lista, URL-lel és dátummal, egy mondat arról, mihez
   használtad. A dokumentum törzsében ezekre a számokra hivatkozz.

**Terjedelem.** Amennyi indokolt; irányadóan 2500–4500 szó. Töltelék nélkül: ha
egy bekezdés nem visz közelebb egy döntéshez, ne legyen benne.
</kimenet>

<stilus>
Magyarul írj, a szakkifejezéseket hagyd angolul, ahogy a szakmában használatosak
(`token`, `hero`, `viewport`, `focus ring`). A dokumentum hangja a repó
kódkommentjeinek hangját kövesse: tömör, magyarázó, indoklással — nem
marketinges és nem tankönyvi.

- Folyó szöveg és táblázat vegyesen; a felsorolás akkor jó, ha tényleg lista.
- Emoji nincs — sem a site-on, sem ebben a dokumentumban (a `✓ ~ ✗ ?`
  státuszjelek nem emojik, azok maradhatnak).
- Nincs „világszínvonalú", „lenyűgöző", „modern és letisztult" típusú töltelék.
- Ahol nem vagy biztos, írd oda, hogy nem vagy biztos, és miért. Ez értékesebb,
  mint egy magabiztos találgatás. Ha egy adatot nem találsz, azt írd, hogy nem
  találtad — **statisztikát vagy kutatási eredményt kitalálni tilos**.
- Ne állíts semmit a vállalkozásról, ami nem a `content/` fájlokból vagy a
  megadott kontextusból következik. Vendégszám, célcsoport-demográfia, bevétel,
  versenytárs-pozíció: ezekről nincs adatod.
</stilus>

<antipatternok>
Amit biztosan ne csinálj:

- Ne javasolj rebrandet, új betűtípust, új alapszínt vagy új logót.
- Ne javasolj lila/kék gradienst, üveghatást, neon akcentust, „AI-s" vizuális
  divatelemet. A szalon karaktere meleg, természetes, nyugodt.
- Ne javasolj könyvtárat (Framer Motion, GSAP, Swiper, shadcn/ui, ikonkészlet).
- Ne javasolj funkciót, ami szervert igényel (foglalás, hírlevél, chat, kereső).
- Ne írj általános design-tankönyvet. Ha egy elv mellől kihúzható a
  „masszázsszalon" szó és még mindig működik, akkor nem elég konkrét.
- Ne sorolj fel mindent, amit tudsz. 25 éles elv többet ér 60 langyosnál.
- Ne kezdd el a végrehajtási tervet, még „bónuszként" sem a végén.
- Ne módosíts kódot. Egyetlen fájlt hozol létre: a dokumentumot.
</antipatternok>

<befejezes>
Amikor kész vagy, a chatben **ne** a dokumentumot idézd vissza. Írj helyette:

1. a fájl útvonalát,
2. 5-8 mondatban a legfontosabb megállapításokat — kiemelve azt a 2-3 pontot,
   ahol a kutatás szerint a jelenlegi oldal mást csinál, mint kellene,
3. a nyitott kérdéseket, amikre választ vársz,
4. egy mondatot arról, mi az, amit nem tudtál megnyugtatóan kikutatni.
</befejezes>
