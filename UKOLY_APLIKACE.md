# Úkoly: od cvičení ke skutečné aplikaci

Cvičení máš hotová. Tenhle dokument staví rozhraní podle **tvojí** představy,
ne podle původního FRONTEND.md — ten byl výrazně skromnější.

Každý úkol má tři části:

- **CO SE UČÍŠ** — technika a její zápis, na cizím příkladu
- **MÁŠ NA VÝBĚR** — možnosti, mezi kterými se rozhoduješ ty
- **MUSÍ PLATIT** — co má na konci fungovat, ať poznáš, že jsi hotový

Rozvržení, pojmenování a vzhled jsou na tobě. Zadání ti říká jak, ne kde.

`Cviceni.tsx` a `Cviceni2.tsx` nech být — jsou to tvoje poznámky.

## Co všechno chceš mít

1. elegantní vstup: text článku **nebo** odkaz na něj
2. viditelný průběh zpracování — co už systém udělal, bez falešných animací
3. predikce se svíčkovým grafem a vyznačeným očekávaným rozsahem
4. nalezené podobné události i s metrikami (kontextová podobnost)
5. u každé historické události rozklikávací svíčkový graf se značkou v okamžiku
   události
6. varování, když vstup není zpráva
7. tabulka srovnání s RSI, MACD a náhodou

Body 3 a 5 vyžadují **práci na backendu**. Proto je dokument rozdělený na tři
části: co jde udělat hned, co je potřeba dodělat v Pythonu, a co se dá postavit
teprve potom.

---

# ČÁST 1 — frontend, jde udělat hned

## Úkol A — rozdělení do souborů

### CO SE UČÍŠ

Zatím máš všechno v jednom souboru. Každá komponenta patří do vlastního, jinak
se v tom nedá hledat a při chybě nevíš kam kouknout.

```tsx
// src/components/Vitejte.tsx
export default function Vitejte() {
  return <h1>Ahoj</h1>
}
```

```tsx
import Vitejte from './components/Vitejte'
```

Bez složených závorek, protože je to `default`. Cesty: `./` stejná složka,
`../` o jednu výš. Přípona `.tsx` se nepíše.

Typ z jiného souboru se importuje zvlášť slovem `type`:

```tsx
import type { Udalost } from '../api'
```

### MÁŠ NA VÝBĚR

Jak jemně to rozdělíš:

1. jeden soubor a v něm všechno — přehledné teď, nepřehledné za týden
2. zvlášť vstup, výsledek, seznam událostí — rozumný střed
3. vlastní soubor i pro jednu kartu a pro graf

Doporučuju třetí, protože grafy budou složité. Kde soubory budou a jak je
pojmenuješ, je na tobě — jen buď důsledný.

Rozmysli si taky, kdo drží stav. Zatím `Cviceni2`, nově nejspíš `App.tsx` nebo
komponenta, kterou `App` vykreslí.

### MUSÍ PLATIT

- `App.tsx` vykresluje skutečnou aplikaci, ne cvičení
- žádný soubor nad zhruba 150 řádků
- `npm run typecheck` i `npx eslint src` projdou

---

## Úkol B — vstup: text nebo odkaz

### CO SE UČÍŠ

Chceš dva způsoby vstupu v jednom poli, ale ne rozbalovací seznam. Jsou tři
cesty a všechny jsou legitimní:

**Záložky.** Mantine `Tabs` — dvě záložky, každá má svoje pole:

```tsx
<Tabs defaultValue="text">
  <Tabs.List>
    <Tabs.Tab value="text">Vložit text</Tabs.Tab>
    <Tabs.Tab value="odkaz">Z odkazu</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="text"><Textarea /></Tabs.Panel>
  <Tabs.Panel value="odkaz"><TextInput /></Tabs.Panel>
</Tabs>
```

**Jedno pole, které se samo pozná.** Uživatel píše do jednoho místa a ty podle
obsahu rozhodneš, co to je:

```ts
const jeOdkaz = vstup.trim().startsWith('http')
```

`startsWith` vrací `true`/`false`. Doplň k tomu popisek, který se mění podle
toho, co systém rozpoznal — uživatel pak vidí, že mu rozumíš.

**Dvě pole vedle sebe** s tím, že vyplněné může být jen jedno.

