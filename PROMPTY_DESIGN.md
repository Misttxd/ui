# Prompty pro návrh rozhraní

Vlož vždycky jeden prompt. Prompt 1 dá celkový vzhled, prompty 2 až 5 rozpracují
jednotlivé části. Prompt 6 slouží k tomu, aby sis nechal ukázat víc směrů a pak
si vybral.

Čísla i názvy polí v promptech jsou skutečné, takže výsledek půjde rovnou
porovnat s tím, co backend vrací.

---

## Prompt 1 — celá stránka

```
Navrhni webové rozhraní k nástroji, který z novinového článku odhaduje, jak se
během následujících 30 minut pohne cena Bitcoinu. Je to výstup bakalářské práce,
takže rozhraní má působit jako seriózní analytický nástroj, ne jako obchodní
aplikace slibující zisk.

Jazyk rozhraní je čeština. Jedna stránka, bez přihlašování.

Systém funguje takhle: uživatel vloží článek, model ho zestruční, v databázi
761 historických událostí najde ty nejpodobnější, podívá se, jak se po nich cena
skutečně pohnula, a na základě toho odhadne směr.

Stránka obsahuje shora dolů:

1. Vstup — velké pole na text článku, nebo odkaz na článek. Přepínač mezi dvěma
   režimy: klasický RAG a agentní RAG. Tlačítko Předpovědět.
2. Průběh zpracování — trvá 6 až 25 sekund, takže musí být vidět, co se zrovna
   děje: zestručňuji článek, hledám v databázi, ptám se modelu. Kroky se
   odškrtávají, jak se dokončují. Žádná falešná procenta.
3. Výsledek — jedna ze tří tříd: DOWN, NEUTRAL nebo UP. Červená, šedá, zelená.
   Vedle toho očekávaný rozsah pohybu v procentech, označený jako odhad.
   Hlavní částí téhle sekce je svíčkový graf aktuální ceny Bitcoinu, ve kterém
   je odhad modelu zakreslený přímo do grafu: čárkovaně vyznačený rozsah, do
   kterého má cena podle modelu spadnout, a podbarvené 30minutové okno, kterého
   se odhad týká. Musí být na první pohled poznat, co je skutečná cena a co
   odhad. Pod grafem jádro dotazu, tedy věty, které model z článku vytáhl jako
   podstatné.
4. Nalezené historické události — 5 až 8 karet. Každá má titulek, datum, zdroj,
   podobnost (číslo 0 až 1), skutečnou změnu ceny po té události v procentech,
   shrnutí a odkaz na originál. Po rozkliknutí se u karty ukáže svíčkový graf
   s vyznačeným okamžikem zprávy.
5. Srovnání metod — malá tabulka: náhoda 0,326, MACD 0,324, RSI 0,224,
   majorita 0,161 (macro-F1 na 110 záznamech).

Svíčkové grafy jsou v tomhle rozhraní hlavní věc, ne ozdoba. Objevují se na
dvou místech: u predikce s vyznačeným odhadem modelu a u každé historické
události s vyznačeným okamžikem zprávy. Podle nich se celý nástroj posuzuje,
tak jim dej prostor.

Podobnost a skutečná změna ceny jsou nejdůležitější čísla na kartách, protože
na nich stojí celá myšlenka.

Použij vzhled odpovídající knihovně Mantine. Ukaž stav po dokončení predikce,
tedy s vyplněnými daty.
```

---

## Prompt 2 — karta historické události

```
Navrhni kartu jedné nalezené historické události v analytickém nástroji.

Data na kartě:
- titulek: "SEC Rejects Spot Bitcoin ETF Application From Ark"
- datum: 1. dubna 2022, 20:12
- zdroj: CoinDesk
- podobnost s vloženým článkem: 0,644
- skutečná změna ceny BTC za 30 minut po zprávě: +0,22 %
- třída: UP
- shrnutí: "The SEC rejected Ark 21Shares' application for a spot bitcoin ETF,
  citing concerns about market manipulation."
- odkaz na původní článek
- původní text článku, schovaný pod rozbalením

Karta jde rozkliknout a pak se pod ní ukáže svíčkový graf ceny Bitcoinu
v rozmezí 30 minut před zprávou a 90 minut po ní, se značkou v okamžiku
publikace.

Nejdůležitější jsou podobnost a skutečná změna ceny. Ukaž tři varianty, jak je
zvýraznit: číslem, pruhem a kroužkem.

Navrhni i stav, kdy je karta rozkliknutá a graf se ještě načítá.
```

