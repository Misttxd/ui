# Úkoly: od cvičení ke skutečné aplikaci

Cvičení máš hotová. Tenhle dokument staví rozhraní podle tvojí představy
a je jediný závazný popis toho, co má rozhraní obsahovat.

Každý úkol má tři části:

- **CO SE UČÍŠ** — technika a její zápis, rovnou na tvojí aplikaci
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

**Soubor:** všechny — tenhle úkol je o tom je založit

### CO SE UČÍŠ

Zatím máš všechno v jednom souboru. Každá komponenta patří do vlastního, jinak
se v tom nedá hledat a při chybě nevíš kam kouknout.

```tsx
// src/components/Predikce.tsx
export default function Predikce() {
  return <h2>Výsledek</h2>
}
```

```tsx
import Predikce from './components/Predikce'
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

Jedno možné rozdělení, ať máš od čeho se odrazit. Není závazné, uprav si ho:

```
src/
  App.tsx                  drží stav, volá backend, skládá stránku
  api.ts                   volání backendu a typy (máš)
  format.ts                formátování data a čísel (úkol E)

  components/
    VstupClanku.tsx        textarea nebo odkaz, přepínač režimu, tlačítko
    Prubeh.tsx             seznam kroků zpracování, Timeline nebo Stepper
    Predikce.tsx           třída, badge, rozsah, jádro dotazu, varování
    DotazyModelu.tsx       co model hledal, jen agentní režim
    SeznamUdalosti.tsx     projde pole `podobne` a vykreslí Udalost
    Udalost.tsx            jedna karta nalezené události
    Graf.tsx               svíčkový graf
    Srovnani.tsx           tabulka baseline
```

`Graf.tsx` napiš obecně — dostane svíčky a volitelně značku a cenové linky
propem. Použiješ ho pak na dvou místech: u historické události (úkol M)
i u predikce (úkol N).

Který úkol se kterého souboru týká:

| soubor | úkol |
|---|---|
| `VstupClanku.tsx` | B, C |
| `Udalost.tsx`, `SeznamUdalosti.tsx` | D, E, F |
| `DotazyModelu.tsx` | G |
| `Predikce.tsx` | H (varování), J (rozsah) |
| `Srovnani.tsx` | H (tabulka) |
| `Graf.tsx` | M, N |
| `Prubeh.tsx` | O |

Rozmysli si taky, kdo drží stav. Zatím `Cviceni2`, nově nejspíš `App.tsx` nebo
komponenta, kterou `App` vykreslí.

### MUSÍ PLATIT

- `App.tsx` vykresluje skutečnou aplikaci, ne cvičení
- žádný soubor nad zhruba 150 řádků
- `npm run typecheck` i `npx eslint src` projdou

---

## Úkol B — vstup: text nebo odkaz

**Soubor:** `src/components/VstupClanku.tsx`

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

**Soubor:** `src/components/VstupClanku.tsx` a `src/api.ts`

### CO SE UČÍŠ

Backend má dva endpointy: `/predict` a `/predict/agent`. Zatím voláš jen první.

Funkce `predikuj` dostane druhý parametr. Parametry se oddělují čárkou:

```ts
export async function predikuj(text: string, rezim: 'prosty' | 'agentni'): Promise<Odpoved> {
  const adresa =
    rezim === 'agentni'
      ? 'http://localhost:8000/predict/agent'
      : 'http://localhost:8000/predict'
  // zbytek funkce zůstává, jak ho máš
}
```

Adresu můžeš složit i vložením proměnné do textu pomocí zpětných apostrofů:

```ts
const adresa = `http://localhost:8000/predict${rezim === 'agentni' ? '/agent' : ''}`
```

Tomu se říká šablonový řetězec: co je v `${}`, se dosadí jako hodnota.

Přepínač je řízená komponenta jako `<Textarea>`:

```tsx
const [rezim, setRezim] = useState('prosty')

<SegmentedControl
  value={rezim}
  onChange={setRezim}
  data={[
    { label: 'Klasický RAG', value: 'prosty' },
    { label: 'Agentní RAG', value: 'agentni' },
  ]}
/>
```

`data` je pole možností: `label` uvidí uživatel, `value` se uloží do stavu.

### MÁŠ NA VÝBĚR

- `SegmentedControl`, `Switch`, nebo `Radio.Group` — liší se jen vzhledem
- popisky: rozhodl ses pro „klasický RAG" a „agentní RAG". Zvaž k nim
  vysvětlivku v `Tooltip`, co je mezi nimi za rozdíl.
- jestli přepínač během načítání zakázat

### JAK VYPADAJÍ TY ALTERNATIVY

**`Switch`** je přepínač zapnuto/vypnuto, takže drží `true`/`false`, ne text:

```tsx
const [agentni, setAgentni] = useState(false)

