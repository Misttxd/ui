import { useState } from 'react'

// ŠKOLA REACTU + TYPESCRIPTU — úkoly 1 až 6
//
// Cvičiště. Do finální aplikace se z tohohle souboru nic nepřenáší.
//
// Spuštění:  npm run dev          (v adresáři MANUÁLNÍ/ui)
// Kontrola typů:  npm run typecheck   (běží průběžně, druhé okno terminálu)
//
// ───────────────────────────────────────────────────────────────────────────
// CO PŘIDÁVÁ TYPESCRIPT
//
// TypeScript je JavaScript, do kterého se dopisuje, jakého typu je která
// hodnota. Za dvojtečku se píše typ:
//
//   const jmeno: string = 'Andreas'
//   const pocet: number = 0
//   const bezi: boolean = false
//   const slova: string[] = ['a', 'b']          pole řetězců
//   const nebo: string | null = null            buď řetězec, nebo null
//
// Většinu času typ psát NEMUSÍŠ — TypeScript si ho domyslí sám:
//   const pocet = 0        ← ví, že je to number
//
// Psát ho musíš tam, kde se to domyslet nedá: parametry funkcí a props.
// Prohlížeč o typech nic neví, při sestavení se zahodí. Jsou jen pro tebe
// a pro editor.
//
// ───────────────────────────────────────────────────────────────────────────
// CO JE KOMPONENTA
//
// Obyčejná funkce, která vrací HTML. To HTML uvnitř kódu se jmenuje JSX.
// Funkce musí začínat VELKÝM písmenem — podle toho React pozná komponentu.
//
//   function Pozdrav() {
//     return <p>Ahoj</p>
//   }
//
// Pravidla JSX, na kterých se člověk nejčastěji seká:
//   • vracet se smí jen JEDEN kořenový prvek; když potřebuješ víc, obal je <> </>
//   • místo class= se píše className=
//   • JavaScript se dovnitř vkládá složenými závorkami: <p>{promenna}</p>
//   • každá značka musí být uzavřená, i <br /> a <img />
// ───────────────────────────────────────────────────────────────────────────

// ÚKOL 1 — první komponenta
//
// Pod tímhle komentářem vytvoř funkci Pozdrav, která vrátí <h2> s libovolným
// textem. Zatím žádné parametry, takže zatím žádné typy.
//
// Až ji budeš mít, přidej ji do JSX komponenty Cviceni dole: <Pozdrav />

function Pozdravx() {
  return <h2>libovolný text</h2>
}


// ÚKOL 2 — props a jejich typ
//
// Props jsou data předaná komponentě zvenčí. Vypadá to jako atribut v HTML.
// V TypeScriptu se jejich tvar popíše typem — a tohle je ta hlavní věc, kterou
// se tu učíš navíc oproti JavaScriptu.
//
type PozdravProps = {
  jmeno: string
  vek?: number        //otazník = nepovinný prop
}

function Pozdrav({ jmeno }: PozdravProps) {
  return <p>ahoj {jmeno}</p>
}
//
// Ty složené závorky v parametru jsou destrukturalizace — vytáhne `jmeno`
// z objektu props do proměnné. Za dvojtečkou je typ celého toho objektu.
//
// Uprav Pozdrav tak, aby brala povinný `jmeno: string`, a použij ji dvakrát
// s různými jmény.
//
// Pak schválně zkus <Pozdrav /> bez jména a podívej se, co editor podtrhne.
// Tohle je přesně ten důvod, proč TypeScript používáme.


// ÚKOL 3 — useState (stav)
//
// Stav je hodnota, kterou si komponenta pamatuje mezi překreslením. Když se
// změní, React komponentu překreslí. Obyčejná proměnná to neumí.
//
//   const [pocet, setPocet] = useState(0)
//    ^ hodnota   ^ funkce na její změnu    ^ počáteční hodnota
//
// Typ si TypeScript odvodí z počáteční hodnoty — u useState(0) ví, že je to
// number, a setPocet('ahoj') ti podtrhne. Psát ho výslovně musíš jen tehdy,
// když se odvodit nedá, hlavně u null:
//
//   const [vysledek, setVysledek] = useState<Vysledek | null>(null)
//
// Ty špičaté závorky se jmenují generikum — říkají „stav tohohle typu".
// Bez nich by TypeScript viděl jen `null` a nic jiného bys tam nesměl uložit.
// Přesně tohle budeš potřebovat na odpověď z backendu.
//
// Nezapomeň nahoru:  import { useState } from 'react'
//
// Vytvoř komponentu Pocitadlo:
//   • stav `pocet` začínající na 0
//   • <button>, který po kliknutí zvýší pocet o 1
//   • vypiš aktuální hodnotu
//
// Kliknutí:  onClick={() => setPocet(pocet + 1)}
// Bez té šipky by se funkce zavolala hned při vykreslení a rozjela nekonečné
// překreslování. Je to nejčastější začátečnická chyba.
//
// Hodnotu nikdy neměň přiřazením (pocet = 5), vždy přes setPocet.