---

## Prompt 3 — průběh zpracování

```
Navrhni zobrazení průběhu zpracování, které trvá 6 až 25 sekund.

Fáze jdou po sobě: přijato, zestručňuji článek, hledám v databázi, ptám se
modelu, hotovo. V agentním režimu navíc model sám formuluje vyhledávací dotazy,
takže jich může být několik po sobě.

Server hlásí každou fázi v okamžiku, kdy nastane, takže odškrtnutí znamená, že
krok opravdu proběhl. Nechci falešná procenta ani animaci, která jen odměřuje
čas.

U dokončených kroků chci vidět, jak dlouho trvaly. Zestručnění zabere kolem
šesti sekund.

Ukaž tři stavy: před spuštěním, uprostřed zpracování a po dokončení. Musí být
jasné, které kroky jsou hotové, který běží a které teprve přijdou.

Nesmí to vypadat jako falešný načítací pruh z podvodných webů. Má to působit
věcně, jako výpis průběhu.
```

---

## Prompt 4 — blok s predikcí

```
Navrhni blok, který ukazuje výsledek předpovědi v analytickém nástroji.

Obsahuje:
- třídu UP (druhé možnosti jsou DOWN a NEUTRAL), výrazně
- očekávaný rozsah pohybu +0,3 až +0,8 %, popsaný jako odhad modelu
- který ze dvou režimů odpovídal
- jádro dotazu: věty, které model z článku vytáhl jako podstatné
- svíčkový graf aktuální ceny Bitcoinu, ve kterém je čárkovaně vyznačený
  odhadovaný rozsah a podbarvené 30minutové okno, kterého se odhad týká

Z grafu musí být na první pohled poznat, co je skutečná cena a co odhad.

Někde v bloku musí být uvedeno, že jde o experimentální výstup a že model
zatím nepřekonává jednoduché statistické metody.

Navrhni i variantu, kdy vložený text není zpráva o události, ale komentář nebo
analýza — v tom případě se má zobrazit varování, že výsledek bude nespolehlivý.
```

---

## Prompt 5 — vstupní část

```
Navrhni vstupní část analytického nástroje.

Uživatel může vložit buď celý text článku (klidně 5000 znaků), nebo odkaz na
článek. Nechci na to rozbalovací seznam, má to působit elegantně a být hned
jasné, co se od uživatele čeká.

Dál je tu přepínač mezi dvěma režimy: klasický RAG a agentní RAG. Rozdíl je
v tom, že agentní si sám formuluje víc vyhledávacích dotazů a trvá déle.
Uživatel musí pochopit, co volí.

Tlačítko Předpovědět je zakázané, dokud není co odeslat.

Ukaž tři varianty řešení dvojího vstupu:
1. dvě záložky, každá se svým polem
2. jedno pole, které samo pozná, jestli je uvnitř text nebo odkaz
3. jiné řešení, které tě napadne

U varianty s odkazem navrhni i stav, kdy se článek stáhl a uživatel vidí náhled
staženého textu, než potvrdí odeslání.
```

---

## Prompt 6 — víc směrů na výběr

Až budeš mít z prompt 1 první návrh, použij tenhle, ať máš z čeho vybírat.

```
Ukaž tři výrazně odlišné vizuální směry pro tohle rozhraní:

1. Střízlivý a hustý, jako analytický nástroj — hodně informací na obrazovce,
   malá písmena, tabulky.
2. Vzdušný a klidný, s velkými odstupy a jedním hlavním sdělením na obrazovce.
3. Tmavý, ve stylu obchodních platforem, kde jsou grafy hlavní hvězdou.

U každého napiš jednou větou, komu vyhovuje a co je jeho nevýhoda.
```

---

## Na co si dát pozor

**Barvy tříd drž v celé aplikaci stejné.** DOWN červená, NEUTRAL šedá, UP
zelená.

**Nenech si navrhnout věci, které backend neumí.** Návrh ti klidně přidá
graf sentimentu nebo historii dotazů. Nic z toho neexistuje a dodělávat to
kvůli obrázku nemá smysl.

**Výsledný návrh je předloha, ne zadání.** V Mantine bude některá věc jinak
a to je v pořádku.