<Switch
  checked={agentni}
  onChange={(e) => setAgentni(e.currentTarget.checked)}
  label="Agentní RAG"
/>
```

Všimni si `checked` místo `value` a `e.currentTarget.checked` místo
`e.target.value`. Do `predikuj` pak pošleš `agentni ? 'agentni' : 'prosty'`.

**`Radio.Group`** vypadá jako klasické přepínače s kolečky:

```tsx
<Radio.Group value={rezim} onChange={setRezim} label="Režim">
  <Stack gap="xs">
    <Radio value="prosty" label="Klasický RAG" />
    <Radio value="agentni" label="Agentní RAG" />
  </Stack>
</Radio.Group>
```

Importuješ jen `Radio`, `Radio.Group` je jeho součást. Hodí se, když chceš
ke každé možnosti delší popisek.

**`Tooltip`** je bublina, která vyskočí při najetí myší. Obalí se jím cokoliv:

```tsx
<Tooltip label="Agentní režim si sám formuluje víc dotazů a trvá déle">
  <Text size="sm" c="dimmed">co to znamená?</Text>
</Tooltip>
```

### MUSÍ PLATIT

- oba režimy volají různé endpointy
- v odpovědi je vidět `rezim`
- přepnutí nesmaže rozepsaný text

---

## Úkol D — karta události a její metriky

**Soubor:** `src/components/Udalost.tsx` a `SeznamUdalosti.tsx`

### CO SE UČÍŠ

Zatím jsi propem posílal text, číslo a funkci. Stejně se dá poslat **celý
objekt**:

```tsx
import type { Udalost } from '../api'

type UdalostKartaProps = {
  udalost: Udalost
}

export default function UdalostKarta({ udalost }: UdalostKartaProps) {
  return (
    <Card withBorder padding="md">
      <Text fw={700}>{udalost.titulek}</Text>
      <Text size="sm" c="dimmed">{udalost.zdroj}</Text>
      <Text size="sm">{udalost.jadro}</Text>
    </Card>
  )
}
```

Použití a v cyklu:

```tsx
<UdalostKarta udalost={jednaUdalost} />
{vysledek.podobne.map((u) => <UdalostKarta key={u.url} udalost={u} />)}
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

### JAK VYPADAJÍ TY ALTERNATIVY

**`Paper`** je jen plocha s pozadím, bez oddílů:

```tsx
<Paper withBorder p="md" radius="md">
  …obsah…
</Paper>
```

**`RingProgress`** ukáže číslo jako kroužek:

```tsx
<RingProgress
  size={80}
  thickness={8}
  sections={[{ value: udalost.podobnost * 100, color: 'blue' }]}
  label={<Text ta="center" size="xs">{(udalost.podobnost * 100).toFixed(0)}%</Text>}
/>
```

`sections` je pole, protože kroužek umí víc barevných výsečí. Tobě stačí jedna.

**`Group`** dá prvky vedle sebe, `justify` je rozmístí:

```tsx
<Group justify="space-between">
  <Text fw={700}>{udalost.titulek}</Text>
  <Badge color="green">{udalost.label}</Badge>
</Group>
```

`space-between` odtlačí prvky k okrajům, takže titulek bude vlevo a štítek
vpravo. Další hodnoty jsou `center`, `flex-start`, `flex-end`.

### MUSÍ PLATIT

- karta bere jednu událost propem a nesahá na nic vnějšího
- každá karta má `key`
- prázdné pole `podobne` rozhraní nerozbije

---

## Úkol E — formátování data a čísel

**Soubor:** `src/format.ts`, používá se v `Udalost.tsx`

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

**Soubor:** `src/components/Udalost.tsx`

### CO SE UČÍŠ

```tsx
<Anchor href={udalost.url} target="_blank" rel="noreferrer">
  otevřít originál
</Anchor>
```

`target="_blank"` otevře v nové záložce, `rel="noreferrer"` k tomu patří
z bezpečnostních důvodů.

```tsx
<Spoiler maxHeight={80} showLabel="zobrazit celé" hideLabel="skrýt">
  {udalost.obsah}
</Spoiler>
```

`Accordion` je alternativa, když chceš, aby bylo zavřené všechno a otevíralo se
po jednom. Pro úkol M (graf u každé události) se hodí spíš `Accordion`.

### MÁŠ NA VÝBĚR

- `Spoiler` nebo `Accordion`
- jak vysoko `maxHeight`
- jestli odkaz bude text, ikonka, nebo celý titulek klikací

