import { Button } from '@mantine/core'
import { useState } from 'react'
// ŠKOLA REACTU + TYPESCRIPTU — druhá sada, úkoly 6 až 12
//
// První sada byla o syntaxi. Tahle je o mechanikách, které skutečně potřebuje
// tvoje aplikace: popsat data z backendu, poslat informaci z komponenty ven,
// sdílet stav mezi komponentami, počkat na odpověď ze sítě a ošetřit, když se
// něco nepovede.
//
// Každý úkol má tři části:
//   CO SE UČÍŠ     vysvětlení principu na cizím příkladu
//   ZADÁNÍ         co máš napsat
//   NA CO NARAZÍŠ  chyby, do kterých se tu obvykle spadne
//
// Příklady jsou schválně z jiného světa (knihy, auta, barvy), aby se nedaly
// jen opsat.
//
// Kontrola typů:  npm run typecheck   (nech běžet v druhém okně terminálu)


// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL 6 (znovu) — vykreslení seznamu
// ═══════════════════════════════════════════════════════════════════════════
//
// CO SE UČÍŠ
//
// React neumí vykreslit pole dat přímo. Pole musíš nejdřív převést na pole JSX
// a k tomu slouží metoda .map(). Ta vezme pole, na každý prvek zavolá tvoji
// funkci a vrátí nové pole z návratových hodnot.
//
// Bez Reactu, čistý JavaScript:
//
//   const cisla = [1, 2, 3]
//   const dvojnasobky = cisla.map((c) => c * 2)      // [2, 4, 6]
//
// Uvnitř té funkce může být cokoliv, tedy i JSX:
//
//   const auta = [{ spz: '1AB 2345', znacka: 'Škoda' }]
//   auta.map((auto) => <li key={auto.spz}>{auto.znacka}</li>)
//
// Atribut `key` je povinný. React podle něj pozná, který řádek je který, když
// se pole změní. Musí být unikátní mezi sourozenci a stálý v čase — proto se
// bere id z dat, ne pořadové číslo.
//
// ZADÁNÍ
//
// 1. Popiš typem, jak vypadá jedna nalezená historická událost. Tvar si vezmi
//    z FRONTEND.md ze sekce „Co backend posílá", pole `podobne`. Zatím ti stačí
//    čtyři položky: titulek, datum, label a podobnost. U každé se rozmysli,
//    jestli je to text, číslo, nebo jedna ze tří pevně daných hodnot.
// 2. Vytvoř konstantu s polem dvou nebo tří takových událostí. Data si vymysli.
// 3. Vytvoř komponentu SeznamUdalosti, která to pole vykreslí — u každé
//    události titulek, datum a label.
//
// NA CO NARAZÍŠ
//
// • Typ pole se zapisuje hranatými závorkami za typem prvku.
// • .map() vrací pole, takže ho do JSX vkládáš ve složených závorkách.
// • Když zapomeneš `key`, aplikace pojede, ale konzole prohlížeče (F12) ti
//   vynadá. Zkus to schválně a přečti si tu hlášku, ať ji poznáš.

type Udalost = {
  titulek: string
  datum: string          // JSON umí jen text, na Date se převádí až při zobrazení
  label: 'up' | 'down' | 'neutral'
  zmena_pct: number
  podobnost: number
  jadro: string
  zdroj: string
  url: string
  obsah: string
}

const vymyslenaUdalost: Udalost[] = [
  {
    titulek: 'SEC Rejects Spot Bitcoin ETF Application From Ark',
    datum: '2022-04-01T18:12:00Z',
    label: 'up',
    zmena_pct: 0.22,
    podobnost: 0.644,
    jadro: 'The SEC rejected Ark 21Shares application...',
    zdroj: 'CoinDesk',
    url: 'https://www.coindesk.com/priklad-1',
    obsah: 'prvních 2000 znaků originálu',
  },
  {
    titulek: 'Japanese Crypto Exchange Suffers Hack',
    datum: '2022-04-01T18:12:00Z',
    label: 'down',
    zmena_pct: -0.41,
    podobnost: 0.67,
    jadro: 'The exchange halted withdrawals after losing...',
    zdroj: 'CoinDesk',
    url: 'https://www.coindesk.com/priklad-2',
    obsah: 'prvních 2000 znaků originálu',
  },
]

