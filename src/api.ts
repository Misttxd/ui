export type Udalost = {
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

export type Dotaz = {
  dotaz: string
  nalezeno: number
}

export type Odpoved = {
  rezim: 'agentni_rag' | 'prosty_rag'
  predikce: 'up' | 'down' | 'neutral' | null
  surova_odpoved: string
  jadro_dotazu: string
  je_zprava: boolean
  dotazy_modelu?: Dotaz[]   // otazník: posílá jen agentní endpoint
  podobne: Udalost[]        // stejný typ jako v úkolu 6, jen doplněný
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
const pockej = (ms: number) => new Promise((hotovo) => setTimeout(hotovo, ms))
export async function predikujNaoko() : Promise<Odpoved> {
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