### JAK VYPADÁ TA ALTERNATIVA

**`Accordion`** je skládací seznam. Na rozdíl od `Spoiler` se otevírá celá
položka, a hodí se proto pro graf z úkolu M:

```tsx
<Accordion>
  <Accordion.Item value={udalost.url}>
    <Accordion.Control>{udalost.titulek}</Accordion.Control>
    <Accordion.Panel>
      …původní text, graf, cokoliv…
    </Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

`value` musí být u každé položky jiné — podle něj `Accordion` pozná, která je
otevřená. Použij stejný klíč jako u `key`.

Když chceš vědět, která položka je zrovna otevřená (třeba abys graf načetl až
po rozkliknutí), přidej stav:

```tsx
const [otevrena, setOtevrena] = useState<string | null>(null)

<Accordion value={otevrena} onChange={setOtevrena}>
```

### MUSÍ PLATIT

- u každé události vede odkaz na původní článek, otevírá se v nové záložce
- původní text je dostupný, ale nezabírá půl obrazovky

Odkaz na originál dokládá, že si systém nic nevymýšlí.

---

## Úkol G — co model hledal (jen agentní režim)

**Soubor:** `src/components/DotazyModelu.tsx`

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

### JAK VYPADAJÍ TY ALTERNATIVY

**`List`** je obyčejný seznam s odrážkami:

```tsx
<List>
  {dotazy.map((d) => (
    <List.Item key={d.dotaz}>{d.dotaz} — nalezeno {d.nalezeno}</List.Item>
  ))}
</List>
```

**`Timeline`** ukáže, že dotazy šly po sobě. Tady chceš mít odškrtnuté všechny,
takže `active` nastav na počet položek:

```tsx
<Timeline active={dotazy.length} bulletSize={18} lineWidth={2}>
  {dotazy.map((d) => (
    <Timeline.Item key={d.dotaz} title={d.dotaz}>
      <Text size="xs" c="dimmed">nalezeno {d.nalezeno} událostí</Text>
    </Timeline.Item>
  ))}
</Timeline>
```

`Timeline.Item` má `title` jako prop a zbytek jako obsah mezi značkami.

### MUSÍ PLATIT

- v agentním režimu jsou dotazy vidět
- v prostém režimu se nic nerozbije

Tohle je nejsilnější prvek pro obhajobu — ukazuje, že si model dotazy formuluje
sám a zobecňuje událost.

---

## Úkol H — varování a tabulka srovnání

**Soubor:** varování `Predikce.tsx`, tabulka `Srovnani.tsx`

### CO SE UČÍŠ

Varování je jen podmíněné vykreslování:

```tsx
{!vysledek.je_zprava && <Alert color="yellow">…</Alert>}
```

Vykřičník obrací platnost: „když to NENÍ zpráva".

Tabulka z pole se skládá z podčástí:

```tsx
const BASELINE = [
  { metoda: 'náhoda (100 běhů)', f1: 0.326 },
  { metoda: 'MACD', f1: 0.324 },
  { metoda: 'market-only lineární', f1: 0.286 },
  { metoda: 'RSI 30/70', f1: 0.224 },
  { metoda: 'majorita', f1: 0.161 },
]