function Pocitadlo(){
  const [pocet, setPocet] = useState(0)



  return <button onClick={() => setPocet(pocet + 1)}>{pocet}</button>



}

// ÚKOL 4 — vstupní pole a typ události
//
// Textové pole drží hodnotu ve stavu. Říká se tomu řízená komponenta.
//
//   <textarea value={text} onChange={(e) => setText(e.target.value)} />
//
// Tady TypeScript pomáhá potichu: typ `e` si odvodí sám, protože ví, že jsi
// na <textarea>. Zkus napsat e.target.valu (překlep) a uvidíš, že to chytne.
//
// Kdybys tu funkci psal zvlášť mimo JSX, typ už dodat musíš:
//
//   function zmena(e: React.ChangeEvent<HTMLTextAreaElement>) {
//     setText(e.target.value)
//   }
//
// Vytvoř komponentu Zrcadlo:
//   • stav `text` (začíná prázdným řetězcem '')
//   • <textarea> navázanou na ten stav
//   • pod ním <p> vypisující napsaný text
//   • a druhé <p> s délkou textu — hodí se text.length
//
// Tohle je přesně vstup na článek, který budeš potřebovat.

function Zrcadlo(){
  const [text, setText] = useState('');
  return (
  <div>
    <textarea value={text} onChange={(e) => setText(e.target.value)} />
    <p>{text}</p>
    { text.length >0 && text.length<20 &&<p>{text.length}</p>}
    {text.length <= 0  &&  <p>zatim nic nenapsáno</p>}
    {text.length >= 20  && <p>to už je dlouhé</p> }
  </div>
  )

}


// ÚKOL 5 — podmíněné vykreslování
//
// Když se má něco zobrazit jen někdy:
//
//   {podminka && <p>zobrazí se, jen když podmínka platí</p>}
//   {podminka ? <p>ano</p> : <p>ne</p>}
//
// Rozšiř Zrcadlo: když je text prázdný, vypiš „zatím nic nenapsáno".
// Když je delší než 20 znaků, vypiš „to už je dlouhé".




// ÚKOL 6 — seznamy přes .map()
//
// Pole se na JSX převádí metodou .map(). Každý prvek musí mít atribut `key`
// s unikátní hodnotou — podle něj React pozná, co se změnilo.
//
// Nejdřív popiš, jak vypadá jedna položka. Všimni si `label` — místo obyčejného
// string se dá vyjmenovat, které hodnoty jsou povolené:
//
  type Udalost = {
    id: number
    titulek: string
    label: 'down' | 'neutral' | 'up'
  }

  const udalosti: Udalost[] = [
    { id: 1, titulek: 'SEC schválila ETF', label: 'up' },
    { id: 2, titulek: 'Burza nahlásila útok', label: 'down' },
  ]

  function Vykresleni(){
    const listItems = udalosti.map(udalost => <li key={udalost.id}>{udalost.titulek} {udalost.label}</li>)
    return (
      <ul>{listItems}</ul>
    )
  }
//
// Zkus do pole napsat label: 'nahoru' a podívej se na chybu. Tohle je typ,
// který v aplikaci reálně použiješ — backend vrací právě tyhle tři hodnoty.
//
// Vykresli pole jako seznam, jako `key` použij `id`.
//
// Tímhle mechanismem budeš vypisovat nalezené historické události. Rozdíl bude
// jen v tom, že data přijdou z fetch místo z konstanty.


export default function Cviceni() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Cvičení Reactu a TypeScriptu</h1>
        <Pozdravx></Pozdravx>
    
        <Pozdrav jmeno="Petr"></Pozdrav>
        <Pozdrav jmeno="Pavel"></Pozdrav>

        <Pocitadlo></Pocitadlo>

        <Zrcadlo></Zrcadlo>

        <Vykresleni></Vykresleni>




      

    </div>
  )
}