function SeznamUdalosti() {
  // key je url: dvě události mohou vyjít ve stejnou vteřinu, takže datum
  // unikátní být nemusí. Pole `podobne` žádné id neposílá.
  const listItems = vymyslenaUdalost.map((udalost) => (
    <li key={udalost.url}>
      {udalost.titulek} {udalost.label} {udalost.podobnost}
    </li>
  ))
  return (
    <ul>
      {listItems}
    </ul>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL 7 — popis celé odpovědi z backendu
// ═══════════════════════════════════════════════════════════════════════════
//
// CO SE UČÍŠ
//
// Typy se skládají do sebe. Když má objekt uvnitř další objekt nebo pole
// objektů, popíšeš nejdřív ten vnitřní a pak ho použiješ jako typ položky:
//
//   type Autor = {
//     jmeno: string
//     rokNarozeni: number
//   }
//
//   type Kniha = {
//     nazev: string
//     autor: Autor            // vnořený objekt
//     kapitoly: string[]      // pole textů
//     isbn: string | null     // buď text, nebo nic
//     poznamka?: string       // nepovinné, nemusí tam být vůbec
//   }
//
// Rozdíl mezi `| null` a `?` je podstatný:
//   • `isbn: string | null` — položka tam VŽDY je, ale může mít hodnotu null
//   • `poznamka?: string`   — položka tam být vůbec nemusí
//
// ZADÁNÍ
//
// Otevři si FRONTEND.md a podle ukázky JSON popiš typem celou odpověď backendu.
// Pojmenuj ho třeba Odpoved. Zahrň rezim, predikce, jadro_dotazu, je_zprava,
// dotazy_modelu a podobne.
//
// U každé položky se rozhodni:
//   • jakého je typu,
//   • jestli může být null — v FRONTEND.md je k tomu poznámka v sekci
//     „Na co narazíš", přečti si ji,
//   • jestli tam vždycky je. Pozor, `dotazy_modelu` posílá jen jeden ze dvou
//     endpointů. Který z těch dvou zápisů výše se na to hodí?
//
// `dotazy_modelu` je pole objektů, takže na jeho prvek potřebuješ vlastní typ.
// `podobne` použije typ události z úkolu 6 — doplň si do něj i zbylé položky,
// které backend posílá.
//
// NA CO NARAZÍŠ
//
// • Názvy položek musí přesně sedět na to, co posílá backend, včetně
//   podtržítek. Když napíšeš jadroDotazu, TypeScript nic nenamítne, ale data
//   budou `undefined`. Typ je jen tvoje tvrzení o datech; nikdo ho proti
//   skutečnému backendu nekontroluje.
// • `rezim` má jen dvě možné hodnoty. Vypiš je obě, ať se překlep chytne.

type Dotaz = {
  dotaz: string
  nalezeno: number
}

type Odpoved = {
  rezim: 'agentni_rag' | 'prosty_rag'
  predikce: 'up' | 'down' | 'neutral' | null
  surova_odpoved: string
  jadro_dotazu: string
  je_zprava: boolean
  dotazy_modelu?: Dotaz[]   // otazník: posílá jen agentní endpoint
  podobne: Udalost[]        // stejný typ jako v úkolu 6, jen doplněný
}
// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL 8 — funkce jako prop
// ═══════════════════════════════════════════════════════════════════════════
//
// CO SE UČÍŠ
//
// Props posílají data shora dolů, z rodiče do potomka. Co ale když potomek
// potřebuje dát vědět nahoru, že se něco stalo?
//
// Pošle se mu funkce. Už víš, že funkce je hodnota jako každá jiná, takže se dá
// předat propem stejně jako text nebo číslo.
//
//   type VyberBarvyProps = {
//     onVyber: (barva: string) => void
//   }
//
// Ten zápis se čte „funkce, která bere text a nic nevrací". `void` znamená
// žádnou návratovou hodnotu.
//
//   function VyberBarvy({ onVyber }: VyberBarvyProps) {
//     return <button onClick={() => onVyber('modrá')}>modrá</button>
//   }
//
// Potomek neví a nemá vědět, co se s tou barvou stane. Jen zavolá funkci,
// kterou dostal. Rozhodnutí zůstává na rodiči, protože ten tu funkci napsal.
//
// Předpona `on` je konvence pro props, které jsou funkce reagující na událost.
//
// ZADÁNÍ
//
// Vytvoř komponentu VstupClanku, která má:
//   • vlastní stav na text v <textarea> (to umíš z úkolu 4),
//   • tlačítko Předpovědět,
//   • prop `onOdeslat`, což je funkce beroucí text a nic nevracející.
//
// Po kliknutí na tlačítko zavolá `onOdeslat` a předá mu aktuální text.
//
// Vyzkoušej ji tak, že jí předáš funkci, která ten text vypíše do konzole.
//
// NA CO NARAZÍŠ
//
// • Nezaměň popis typu za zavolání. V typu píšeš, co funkce bere a vrací;
//   v těle komponenty ji pak voláš normálně se závorkami.
// • V onClick zase potřebuješ šipkovou funkci, ne přímé zavolání.
// • Tlačítko by nemělo jít zmáčknout, když je pole prázdné. Atribut `disabled`
//   bere true/false, takže mu můžeš rovnou předat výsledek porovnání.

type vstupClankuProps = {
  onOdeslat: (text:string) => void
}

function VstupClanku({onOdeslat}: vstupClankuProps){
  const [text, setText] = useState("")

  return (
    <div>
      <textarea value = {text} onChange={(e) => setText(e.target.value)}></textarea>
      <Button disabled = {text == ''} onClick={()=> onOdeslat(text)}>Předpovědět</Button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL 9 — zvedání stavu (lifting state up)
// ═══════════════════════════════════════════════════════════════════════════
//
// PROČ
//
// VstupClanku umí posbírat text a zavolat `onOdeslat`. Ale nikdo jí zatím
// žádné `onOdeslat` nepředal, takže je k ničemu. Teď ji zapojíš.
//
// ─── SYNTAXE, KTEROU BUDEŠ POTŘEBOVAT ───────────────────────────────────────
//
// 1) Fragment: prázdná dvojice značek <> </>
//
// Komponenta smí vrátit jen JEDEN kořenový prvek. Když chceš vrátit dva vedle
// sebe, musíš je něčím obalit. <div> by přidal do stránky zbytečný prvek,
// takže se používá prázdná dvojice — ta se do stránky nevykreslí:
//
//   return (
//     <>
//       <h1>Nadpis</h1>
//       <p>Odstavec</p>
//     </>
//   )
//
// 2) Předání set funkce jako propu
//
// `setNeco` z useState je obyčejná funkce. Když komponenta čeká prop typu
// „funkce beroucí text", můžeš jí `setNeco` předat přímo:
//
//   const [barva, setBarva] = useState('')
//   <VyberBarvy onVyber={setBarva} />
//
// Žádná šipka tam není. Šipku píšeš jen tam, kde funkci VOLÁŠ (onClick), ne
// tam, kde ji PŘEDÁVÁŠ. Tady předáváš.
//
// Kdybys chtěl při odeslání udělat víc věcí, napíšeš vlastní funkci:
//
//   <VyberBarvy onVyber={(b) => { setBarva(b); console.log(b) }} />
//
// Středník mezi příkazy je potřeba, protože jsou na jednom řádku.
//
// ─── ZADÁNÍ ─────────────────────────────────────────────────────────────────
//
// Uprav komponentu Cviceni2 na konci souboru:
//
//   a) přidej do ní stav `odeslany` typu string, počáteční hodnota ''
//   b) vykresli v ní <VstupClanku /> a předej jí prop `onOdeslat`
//   c) pod ní vypiš obsah `odeslany`
//
// Ověření: napiš do pole text, klikni na Předpovědět, text se objeví pod
// formulářem. Když pak píšeš dál bez kliknutí, vypsaný text se nemění.
//
// ─── NA CO NARAZÍŠ ──────────────────────────────────────────────────────────
//
// • Máš teď dva různé stavy a to je záměr. `text` uvnitř VstupClanku se mění
//   při každém písmenu; `odeslany` v Cviceni2 se mění jen při kliknutí.
// • Cviceni2 už jeden kořenový <div> má, takže fragment tu nutně nepotřebuješ.
//   Ukázal jsem ti ho, protože ho uvidíš všude.








// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL 10 — čekání na odpověď (async / await)
// ═══════════════════════════════════════════════════════════════════════════
//
// PROČ
//
// Volání backendu potrvá 6 až 25 sekund. Za tu dobu musí rozhraní dát najevo,
// že pracuje. Nejdřív si to nacvičíš na falešné funkci, bez sítě.
//
// ─── SYNTAXE, KTEROU BUDEŠ POTŘEBOVAT ───────────────────────────────────────
//
// 1) Promise, async, await
//
// Některé funkce nevrátí výsledek hned. Místo něj vrátí Promise — příslib, že
// hodnota dorazí později. Slovo `await` znamená „počkej na ni":
//
//   async function nactiKnihu() {
//     const kniha = await najdiVKnihovne('Máj')   // tady se čeká
//     console.log(kniha.nazev)                    // až potom tenhle řádek
//   }
//
// Pravidlo: `await` smíš napsat jen uvnitř funkce označené `async`.
//
// 2) Čekací funkce
//
// Tuhle ti dám hotovou, protože ten zápis se odvodit nedá:
//
//   const pockej = (ms: number) =>
//     new Promise((hotovo) => setTimeout(hotovo, ms))
//
// Používá se pak takhle:  await pockej(2000)
//
// 3) Funkce, která něco vrátí až po chvíli
//
//   async function nactiJmeno(): Promise<string> {
//     await pockej(2000)
//     return 'Andreas'
//   }
//
// Návratový typ `async` funkce je vždy Promise<něco>. Vevnitř píšeš `return`
// normálně, obalení do Promise udělá `async` samo.
//
// 4) Stav, který na začátku nic neobsahuje
//
// Tohle už jsi viděl v první sadě, ale je to tu klíčové. Když stav začíná
// na null, TypeScript si z null typ neodvodí a musíš mu ho dodat:
//
//   const [kniha, setKniha] = useState<Kniha | null>(null)
//
// Ty špičaté závorky říkají „tenhle stav bude Kniha, nebo nic".
//
// 5) Přepínač true/false
//
//   const [nacita, setNacita] = useState(false)
//
// Tady špičaté závorky nepotřebuješ, `false` typ prozradí.
//
// 6) try / catch / finally
//
//   try {
//     // co se má stát
//   } catch (chyba) {
//     // co dělat, když to spadne
//   } finally {
//     // provede se vždycky, i po chybě
//   }
//
// 7) async funkce jako prop
//
// Když má obsluha uvnitř čekat, musí být `async`:
//
//   <VyberBarvy onVyber={async (b) => {
//     setNacita(true)
//     await pockej(1000)
//     setNacita(false)
//   }} />
//
// ─── ZADÁNÍ ─────────────────────────────────────────────────────────────────
//
//   a) opiš si funkci `pockej` z bodu 2 do souboru
//   b) napiš `async` funkci `predikujNaoko`, která počká dvě sekundy a pak
//      vrátí vymyšlený objekt typu Odpoved (ten máš z úkolu 7)
//   c) do Cviceni2 přidej dva stavy: `nacita` (začíná na false) a `vysledek`
//      (začíná na null, typ Odpoved nebo null)
//   d) prop `onOdeslat` uprav tak, aby: nastavil `nacita` na true, počkal na
//      `predikujNaoko`, výsledek uložil do `vysledek`, a v bloku `finally`
//      vrátil `nacita` na false
//   e) když `nacita` platí, zobraz místo výsledku text „počítám…"
//   f) když je `vysledek` k dispozici, vypiš z něj `predikce` a `jadro_dotazu`
//
// Ověření: klikneš, dvě sekundy se ukazuje „počítám…", pak naskočí výsledek.
//
// ─── NA CO NARAZÍŠ ──────────────────────────────────────────────────────────
//
// • `nacita` vracej na false ve `finally`, ne až za voláním. Kdyby nastala
//   chyba, zůstalo by rozhraní navždy v načítacím stavu.
// • V bodě f) tě TypeScript nepustí napsat rovnou `vysledek.predikce`, protože
//   `vysledek` může být null. Řešení je v úkolu 11, bod 4 — přečti si ho.
// • `predikujNaoko` musí vrátit objekt se VŠEMI položkami typu Odpoved, jinak
//   si TypeScript postěžuje. Nepovinné (`dotazy_modelu?`) vynechat můžeš.


  const pockej = (ms: number) => new Promise((hotovo) => setTimeout(hotovo, ms))

  async function predikujNaoko() : Promise<Odpoved> {
    await pockej (2000)
    return {
      rezim: 'prosty_rag',
      predikce: 'up' ,
      surova_odpoved: "pero",
      jadro_dotazu: "pero",
      je_zprava: true, //neivm jak to ma vypadat pro boolean, 1 mi taky nefungovalo
      podobne: vymyslenaUdalost  //tady nevim co dat
    }
  }

export default function Cviceni2() {
  const [odeslany, setOdeslany] = useState("")

  const [nacita, setNacita] = useState(false)
  const [vysledek, setVysledek] = useState<Odpoved | null>(null)

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Druhá sada</h1>

      <SeznamUdalosti></SeznamUdalosti>
      <VstupClanku onOdeslat = {async (text) => {
        setOdeslany(text)
        setNacita(true)
        try {
          setVysledek(await predikujNaoko())
        }
        finally{
          setNacita(false)
        }
      }}></VstupClanku>
      {
        nacita && <p>počítám</p>
      }
      {
        vysledek ? <p>{vysledek.predikce} {vysledek.jadro_dotazu}</p> : <p></p>
      }
      <>
        <p>
          {odeslany}
        </p>
      </>   

    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL 11 — skutečné volání backendu
// ═══════════════════════════════════════════════════════════════════════════
//
// PROČ
//
// Teď falešnou funkci vyměníš za skutečný dotaz na backend a ošetříš, že se
// spojení nemusí povést.
//
// ─── SYNTAXE, KTEROU BUDEŠ POTŘEBOVAT ───────────────────────────────────────
//
// 1) Vlastní soubor a pojmenovaný export
//
// Zatím máš všechno v jednom souboru. Teď vytvoříš `src/api.ts`. Věci, které
// z něj chceš používat jinde, označíš slovem `export`:
//
//   // src/pozdravy.ts
//   export type Osoba = { jmeno: string }
//   export function pozdrav(o: Osoba) { return 'Ahoj ' + o.jmeno }
//
// A jinde je naimportuješ ve složených závorkách:
//
//   import { pozdrav } from './pozdravy'
//   import type { Osoba } from './pozdravy'
//
// Rozdíl proti `export default` z úkolu 0: default je jeden na soubor a jméno
// si volíš při importu. Pojmenovaných může být víc a jména musí sedět.
// U typů se píše `import type`, protože typ v přeloženém kódu neexistuje.
//
// 2) Dotaz na server
//
//   const odpoved = await fetch('http://localhost:8000/predict', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ text: text }),
//   })
//
// `JSON.stringify` převede objekt na text, protože po síti se posílá text.
//
// 3) Kontrola a přečtení odpovědi
//
//   if (!odpoved.ok) {
//     throw new Error('Server odpověděl chybou ' + odpoved.status)
//   }
//   const data = (await odpoved.json()) as Odpoved
//
// Vykřičník `!` před hodnotou znamená „obrať platnost": `!true` je `false`.
// Takže `!odpoved.ok` znamená „když odpověď NENÍ v pořádku".
//
// `throw` vyhodí chybu, kterou pak chytí `catch`.
//
// `as Odpoved` je tvrzení „věř mi, tenhle JSON má tenhle tvar". `fetch` totiž
// vrací neznámá data a TypeScript je ověřit neumí — proto je důležité, aby typ
// z úkolu 7 seděl na skutečný backend.
//
// POZOR: `fetch` sám chybu vyhodí jen tehdy, když se vůbec nespojí. Když server
// odpoví chybovým kódem 500, `fetch` to za chybu nepovažuje. Proto ta kontrola
// `odpoved.ok`.
//
// 4) Práce s hodnotou, která může být null
//
// TypeScript nedovolí sáhnout na položku něčeho, co může být null:
//
//   const kniha: Kniha | null = najdi()
//   kniha.nazev                     // CHYBA
//
//   if (kniha !== null) {
//     kniha.nazev                   // uvnitř téhle větve je to jistě Kniha
//   }
//
// Uvnitř podmínky TypeScript ví, že null to být nemůže. V JSX se to píše
// stejným způsobem jako podmíněné vykreslování z první sady:
//
//   {kniha !== null && <p>{kniha.nazev}</p>}
//
// 5) Text chyby v catch
//
// V TypeScriptu má chycená chyba typ `unknown`, protože vyhodit se dá cokoliv.
// Na `chyba.message` proto sáhnout nemůžeš. Text z ní dostaneš takhle:
//
//   catch (chyba) {
//     setChyba(chyba instanceof Error ? chyba.message : 'Neznámá chyba')
//   }
//
// `instanceof Error` ověří, že je to skutečně chyba, a teprve pak je `.message`
// dostupné.
//
// ─── ZADÁNÍ ─────────────────────────────────────────────────────────────────
//
//   a) vytvoř soubor `src/api.ts`
//   b) přesuň do něj typy Udalost, Dotaz a Odpoved a přidej k nim `export`
//   c) napiš tam `export async function predikuj(text: string): Promise<Odpoved>`
//      podle bodů 2 a 3
//   d) v tomhle souboru typy smaž a naimportuj je z api.ts
//   e) v Cviceni2 nahraď `predikujNaoko` voláním `predikuj`
//   f) přidej stav `chyba` typu string nebo null, začíná na null
//   g) v `catch` do něj ulož text chyby podle bodu 5, v `try` ho na začátku
//      nastav zpátky na null
//   h) zobraz čtyři různé situace:
//        • nic se ještě neodeslalo → „Vlož článek a klikni na Předpovědět."
//        • nacita → „počítám…"
//        • chyba není null → vypiš ji a dodej, že nejspíš neběží backend
//          nebo Ollama
//        • vysledek není null → vypiš predikci a jádro dotazu
//   i) když je `vysledek.predikce` null, napiš, že model neodpověděl
//      použitelnou třídou
//
// Ověření: se spuštěným backendem dostaneš predikci. Když backend vypneš,
// uvidíš chybovou hlášku místo prázdné stránky.
//
// ─── NA CO NARAZÍŠ ──────────────────────────────────────────────────────────
//
// • Backend musí běžet: `uvicorn api:app` ve složce MANUÁLNÍ.
// • Vite musí jet na portu 5173, jinak prohlížeč volání zablokuje kvůli CORS.
//   Backend má povolený jen tenhle port, viz `allow_origins` v `api.py`.
// • Netestuj na článcích z let 2024 a 2025. Jsou v databázi, systém si najde
//   sám sebe s podobností kolem 1,0 a bude to vypadat mnohem líp, než to je.
//   Použij rok 2026 nebo čerstvou zprávu.
// • Když TypeScript hlásí, že hodnota může být null, neobcházej to vykřičníkem
//   za hodnotou. Napiš podmínku podle bodu 4 — tady ta hodnota opravdu chybět
//   může, na rozdíl od `root` v main.tsx.


// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL 12 — hotové komponenty z Mantine
// ═══════════════════════════════════════════════════════════════════════════
//
// PROČ
//
// Zatím máš holé HTML. Mantine dá rozhraní vzhled bez psaní CSS.
//
// ─── SYNTAXE, KTEROU BUDEŠ POTŘEBOVAT ───────────────────────────────────────
//
// Předpoklad: musíš mít hotový úkol 0b v main.tsx. Bez něj se komponenty
// vykreslí bez stylů a budeš chybu hledat jinde.
//
//   import { Container, Stack, Textarea, Button, Loader, Alert, Badge } from '@mantine/core'
//
// Jednotlivé komponenty a jejich propy:
//
//   <Container size="sm">…</Container>
//        omezí šířku obsahu, ať text není přes celý monitor
//
//   <Stack gap="md">…</Stack>
//        naskládá prvky pod sebe s mezerami
//
//   <Group>…</Group>
//        totéž, ale vedle sebe
//
//   <Textarea
//     value={text}
//     onChange={(e) => setText(e.target.value)}
//     label="Text článku"
//     placeholder="Vlož článek…"
//     autosize
//     minRows={6}
//   />
//        `autosize` bez hodnoty znamená true — to je zkratka pro autosize={true}
//
//   <Button onClick={…} loading={nacita} disabled={text === ''}>Předpovědět</Button>
//        `loading` sám zobrazí kolečko a tlačítko zablokuje
//
//   <Loader />
//        samostatné načítací kolečko
//
//   <Alert color="red" title="Chyba">text chyby</Alert>
//        barevný rámeček na upozornění
//
//   <Badge color="green" size="lg">UP</Badge>
//        barevný štítek; `color` bere 'red', 'gray', 'green', 'teal' a další
//
// Jaké má komponenta další propy zjistíš tak, že v editoru najedeš myší na její
// název — TypeScript ti je vypíše i s typy. Nebo na mantine.dev.
//
// ─── ZADÁNÍ ─────────────────────────────────────────────────────────────────
//
//   a) obal obsah Cviceni2 do <Container> a <Stack>
//   b) vyměň <textarea> ve VstupClanku za <Textarea> s popiskem a placeholderem
//   c) tlačítku předej `loading={nacita}` — `nacita` bude muset přijít propem
//      z Cviceni2, protože stav je tam
//   d) chybovou hlášku zobraz v <Alert color="red">
//   e) výslednou třídu zobraz v <Badge> s barvou podle predikce:
//        down → 'red', neutral → 'gray', up → 'green'
//   f) doplň k výsledku větu, že jde o experimentální výstup, který zatím
//      nepřekonává jednoduché baseline
//
// Bod f) není kosmetika. Bez něj rozhraní tvrdí víc, než systém umí, a u
// obhajoby je to otázka.
//
// ─── NA CO NARAZÍŠ ──────────────────────────────────────────────────────────
//
// • V bodě c) přibude VstupClanku druhý prop. Rozšiř jí typ o `nacita: boolean`
//   a vytáhni si ho v hlavičce vedle `onOdeslat`.
// • Barvu podle predikce nevymýšlej podmínkami v JSX. Udělej si nad komponentou
//   objekt, který třídu na barvu převede, a ten pak použij:
//        const barvy = { down: 'red', neutral: 'gray', up: 'green' }
//        barvy['up']   →   'green'
// • Nepoužívej `recharts` ani `motion`. Jsou nainstalované, ale nepotřebuješ je
//   a u obhajoby bys musel vysvětlit proč tam jsou.