<Table>
  <Table.Thead>
    <Table.Tr><Table.Th>Metoda</Table.Th><Table.Th>Macro-F1</Table.Th></Table.Tr>
  </Table.Thead>
  <Table.Tbody>
    {BASELINE.map((r) => (
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

Tyhle čtyři úkoly píšeš v Pythonu ve složce `MANUÁLNÍ`. Bez nich nejdou postavit
grafy ani živý průběh.

Python znáš méně než React, takže tu platí totéž: syntaxe napřed na cizím
příkladu, pak zadání.

Spuštění backendu po každé změně:

```
cd "C:\Users\Andreas\Documents\Bakalářská práce\MANUÁLNÍ"
uvicorn api:app --reload
```

`--reload` znamená, že se server po uložení souboru restartuje sám.

---

## Úkol I — stažení článku z odkazu

**Soubor:** `MANUÁLNÍ/api.py`

### CO SE UČÍŠ

**Nový endpoint.** Endpoint je funkce s dekorátorem. Dekorátor je ten řádek se
zavináčem nad funkcí; říká FastAPI „tuhle funkci zavolej, když přijde takový
požadavek":

```python
class Odkaz(BaseModel):
    url: str

@app.post("/nacti_clanek")
def nacti_clanek(vstup: Odkaz):
    stranka = fetch(vstup.url, CACHE)
    return {"text": main_text(stranka)}
```

`BaseModel` popisuje, co v požadavku přijde — je to obdoba `type` v TypeScriptu.
FastAPI podle něj vstup zkontroluje a sám vrátí chybu, když nesedí.

Vrácený slovník se automaticky převede na JSON.

**Import z jiné složky.** Extrakci textu už máš napsanou v
`IMPLEMENTACE/dataset_v4/collect_candidates.py` — funkce `fetch`, `main_text`
a `clean_html`. Jsou v jiném stromu, takže cesta se musí přidat ručně:

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "IMPLEMENTACE" / "dataset_v4"))
from collect_candidates import main_text, clean_html
```

`Path(__file__)` je cesta k tomuhle souboru, `.parents[1]` o dvě úrovně výš.

Druhá možnost je ty tři funkce prostě zkopírovat do nového souboru v `MANUÁLNÍ`.
U bakalářky je to obhajitelné — `MANUÁLNÍ` je pak samostatná větev, která na nic
jiného nespoléhá.

**Chyby.** Když se stránka nestáhne, endpoint má vrátit srozumitelnou chybu, ne
spadnout:

```python
from fastapi import HTTPException

raise HTTPException(status_code=400, detail="Stránku se nepodařilo stáhnout")
```

Ten `detail` dorazí do frontendu a můžeš ho ukázat v `Alert`.

### MÁŠ NA VÝBĚR

- **vrátit jen text, nebo rovnou předpovědět.** Doporučuju první: uživatel uvidí,
  co se stáhlo, a může to opravit. Extrakce z libovolného webu se nepovede vždy.
- **jestli vracet i titulek a datum publikace** — `meta()` z téhož souboru je umí
  vytáhnout z HTML
- **jak dlouhý text propustit** — velmi krátký výsledek většinou znamená, že se
  extrakce nepovedla; můžeš to rovnou odmítnout

### MUSÍ PLATIT

- endpoint přijme URL a vrátí text článku
- nefunkční nebo nesmyslná adresa vrátí čitelnou chybu, ne pád serveru
- CORS na `http://localhost:5173` platí i pro nový endpoint (je nastavený pro
  celou aplikaci v `api.py`, takže nic dělat nemusíš — jen to ověř)

---

## Úkol J — očekávaný rozsah pohybu

**Soubor:** `MANUÁLNÍ/api.py`, `spolecne.py` a `src/api.ts`

### CO SE UČÍŠ

Model dnes vrací jedno slovo. `preved_na_tridu` v `spolecne.py` z odpovědi
vytáhne `down`, `neutral` nebo `up` a nic víc.

Chceš k tomu číslo. Nejjistější cesta je nechat model odpovědět **strukturovaně**
a pak to rozparsovat.

**Hledání čísla v textu.** Regulární výraz najde v odpovědi číslo:

```python
import re

nalezeno = re.search(r"-?\d+[.,]?\d*", odpoved)
if nalezeno:
    cislo = float(nalezeno.group().replace(",", "."))
else:
    cislo = None
```

`r"..."` je surový řetězec, aby se zpětná lomítka nebrala jako escapy.
`-?` znamená volitelné minus, `\d+` jednu a víc číslic, `[.,]?` volitelnou
desetinnou čárku nebo tečku. `.group()` vrátí nalezený text.

**Bezpečnější varianta: ptát se na JSON.** Když prompt řekne „odpověz jedním JSON
objektem", dá se odpověď načíst rovnou:

```python
import json

zacatek = odpoved.find("{")
konec = odpoved.rfind("}")
data = json.loads(odpoved[zacatek : konec + 1])
```

Krájení `odpoved[zacatek : konec + 1]` vyřízne část textu od pozice do pozice.
Model totiž často okolo JSONu něco připíše.

Obal to do `try/except`, protože model občas vrátí nesmysl:

```python
try:
    data = json.loads(...)
except json.JSONDecodeError:
    data = None
```

**Přidání pole do odpovědi.** V `api.py` v návratovém slovníku prostě přibude
další klíč. Nezapomeň ho pak doplnit i do typu `Odpoved` v `src/api.ts`, jinak
o něm frontend nebude vědět.

### MÁŠ NA VÝBĚR

Máš dvě cesty, jak rozsah získat, a nemusíš si vybrat napořád:

1. **z modelu** — upravíš prompt, model vrátí i číslo. Věrnější tvému zadání.
2. **z historie** — spočítáš ho z `zmena_pct` nalezených podobných událostí.
   Nevyžaduje sahat na prompt a číslo je vždycky rozumné.

U druhé cesty se hodí medián, protože jedna extrémní událost neposune výsledek:

```python
import statistics

hodnoty = [u["zmena_pct"] for u in podobne]
stred = statistics.median(hodnoty)
```

