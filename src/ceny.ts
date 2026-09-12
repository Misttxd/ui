export type Svicka = { time: number; open: number; high: number; low: number; close: number }
export type Ceny = {
  symbol: 'BTCUSDT'; interval: '1m'; svicky: Svicka[]
  cas: number; cena: number; zacatek: number; historicky: boolean
}

export function jeCeny(value: unknown): value is Ceny {
  if (!value || typeof value !== 'object') return false
  const d = value as Ceny
  return d.symbol === 'BTCUSDT' && d.interval === '1m' && typeof d.historicky === 'boolean'
    && Number.isFinite(d.cas) && Number.isFinite(d.zacatek) && Number.isFinite(d.cena) && d.cena > 0
    && Array.isArray(d.svicky) && d.svicky.length > 0
    && d.svicky.every((s, i) => s && Number.isInteger(s.time)
      && [s.open, s.high, s.low, s.close].every((n) => Number.isFinite(n) && n > 0)
      && s.low <= Math.min(s.open, s.close) && s.high >= Math.max(s.open, s.close)
      && (i === 0 || s.time > d.svicky[i - 1].time))
    && d.svicky.some((s) => s.time === d.zacatek)
}

export function cilovaCena(cena: number, procenta: number): number {
  return cena * (1 + procenta / 100)
}

export async function nactiCeny(datum: string | undefined, signal: AbortSignal): Promise<Ceny> {
  const zaklad = (import.meta.env?.VITE_API_URL || '/api').replace(/\/$/, '')
  const query = datum ? `?${new URLSearchParams({ datum })}` : ''
  const response = await fetch(`${zaklad}/market/btc${query}`, { signal })
  const data: unknown = await response.json()
  if (!response.ok) {
    const detail = (data as { detail?: unknown })?.detail
    throw new Error(typeof detail === 'string' ? detail : 'Cenová data se nepodařilo načíst.')
  }
  if (!jeCeny(data)) throw new Error('Zdroj poslal neplatná cenová data.')
  return data
}

export const procenta = (cislo: number) => `${cislo > 0 ? '+' : ''}${cislo.toLocaleString('cs-CZ', { maximumFractionDigits: 4 })} %`
export const cenaText = (cislo: number) => `${cislo.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`