### MÁŠ NA VÝBĚR

- kterou ze tří cest zvolíš
- jestli u odkazu ukážeš náhled staženého textu, než se odešle. Doporučuju ano —
  uvidíš, jestli se extrakce povedla, a je to poctivé vůči uživateli.
- `Textarea` s `autosize` a `minRows`, nebo pevná výška
- kam dáš přepínač režimu prostý/agentní (viz úkol C)

### MUSÍ PLATIT

- jde vložit text i odkaz
- tlačítko je zakázané, dokud není co odeslat
- při přepnutí způsobu vstupu se nesmaže rozepsaný obsah

Volání pro odkaz vznikne až v úkolu I. Do té doby nech tu větev nečinnou nebo
napiš, že se na ní pracuje.

---

## Úkol C — přepínač režimů

### CO SE UČÍŠ

Backend má dva endpointy: `/predict` a `/predict/agent`. Zatím voláš jen první.

Funkce `predikuj` dostane druhý parametr. Parametry se oddělují čárkou:

```ts
export async function nactiKnihu(nazev: string, jazyk: 'cs' | 'en') {
  const adresa = jazyk === 'cs' ? '/knihy/cs' : '/knihy/en'
}
```

Adresu můžeš složit i vložením proměnné do textu pomocí zpětných apostrofů:

```ts
const adresa = `http://localhost:8000/predict/${jazyk}`
```

Tomu se říká šablonový řetězec: co je v `${}`, se dosadí jako hodnota.

Přepínač je řízená komponenta jako `<Textarea>`:

```tsx
const [jazyk, setJazyk] = useState('cs')

<SegmentedControl
  value={jazyk}
  onChange={setJazyk}
  data={[
    { label: 'Česky', value: 'cs' },
    { label: 'Anglicky', value: 'en' },
  ]}
/>
```

`data` je pole možností: `label` uvidí uživatel, `value` se uloží do stavu.

### MÁŠ NA VÝBĚR

- `SegmentedControl`, `Switch`, nebo `Radio.Group` — liší se jen vzhledem
- popisky: „prostý / agentní RAG" je přesné, ale laik netuší. Zvaž „rychlý /
  důkladný" s vysvětlivkou v `Tooltip`.
- jestli přepínač během načítání zakázat

### MUSÍ PLATIT

- oba režimy volají různé endpointy
- v odpovědi je vidět `rezim`
- přepnutí nesmaže rozepsaný text

---

## Úkol D — karta události a její metriky

### CO SE UČÍŠ

Zatím jsi propem posílal text, číslo a funkci. Stejně se dá poslat **celý
objekt**:

```tsx
import type { Kniha } from '../api'

type KartaProps = {
  kniha: Kniha
}

export default function Karta({ kniha }: KartaProps) {
  return (
    <Card withBorder padding="md">
      <Text fw={700}>{kniha.nazev}</Text>
      <Text size="sm" c="dimmed">{kniha.autor}</Text>
    </Card>
  )
}
```

Použití a v cyklu:

```tsx
<Karta kniha={nejakaKniha} />
{knihy.map((k) => <Karta key={k.isbn} kniha={k} />)}
```

Mantine na text: `Text` s propy `size`, `fw` (tloušťka), `c` (barva, `"dimmed"`
je zašedlá). `Title` na nadpisy, `Group` vedle sebe, `Stack` pod sebe.

Na zvýraznění čísla se hodí `RingProgress` nebo `Progress`:

```tsx
<Progress value={udalost.podobnost * 100} />
```

### MÁŠ NA VÝBĚR

K dispozici máš `titulek`, `datum`, `label`, `zmena_pct`, `podobnost`, `jadro`,
`zdroj`, `url` a `obsah`.

- **`Card` nebo `Paper`** — Card má rámeček a oddíly, Paper je jen plocha
- **jak zobrazit podobnost** — číslo, pruh, kroužek. Řekl jsi, že si na téhle
  metrice zakládáš, tak jí dej prostor.
- **jak zobrazit `zmena_pct`** — je to skutečný pohyb ceny po té historické
  události, tedy jádro celé myšlenky. Znaménko a barva.
- **pořadí a hierarchie** — je důležitější titulek, nebo `jadro`?
- **řazení karet** — přijdou seřazené podle podobnosti; chceš to tak nechat?

Napiš k `podobnost` vysvětlivku. Ty víš, co to je. Oponent ne.

### MUSÍ PLATIT

- karta bere jednu událost propem a nesahá na nic vnějšího
- každá karta má `key`
- prázdné pole `podobne` rozhraní nerozbije

---

## Úkol E — formátování data a čísel

### CO SE UČÍŠ

Backend posílá `"2022-04-01T18:12:00Z"` a `0.644`. Takhle se to ukazovat nemá.

```ts
new Date('2022-04-01T18:12:00Z').toLocaleString('cs-CZ')
// "1. 4. 2022 20:12:00"