Ten zápis v hranatých závorkách je *list comprehension* — z každého prvku `u`
vezme jednu položku a poskládá nový seznam.

- jestli vrátíš jedno číslo, nebo dvojici dolní a horní mez
- jestli číslo bude v procentech, nebo rovnou v dolarech (frontend má cenu
  v okamžiku publikace z úkolu K, takže si to přepočítat umí)

### MUSÍ PLATIT

- odpověď API obsahuje nové pole a typ `Odpoved` v `src/api.ts` o něm ví
- když se číslo nepodaří získat, pole je `null` a nic nespadne
- frontend `null` snese

Ať zvolíš cokoliv, u grafu musí být napsané, že jde o odhad. To je jediná věta,
kterou u obhajoby budeš potřebovat.

---

## Úkol K — cenová okna kolem událostí

**Soubor:** nový skript v `MANUÁLNÍ/` a `api.py`

Tenhle úkol dělej hned po části 1. Odemkne graf u historických událostí, což je
nejnázornější věc v celém rozhraní.

### CO SE UČÍŠ

**Čtení komprimovaného CSV.** Soubor
`G:\LLM\btc-project\data\market\binance_btcusdt_1m_2017_2026.csv.gz`
má stovky megabajtů. Otevírá se jako obyčejný textový soubor, jen přes `gzip`:

```python
import csv
import gzip

with gzip.open(cesta, "rt", encoding="utf-8") as soubor:
    for radek in csv.DictReader(soubor):
        print(radek["open"])
```

`"rt"` znamená čtení v textovém režimu. `DictReader` udělá z každého řádku
slovník, kde klíče jsou názvy sloupců z první řádky.

Nejdřív si vypiš první řádek a podívej se, jak se sloupce jmenují — nehádej to.

**Čas.** Binance ukládá čas obvykle jako milisekundy od roku 1970. Převod:

```python
from datetime import datetime, timezone

cas = datetime.fromtimestamp(int(radek["open_time"]) / 1000, tz=timezone.utc)
```

A opačně, protože `lightweight-charts` chce sekundy:

```python
sekundy = int(cas.timestamp())
```

**Okno kolem události.** `timedelta` je rozdíl dvou časů:

```python
from datetime import timedelta

zacatek = udalost_cas - timedelta(minutes=30)
konec = udalost_cas + timedelta(minutes=90)

if zacatek <= cas <= konec:
    ...
```

**Uložení.** Pro každou událost jeden malý soubor, pojmenovaný podle jejího id:

```python
import json

with open(f"candles/{id_udalosti}.json", "w", encoding="utf-8") as soubor:
    json.dump(svicky, soubor)
```

`f"..."` je f-řetězec: co je ve složených závorkách, se dosadí. Je to obdoba
`${}` v JavaScriptu.

**Endpoint, který soubor vrátí.** Hodnota z cesty se zapíše do složených závorek
a jako parametr funkce:

```python
@app.get("/candles/{id_udalosti}")
def candles(id_udalosti: str):
    cesta = Path("candles") / f"{id_udalosti}.json"
    if not cesta.is_file():
        raise HTTPException(status_code=404, detail="Okno není předpočítané")
    return json.loads(cesta.read_text(encoding="utf-8"))
```

### MÁŠ NA VÝBĚR

- **velikost okna.** −30/+90 minut je rozumný začátek. Míň je nepřehledné, víc
  zbytečně velké.
- **kde soubory budou.** Do gitu nepatří, tak si na ně přidej řádek
  do `.gitignore`, nebo je dej rovnou na `G:`.
- **jestli k oknu přiložíš i cenu v okamžiku publikace.** Doporučuju ano —
  frontend z ní umí spočítat rozsah v dolarech.
- **jak události identifikovat.** Pole `podobne` z API dnes žádné `id` neposílá,
  takže si budeš muset vybrat klíč. `url` je jednoznačná, ale jako součást
  adresy endpointu se musí zakódovat. Jednodušší je přidat do odpovědi API
  krátké `id` a používat to.

**Ten velký soubor se nesmí otevírat při každém dotazu.** Projdi ho jednou
skriptem, ulož okna, a endpoint už jen čte malé soubory. Jinak se rozhraní
při každém rozkliknutí na dlouho zasekne.

### MUSÍ PLATIT

- skript proběhne jednou a vytvoří okna pro všechny události v databázi
- `GET /candles/<id>` vrátí okno do jedné vteřiny
- neexistující id vrátí 404, ne pád
- svíčky mají `time` v sekundách, ne v milisekundách ani jako text

---

## Úkol L — streamování průběhu

**Soubor:** `MANUÁLNÍ/api.py`

