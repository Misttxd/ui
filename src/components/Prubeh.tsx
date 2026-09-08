import { Timeline } from '@mantine/core'

// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL O — živý průběh zpracování
// ═══════════════════════════════════════════════════════════════════════════
//
// POZOR: dokud nemáš hotový úkol L na backendu (streamování přes SSE),
// nemá frontend jak poznat, ve které fázi zpracování je. Do té doby tuhle
// komponentu klidně používej jen jako statický seznam kroků vedle kolečka —
// ale NIKDY neodškrtávej kroky podle času. Odškrtnutý krok musí znamenat,
// že opravdu proběhl.

// Fáze v pořadí, ve kterém je backend hlásí. Musí sedět na to, co posílá
// `/predict/stream/{id}` — když název nesedí, indexOf vrátí -1 a nic se
// neodškrtne.
const FAZE = ['prijato', 'zestrucnuji', 'hledam', 'ptam_se', 'hotovo']

type PrubehProps = {
  faze: string | null
}

// ÚKOL O1 — převod názvu fáze na číslo
//
// `Timeline` chce index, ne text. `FAZE.indexOf(faze)` ti ho dá.
//
// ÚKOL O2 — popisky kroků
//
// Napiš je česky a srozumitelně. „zestrucnuji" je název fáze v kódu,
// uživatel má vidět „Zestručňuji článek".
//
// ÚKOL O3 — jak dlouho krok trval
//
// Zvaž, jestli u hotových kroků ukážeš čas. Zestručnění trvá kolem šesti
// sekund a je to poctivá informace. Změříš to přes `Date.now()` při každé
// změně fáze — budeš na to potřebovat další stav.
//
// ÚKOL O4 — Timeline nebo Stepper
//
// Timeline je svisle a unese víc textu u každého kroku. Stepper je vodorovně
// a šetří výšku. Zápis obou je v dokumentu.
//
// ÚKOL O5 — co když streamování selže
//
// Rozhraní se musí přepnout na obyčejné kolečko a predikci dokončit. Nesmí
// zamrznout na půlce seznamu.

export default function Prubeh({ faze }: PrubehProps) {
  const cislo = faze === null ? -1 : FAZE.indexOf(faze)

  return (
    <Timeline active={cislo} bulletSize={18} lineWidth={2}>
      <Timeline.Item title="Zestručňuji článek" />
      <Timeline.Item title="Hledám v databázi" />
      <Timeline.Item title="Ptám se modelu" />
    </Timeline>
  )
}