new Date(datum).toLocaleDateString('cs-CZ', {
  day: 'numeric', month: 'long', year: 'numeric',
})
// "1. dubna 2022"

(0.644).toFixed(2)        // "0.64"
(0.644 * 100).toFixed(0)  // "64"
```

`toFixed` vrací text, ne číslo.

### MÁŠ NA VÝBĚR

- jestli u data ukážeš i čas. U 30minutového cíle je čas podstatný.
- `podobnost` jako `0.64` nebo `64 %`. Procenta jsou čitelnější, ale nejsou to
  procenta v pravém smyslu — je to kosinová podobnost. Když zvolíš procenta,
  napiš to do vysvětlivky.
- jestli si napíšeš pomocné funkce (`formatujDatum`, `formatujProcenta`) do
  vlastního souboru. Doporučuju ano, použiješ je na víc místech.

### MUSÍ PLATIT

- žádné syrové ISO datum ani nezaokrouhlené číslo v rozhraní
- záporná změna je poznat na první pohled

---

## Úkol F — odkaz na originál a rozbalení textu

### CO SE UČÍŠ

```tsx
<Anchor href={kniha.url} target="_blank" rel="noreferrer">
  otevřít originál
</Anchor>
```

`target="_blank"` otevře v nové záložce, `rel="noreferrer"` k tomu patří
z bezpečnostních důvodů.

```tsx
<Spoiler maxHeight={80} showLabel="zobrazit celé" hideLabel="skrýt">
  {kniha.textUkazky}
</Spoiler>
```

`Accordion` je alternativa, když chceš, aby bylo zavřené všechno a otevíralo se
po jednom. Pro úkol M (graf u každé události) se hodí spíš `Accordion`.

### MÁŠ NA VÝBĚR

- `Spoiler` nebo `Accordion`
- jak vysoko `maxHeight`
- jestli odkaz bude text, ikonka, nebo celý titulek klikací

### MUSÍ PLATIT

- u každé události vede odkaz na původní článek, otevírá se v nové záložce
- původní text je dostupný, ale nezabírá půl obrazovky

Odkaz na originál dokládá, že si systém nic nevymýšlí.

---

## Úkol G — co model hledal (jen agentní režim)

### CO SE UČÍŠ

`dotazy_modelu` je v typu s otazníkem, takže **nemusí existovat**. Sáhnout na
něj přímo proto nejde. Dvě možnosti:

```tsx
{vysledek.dotazy_modelu && <ul>…</ul>}
```

```ts
const dotazy = vysledek.dotazy_modelu ?? []
```

`??` znamená „když je vlevo `null` nebo `undefined`, vezmi to vpravo". Pak už
můžeš `dotazy.map(...)` bez podmínky, protože prázdné pole se vykreslí jako nic.

Pozor na rozdíl proti `||`: `||` by nahradil i prázdný text nebo nulu. `??`
reaguje jen na `null` a `undefined`.

### MÁŠ NA VÝBĚR

- `List`, `Table`, nebo `Timeline` — ta poslední hezky ukáže, že dotazy šly po
  sobě
- jestli ukážeš i `nalezeno` (kolik událostí dotaz našel)
- jestli sekci schováš, nebo napíšeš, že v prostém režimu model dotazy netvoří

### MUSÍ PLATIT

- v agentním režimu jsou dotazy vidět
- v prostém režimu se nic nerozbije

Tohle je nejsilnější prvek pro obhajobu — ukazuje, že si model dotazy formuluje
sám a zobecňuje událost.

---

## Úkol H — varování a tabulka srovnání

### CO SE UČÍŠ

Varování je jen podmíněné vykreslování:

```tsx
{!vysledek.je_zprava && <Alert color="yellow">…</Alert>}
```

Vykřičník obrací platnost: „když to NENÍ zpráva".

Tabulka z pole se skládá z podčástí:

```tsx
<Table>
  <Table.Thead>
    <Table.Tr><Table.Th>Metoda</Table.Th><Table.Th>Macro-F1</Table.Th></Table.Tr>
  </Table.Thead>
  <Table.Tbody>
    {radky.map((r) => (
      <Table.Tr key={r.metoda}>
        <Table.Td>{r.metoda}</Table.Td>
        <Table.Td>{r.f1.toFixed(3)}</Table.Td>
      </Table.Tr>
    ))}
  </Table.Tbody>