### CO SE UČÍŠ

**Generátor.** Obyčejná funkce spočítá všechno a vrátí to naráz. Generátor
používá `yield` a vydává hodnoty postupně, jak vznikají:

```python
def pocitej():
    yield "začínám"
    vysledek = neco_dlouheho()
    yield "hotovo"
```

Volající dostane hodnotu hned, jak ji generátor vydá — nečeká na konec.

**StreamingResponse.** FastAPI umí takový generátor poslat po síti:

```python
from fastapi.responses import StreamingResponse

@app.get("/predict/stream/{id_ulohy}")
def predict_stream(id_ulohy: str):
    def kroky():
        text = ulohy[id_ulohy]
        yield 'data: {"faze": "zestrucnuji"}\n\n'
        vstup = priprav_vstup(text)
        yield 'data: {"faze": "hledam"}\n\n'
        podobne = hledej(vstup["core"])
        yield 'data: {"faze": "ptam_se"}\n\n'
        # ... zavolání modelu ...
        yield 'data: {"faze": "hotovo"}\n\n'
    return StreamingResponse(kroky(), media_type="text/event-stream")
```

`priprav_vstup` a `hledej` už v `api.py` máš, jen je teď voláš postupně
a mezi nimi hlásíš, kde jsi.

Formát Server-Sent Events je prostý: každá zpráva začíná `data: ` a končí
**dvěma** znaky nového řádku. Ty dva jsou povinné, jedním to nefunguje.

**Návrhový problém, který musíš vyřešit.** `EventSource` v prohlížeči umí jen
GET a neumí posílat tělo požadavku. Tvůj `/predict` je POST s článkem v těle.
Máš tři možnosti:

1. **Dvoufázově.** POST `/predict/start` uloží článek do slovníku v paměti
   a vrátí `{"id": "..."}`. Frontend pak otevře `EventSource` na
   `/predict/stream/{id}`. Nejčistší, ale je to dva endpointy a úložiště úloh.
2. **Článek v adrese.** Text se pošle jako parametr GET. Funguje jen pro krátké
   texty — adresa má omezenou délku, takže na článek to nestačí. Nedoporučuju.
3. **Bez EventSource.** Zůstane POST a proud se čte ručně přes `fetch`. Vyžaduje
   víc kódu na straně Reactu, ale žádný nový endpoint.

Doporučuju první. Slovník úloh může být obyčejná proměnná v `api.py`:

```python
ulohy: dict[str, str] = {}
```

Je to v paměti, takže se to při restartu ztratí — pro bakalářskou práci to stačí
a v textu se to popíše jednou větou.

### MÁŠ NA VÝBĚR

- kterou ze tří cest zvolíš
- **jaké fáze hlásit.** Nabízí se: přijato → zestručňuji článek → hledám
  v databázi → ptám se modelu → hotovo. V agentním režimu navíc formulace dotazů,
  a těch je několik po sobě.
- jestli spolu s fází posílat i mezivýsledek, například jádro dotazu hned po
  zestručnění. Uživatel pak vidí něco užitečného dřív.
- jestli poslední zpráva ponese rovnou celou odpověď, nebo si ji frontend
  vyzvedne zvlášť

### MUSÍ PLATIT

- fáze dorazí do prohlížeče **v okamžiku, kdy nastanou**, ne všechny naráz na
  konci
- když spojení spadne, server to přežije
- původní `/predict` funguje dál beze změny, ať se máš kam vrátit

Ověření: otevři adresu streamu přímo v prohlížeči a dívej se, jestli řádky
přibývají postupně. Když naskočí všechny naráz, něco výstup bufferuje.

---

# ČÁST 3 — grafy a průběh, po dokončení části 2

## Úkol M — svíčkový graf u historické události

**Soubor:** `src/components/Graf.tsx`, používá se v `Udalost.tsx`

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
napojení knihovny, která není z Reactu, nebo načtení dat:

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

Ta vrácená funkce je úklid. U grafu je povinná — bez `graf.remove()` zůstane
graf v paměti a po pár rozkliknutích se stránka zpomalí.

**Načtení dat z backendu uvnitř efektu.** Tohle je ta pracnější polovina.
`useEffect` nesmí být `async`, takže se async funkce napíše dovnitř a hned
zavolá:

