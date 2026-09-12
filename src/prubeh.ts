import type { Odpoved, Udalost } from './api'

export type Krok = 'vstup' | 'priprava' | 'embedding' | 'hledani' | 'predikce'

export type PrubehZpracovani = {
  faze: 'cekani' | 'zpracovani' | Krok | 'varovani' | 'hotovo' | 'chyba'
  hotove: Krok[]
  zprava: string
  text_vstupu?: string
  lzeOpakovat?: boolean
  jadro?: string
  podobne?: Udalost[]
  vysledek?: Odpoved
}

export const KROKY: { id: Krok; nazev: string }[] = [
  { id: 'vstup', nazev: 'Načtení vstupu' },
  { id: 'priprava', nazev: 'Kontrola a zestručnění článku' },
  { id: 'embedding', nazev: 'Příprava pro vyhledávání' },
  { id: 'hledani', nazev: 'Dohledání podobných událostí' },
  { id: 'predikce', nazev: 'Vytvoření predikce' },
]