</Table>
```

`Table.Thead` znamená, že `Thead` je součástí `Table` — importuješ jen `Table`.

### MÁŠ NA VÝBĚR

Čísla jsou v `..\DATASET\dataset_v5\baseline_validation.json`, měřená na **110
validačních záznamech**:

| metoda | macro-F1 | přesnost |
|---|---:|---:|
| náhoda (průměr ze 100 běhů) | 0,326 | |
| MACD | 0,324 | 32,7 % |
| market-only lineární | 0,286 | |
| RSI 30/70 | 0,224 | 28,2 % |
| majorita | 0,161 | 31,8 % |

- opsat čísla do kódu, nebo JSON naimportovat (`import data from '...json'`
  funguje, `resolveJsonModule` je zapnuté)
- tabulku ukázat vždy, nebo až po rozkliknutí
- doplnit sloupec s vysvětlením, co která metoda je

**Uveď, na kolika záznamech se měřilo.** Bez toho číslo klame: 110 vzorků je
málo a rozdíly mezi metodami jsou v mezích náhody.

### MUSÍ PLATIT

- tabulka je v rozhraní a čísla sedí na `baseline_validation.json`
- je u ní uvedeno, co se měřilo a na kolika záznamech

Tenhle úkol plní **bod 5 zadání**.

---

# ČÁST 2 — backend, Python

Bez těchhle tří věcí nejdou postavit grafy ani průběh. Píšeš je v Pythonu ve
složce `MANUÁLNÍ`. Ke každému dostaneš podrobnější vedení, až se k němu
dostaneš — tady je jen rozsah, ať víš, co tě čeká.

## Úkol I — stažení článku z odkazu

Nový endpoint, který dostane URL, stáhne stránku, vytáhne z ní text a vrátí ho.

Kód na extrakci už máš: `main_text` a `clean_html`
v `IMPLEMENTACE/dataset_v4/collect_candidates.py`. Nepiš to znovu, přenes to.

Rozhodnutí, které tě čeká: vrátit jen text a nechat uživatele potvrdit, nebo
rovnou předpovědět. Doporučuju první — uvidíš, jestli se extrakce povedla.

## Úkol J — očekávaný rozsah pohybu

Rozhodl ses, že model má vracet i rozsah, ne jen třídu. To znamená:

1. upravit prompt, aby model vracel i číslo
2. rozšířit parsování v `spolecne.py` — dnes `preved_na_tridu` hledá jen slovo
3. přidat pole do odpovědi API a do typu `Odpoved`

**Dvě věci, na které si dej pozor.** Model dnes na třídě dosahuje macro-F1 kolem
0,3, tedy sotva nad náhodou. Rozsah bude nutně ještě méně spolehlivý, protože je
to těžší úloha. V rozhraní i v práci to musí být popsané jako odhad modelu, ne
jako předpověď ceny.

Levnější alternativa, kdyby se to nedařilo: rozsah nespočítat modelem, ale
z mediánu skutečných pohybů u nalezených podobných událostí. Je to poctivé,
vysvětlitelné a nevyžaduje změnu promptu.

## Úkol K — cenová okna kolem událostí

Aby šly kreslit svíčky, potřebuješ pro každou událost v databázi okno
minutových svíček, řekněme −30 až +90 minut kolem publikace.

1. jednorázový skript, který z `G:\LLM\btc-project\data\market\binance_btcusdt_1m_2017_2026.csv.gz`
   vyřízne okno kolem každé události a uloží ho
2. endpoint `GET /candles/{id}`, který okno vrátí

Ten minutový soubor má stovky megabajtů a **nesmí se otevírat při každém
dotazu**, jinak se rozhraní zasekne. Předpočítaná okna zaberou jednotky
megabajtů.

Pro graf u predikce potřebuješ i okno kolem **aktuálního** času, tedy čerstvá
data z Binance.

## Úkol L — streamování průběhu

Aby se kroky odškrtávaly doopravdy, musí backend posílat postup průběžně.
Slouží k tomu Server-Sent Events: jedno spojení, do kterého server píše zprávy,
jak práce postupuje.

FastAPI to umí přes `StreamingResponse`. Endpoint pošle po každé fázi řádek
typu `data: {"faze": "hledam_v_databazi"}`.

Na straně prohlížeče se to čte třídou `EventSource`.

Rozhodni se, jaké fáze budeš hlásit. Nabízí se: přijato → zestručňuji článek →
hledám v databázi → ptám se modelu → hotovo. V agentním režimu navíc formulace
dotazů.

---

# ČÁST 3 — grafy a průběh, po dokončení části 2

## Úkol M — svíčkový graf u historické události

### CO SE UČÍŠ

Tohle je první místo, kde React nestačí sám. `lightweight-charts` si kreslí do
vlastního prvku a potřebuje na něj přímý odkaz. K tomu slouží dva nové háčky.

**`useRef`** drží odkaz na prvek v DOM. Na rozdíl od `useState` jeho změna
nezpůsobí překreslení:

```tsx
const misto = useRef<HTMLDivElement>(null)