```tsx
const [svicky, setSvicky] = useState<Svicka[] | null>(null)

useEffect(() => {
  let zruseno = false

  async function nacti() {
    const odpoved = await fetch(`http://localhost:8000/candles/${id}`)
    const data = await odpoved.json()
    if (!zruseno) setSvicky(data)
  }
  nacti()

  return () => { zruseno = true }
}, [id])
```

Ta proměnná `zruseno` řeší situaci, kdy uživatel kartu zavře dřív, než data
dorazí. Bez ní by se `setSvicky` zavolalo na komponentě, která už neexistuje.

Na typ `Svicka` si napiš vlastní type se čtyřmi čísly a časem, stejně jako
`Udalost` v úkolu 7.

**Graf, verze 5** (návody na internetu jsou často pro 4, dej si pozor):

```tsx
import { createChart, CandlestickSeries, createSeriesMarkers } from 'lightweight-charts'

useEffect(() => {
  if (misto.current === null || svicky === null) return

  const graf = createChart(misto.current, { height: 220 })
  const rada = graf.addSeries(CandlestickSeries, {})
  rada.setData(svicky)

  createSeriesMarkers(rada, [
    { time: casUdalosti, position: 'aboveBar', shape: 'arrowDown', text: 'zpráva' },
  ])

  graf.timeScale().fitContent()

  return () => graf.remove()
}, [svicky])
```

Všimni si, že to jsou **dva samostatné efekty**: jeden načte data, druhý kreslí.
Druhý má `svicky` v závislostech, takže se spustí, jakmile data dorazí.

`time` chce sekundy od roku 1970, ne ISO text:

```ts
Math.floor(new Date('2022-04-01T18:12:00Z').getTime() / 1000)
```

`getTime()` vrací milisekundy, proto dělení tisícem.

### MÁŠ NA VÝBĚR

- **jak vyznačit okamžik události.** Značka (`createSeriesMarkers`) je nejsnazší
  a je součástí knihovny. Skutečnou svislou čáru přes celý graf umí až oficiální
  plugin `vertical-line`, který se musí doinstalovat. Začni značkou.
- **kdy graf načíst** — hned u všech událostí, nebo až při rozkliknutí.
  Doporučuju až při rozkliknutí, jinak posíláš osm požadavků naráz. `Accordion`
  z úkolu F se na to hodí.
- **co ukázat, než data dorazí** — `Skeleton` nebo `Loader` z Mantine
- **jestli přidat vodorovnou čáru s cenou v okamžiku publikace** —
  `rada.createPriceLine({ price, title: 'cena při publikaci' })`

### JAK VYPADÁ TO ČEKÁNÍ NA DATA

**`Skeleton`** je šedý obdélník na místě, kde teprve něco bude. Je klidnější
než točící se kolečko, protože se stránka neposkakuje:

```tsx
{svicky === null ? <Skeleton height={220} /> : <div ref={misto} />}
```

**`Loader`** je kolečko, když ti stačí prostě naznačit, že se pracuje:

```tsx
<Loader size="sm" />
```

### MUSÍ PLATIT

- graf jde otevřít u každé nalezené události
- okamžik zprávy je v grafu jednoznačně vidět
- při zavření se graf uklidí
- zavření a otevření dvaceti grafů za sebou stránku nezpomalí

---

## Úkol N — graf predikce s očekávaným rozsahem

**Soubor:** `src/components/Graf.tsx` a `Predikce.tsx`

### CO SE UČÍŠ

Stejná technika jako v úkolu M. Rozdíl je v tom, odkud vezmeš svíčky: u historické
události je okno předpočítané, tady potřebuješ **aktuální** cenu.

Dvě možnosti:

1. **Nový endpoint na backendu**, který si stáhne posledních pár hodin z Binance
   a vrátí je. Binance má veřejné API bez klíče:
   `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=120`
2. **Volat Binance přímo z prohlížeče.** Funguje, ale zamotává to architekturu —
   frontend by pak mluvil se dvěma různými servery.

Doporučuju první, aby všechno šlo přes tvůj backend.

Vodorovné cenové linky vyznačí rozsah:

```tsx
rada.createPriceLine({
  price: horniOkraj,
  color: 'green',
  lineStyle: 2,          // 2 = čárkovaná
  title: 'horní odhad',
})
```

Rozsah přijde z úkolu J v procentech, takže se přepočítá na cenu:

```ts
const horniOkraj = cenaTed * (1 + rozsah / 100)
```

### MÁŠ NA VÝBĚR

- **jak rozsah zobrazit** — dvě čárkované linky, nebo podbarvená oblast
- **jestli podbarvit 30minutové okno** po publikaci barvou třídy
- **jak odlišit odhad od skutečnosti** — čárkovaně, průhledněji, jinou barvou
- **jak často aktualizovat** — jednou při zobrazení stačí

### MUSÍ PLATIT

- z grafu je na první pohled jasné, co je skutečná cena a co odhad
- u grafu je napsáno, že jde o odhad modelu

---

## Úkol O — živý průběh zpracování

**Soubor:** `src/components/Prubeh.tsx` a `App.tsx`

### CO SE UČÍŠ

Kroky ukážeš jako seznam a streamování je odškrtává, jak se doopravdy dějí.

**Napojení na stream z úkolu L**, dvoufázovou cestou:

```tsx
useEffect(() => {
  if (idUlohy === null) return

  const zdroj = new EventSource(`http://localhost:8000/predict/stream/${idUlohy}`)

  zdroj.onmessage = (zprava) => {
    const data = JSON.parse(zprava.data)
    setFaze(data.faze)
  }

  zdroj.onerror = () => zdroj.close()

  return () => zdroj.close()
}, [idUlohy])
```

Nejdřív tedy pošleš POST, dostaneš `id`, uložíš ho do stavu — a tenhle efekt se
díky závislosti `[idUlohy]` sám spustí.

Bez `zdroj.close()` zůstane spojení otevřené i po dokončení.

**Převod názvu fáze na číslo.** Mantine `Timeline` chce index, ne text. Uděláš si
seznam fází v pořadí a najdeš pozici:

```tsx
const FAZE = ['prijato', 'zestrucnuji', 'hledam', 'ptam_se', 'hotovo']

const cislo = FAZE.indexOf(faze)
```

`indexOf` vrátí pozici prvku v poli, nebo `-1`, když tam není.

```tsx
<Timeline active={cislo}>
  <Timeline.Item title="Zestručňuji článek" />
  <Timeline.Item title="Hledám v databázi" />
  <Timeline.Item title="Ptám se modelu" />
</Timeline>
```

Hotové kroky se vykreslí jinak než ty budoucí.

### MÁŠ NA VÝBĚR

- `Timeline` (svisle, s čárou) nebo `Stepper` (vodorovně)
- jestli u hotových kroků ukážeš, jak dlouho trvaly. Zestručnění trvá kolem
  šesti sekund, což je poctivá informace. Čas si změříš `Date.now()` při každé
  změně fáze.
- jestli seznam kroků ukážeš i před spuštěním — uživatel pak dopředu vidí, co
  systém dělá
- jestli v agentním režimu ukážeš každý dotaz zvlášť, jak vzniká

### JAK VYPADÁ TA ALTERNATIVA

**`Stepper`** je totéž co `Timeline`, jen vodorovně a s čísly kroků:

```tsx
<Stepper active={cislo} size="sm">
  <Stepper.Step label="Zestručňuji" />
  <Stepper.Step label="Hledám v databázi" />
  <Stepper.Step label="Ptám se modelu" />
</Stepper>
```

`active` funguje stejně jako u `Timeline` — je to index, ne název fáze.

Vodorovný `Stepper` se hodí, když máš málo kroků a chceš šetřit výšku.
`Timeline` je lepší, když chceš u každého kroku napsat víc, třeba jak dlouho
trval.

### MUSÍ PLATIT

- odškrtnutý krok znamená, že opravdu proběhl, ne že uplynul čas
- když streamování selže, rozhraní se přepne na obyčejné kolečko a dokončí to
- žádná falešná procenta

---

# Na co narazíš u všech úkolů

**Backend musí běžet:**

```
cd "C:\Users\Andreas\Documents\Bakalářská práce\MANUÁLNÍ"
uvicorn api:app --reload
```

**Vite musí jet na portu 5173**, jinak volání zablokuje prohlížeč kvůli CORS.

**Netestuj na článcích z let 2024 a 2025.** Jsou v databázi a systém si najde
sám sebe s podobností kolem 1,0. Používej rok 2026 nebo čerstvé zprávy.

**Po každém úkolu spusť** `npm run typecheck` a `npx eslint src`.

**Návody na `lightweight-charts` z internetu jsou často pro verzi 4.** Ty máš 5,
kde se `addCandlestickSeries` změnilo na `addSeries(CandlestickSeries, ...)`
a značky se přidávají funkcí `createSeriesMarkers`. Když ti návod nefunguje,
zkontroluj nejdřív verzi.

**Nové pole v odpovědi backendu přidej vždycky na dvou místech** — do `api.py`
a do typu `Odpoved` v `src/api.ts`. TypeScript ti nepřipomene, že jsi na druhé
zapomněl, protože o skutečném backendu nic neví.

# Pořadí

Část 1 celá, protože z ní hned něco máš. Pak úkol **K** (cenová okna), protože
odemkne graf u historických událostí — a to je ta nejnázornější věc v celém
rozhraní. Pak **M**. Teprve potom I, J, L a nakonec N s O.

Kdyby došel čas, část 1 samotná splňuje **bod 6 zadání**.