return <div ref={misto} />
```

`misto.current` je pak ten skutečný `<div>` v prohlížeči, nebo `null`, dokud se
nevykreslí.

**`useEffect`** spustí kód **po** vykreslení. Používá se přesně na tohle —
napojení knihovny, která není z Reactu:

```tsx
useEffect(() => {
  // tady se něco nastaví
  return () => {
    // úklid, když komponenta mizí
  }
}, [zavislosti])
```

To pole na konci říká, kdy se má efekt spustit znovu. Prázdné `[]` znamená
jednou při vzniku komponenty. Když tam dáš proměnnou, spustí se při každé její
změně.

Ta vrácená funkce je úklid. U grafu je povinná — bez `chart.remove()` zůstane
graf v paměti a po pár rozkliknutích se stránka zpomalí.

**Graf v5** (verze se od starších návodů na internetu liší, dej si pozor):

```tsx
import { createChart, CandlestickSeries, createSeriesMarkers } from 'lightweight-charts'

useEffect(() => {
  if (misto.current === null) return

  const graf = createChart(misto.current, { height: 220 })
  const rada = graf.addSeries(CandlestickSeries, {})
  rada.setData(svicky)   // [{ time, open, high, low, close }, ...]

  createSeriesMarkers(rada, [
    { time: casUdalosti, position: 'aboveBar', shape: 'arrowDown', text: 'zpráva' },
  ])

  graf.timeScale().fitContent()

  return () => graf.remove()
}, [svicky])
```

`time` očekává čas v sekundách od roku 1970, ne ISO text. Převod:

```ts
Math.floor(new Date('2022-04-01T18:12:00Z').getTime() / 1000)
```

`getTime()` vrací milisekundy, proto dělení tisícem.

### MÁŠ NA VÝBĚR

- **jak vyznačit okamžik události.** Značka (`createSeriesMarkers`) je nejsnazší
  a je součástí knihovny. Skutečnou svislou čáru přes celý graf umí až oficiální
  plugin `vertical-line`, který se musí doinstalovat. Začni značkou.
- **kdy graf načíst** — hned u všech událostí, nebo až při rozkliknutí. Doporučuju
  až při rozkliknutí, jinak posíláš osm požadavků naráz.
- **velikost okna** — kolik minut před a po
- **jestli přidat vodorovnou čáru s cenou v okamžiku publikace** —
  `rada.createPriceLine({ price, title: 'cena při publikaci' })`

### MUSÍ PLATIT

- graf jde otevřít u každé nalezené události
- okamžik zprávy je v grafu jednoznačně vidět
- při zavření se graf uklidí (`graf.remove()` ve funkci úklidu)
- zavření a otevření dvaceti grafů za sebou stránku nezpomalí

---

## Úkol N — graf predikce s očekávaným rozsahem

### CO SE UČÍŠ

Stejná technika jako v úkolu M. Navíc vodorovné cenové linky, které vyznačí
rozsah:

```tsx
rada.createPriceLine({
  price: horniOkraj,
  color: 'green',
  lineStyle: 2,          // 2 = čárkovaná
  title: 'horní odhad',
})
```

### MÁŠ NA VÝBĚR

- **jak rozsah zobrazit** — dvě čárkované linky, nebo podbarvená oblast
- **jestli podbarvit i 30minutové okno** po publikaci barvou třídy
- **jak odlišit odhad od skutečnosti** — čárkovaně, průhledněji, jinou barvou

### MUSÍ PLATIT

- z grafu je na první pohled jasné, co je skutečná cena a co odhad modelu
- **u grafu je napsáno, že jde o odhad modelu, ne o předpověď ceny**

Ten poslední bod není kosmetika. Model má na třídě macro-F1 kolem 0,3, tedy
sotva nad náhodou, a rozsah bude ještě méně spolehlivý. Graf, který vypadá jako
předpověď ceny, tvrdí mnohem víc, než systém umí — a u obhajoby je to první
otázka, která přijde.

---

## Úkol O — živý průběh zpracování

### CO SE UČÍŠ

Kroky ukážeš jako seznam a streamování je odškrtává, jak se doopravdy dějí.

Napojení na SSE z úkolu L:

```tsx
useEffect(() => {
  const zdroj = new EventSource('http://localhost:8000/predict/stream?...')

  zdroj.onmessage = (zprava) => {
    const data = JSON.parse(zprava.data)
    setFaze(data.faze)
  }

  return () => zdroj.close()
}, [/* kdy začít */])
```

Zase `useEffect` s úklidem — bez `zdroj.close()` zůstane spojení otevřené.

Na zobrazení se hodí Mantine `Timeline` s propem `active`, nebo `Stepper`:

```tsx
<Timeline active={cisloFaze}>
  <Timeline.Item title="Zestručňuji článek" />
  <Timeline.Item title="Hledám v databázi" />
  <Timeline.Item title="Ptám se modelu" />
</Timeline>
```

Hotové kroky se vykreslí jinak než ty budoucí. `active` je index, takže si
potřebuješ převést název fáze na číslo.

### MÁŠ NA VÝBĚR

- `Timeline` (svisle, s čárou) nebo `Stepper` (vodorovně)
- jestli u hotových kroků ukážeš, jak dlouho trvaly. Zestručnění trvá kolem
  šesti sekund, což je poctivá informace.
- jestli seznam kroků ukážeš i před spuštěním — uživatel pak dopředu vidí, co
  systém dělá

### MUSÍ PLATIT

- odškrtnutý krok znamená, že opravdu proběhl, ne že uplynul čas
- když streamování selže, rozhraní se přepne na obyčejné kolečko a dokončí to
- žádná falešná procenta

---

# Na co narazíš u všech úkolů

**Backend musí běžet:**

```
cd "C:\Users\Andreas\Documents\Bakalářská práce\MANUÁLNÍ"
uvicorn api:app
```

**Vite musí jet na portu 5173**, jinak volání zablokuje prohlížeč kvůli CORS.

**Netestuj na článcích z let 2024 a 2025.** Jsou v databázi a systém si najde
sám sebe s podobností kolem 1,0. Bude to vypadat skvěle a nebude to pravda.
Používej rok 2026 nebo čerstvé zprávy.

**Po každém úkolu spusť** `npm run typecheck` a `npx eslint src`.

**Návody na `lightweight-charts` z internetu jsou často pro verzi 4.** Ty máš 5,
kde se `addCandlestickSeries` změnilo na `addSeries(CandlestickSeries, ...)`
a značky se přidávají funkcí `createSeriesMarkers`. Když ti návod nefunguje,
zkontroluj nejdřív verzi.

# Pořadí

Část 1 celá, protože z ní hned něco máš. Pak úkol K (cenová okna), protože
odemkne graf u historických událostí — a to je ta nejnázornější věc v celém
rozhraní. Pak M. Teprve potom I, J, L a N, O.

Kdyby došel čas, části 1 samotná splňuje **bod 6 zadání**.
