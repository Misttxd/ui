import { KROKY, type PrubehZpracovani } from './prubeh.ts'

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
  zmena_pct?: number
  rezim: 'agentni_rag' | 'prosty_rag'
  predikce: 'up' | 'down' | 'neutral' | null
  surova_odpoved: string
  jadro_dotazu: string
  je_zprava: boolean
  dotazy_modelu?: Dotaz[]   // otazník: posílá jen agentní endpoint
  podobne: Udalost[]        // stejný typ jako v úkolu 6, jen doplněný
}

function jeUdalost(data: unknown): data is Udalost {
  if (!data || typeof data !== 'object') return false
  const u = data as Record<string, unknown>
  return ['titulek', 'datum', 'jadro', 'zdroj', 'url', 'obsah'].every((klic) => typeof u[klic] === 'string')
    && ['up', 'down', 'neutral'].includes(String(u.label))
    && typeof u.zmena_pct === 'number' && Number.isFinite(u.zmena_pct)
    && typeof u.podobnost === 'number' && Number.isFinite(u.podobnost)
}

function jeOdpoved(data: unknown): data is Odpoved {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return ['prosty_rag', 'agentni_rag'].includes(String(d.rezim))
    && (d.predikce === null || ['up', 'down', 'neutral'].includes(String(d.predikce)))
    && typeof d.surova_odpoved === 'string' && typeof d.jadro_dotazu === 'string'
    && typeof d.je_zprava === 'boolean'
    && (d.zmena_pct === undefined || (typeof d.zmena_pct === 'number' && Number.isFinite(d.zmena_pct) && d.zmena_pct > -100 && d.zmena_pct <= 100))
    && Array.isArray(d.podobne) && d.podobne.every(jeUdalost)
    && (d.dotazy_modelu === undefined || (Array.isArray(d.dotazy_modelu)
      && d.dotazy_modelu.every((d) => d && typeof d.dotaz === 'string' && Number.isFinite(d.nalezeno))))
}

type StreamDotaz = ({ text: string; url?: never } | { url: string; text?: never }) & {
  rezim: 'prosty' | 'agentni'
  pokracovat_i_tak: boolean
}

function jePrubeh(data: unknown): data is PrubehZpracovani {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  const faze = [...KROKY.map((krok) => krok.id), 'varovani', 'hotovo', 'chyba']

  return typeof d.faze === 'string' && faze.includes(d.faze)
    && Array.isArray(d.hotove) && d.hotove.every((id) => KROKY.some((krok) => krok.id === id))
    && typeof d.zprava === 'string'
    && (d.jadro === undefined || typeof d.jadro === 'string')
    && (d.text_vstupu === undefined || typeof d.text_vstupu === 'string')
    && (d.podobne === undefined || (Array.isArray(d.podobne) && d.podobne.every(jeUdalost)))
    && (d.vysledek === undefined || jeOdpoved(d.vysledek))
    && (d.faze !== 'varovani' || (typeof d.text_vstupu === 'string' && !!d.text_vstupu.trim()))
    && (d.faze !== 'hotovo' || (jeOdpoved(d.vysledek) && d.vysledek.predikce !== null
      && KROKY.every((krok) => (d.hotove as unknown[]).includes(krok.id))))
}

// Jeden JSON záznam na řádek; síťový blok může obsahovat jen část znaku nebo více zpráv.
export async function ctiPrubeh(
  stream: ReadableStream<Uint8Array>,
  onPrubeh: (prubeh: PrubehZpracovani) => void,
  signal?: AbortSignal,
): Promise<void> {
  signal?.throwIfAborted()
  const reader = stream.getReader()
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let buffer = ''
  let konec = false
  const zrus = () => { void reader.cancel().catch(() => {}) }
  signal?.addEventListener('abort', zrus, { once: true })

  function prijmi(radek: string) {
    if (!radek.trim() || konec) return
    let data: unknown
    try {
      data = JSON.parse(radek)
    } catch {
      throw new Error('Server poslal nečitelný průběh zpracování. Zkus to znovu.')
    }
    if (!jePrubeh(data)) throw new Error('Server poslal neplatný stav zpracování. Zkus to znovu.')
    signal?.throwIfAborted()
    onPrubeh(data)
    konec = ['hotovo', 'varovani', 'chyba'].includes(data.faze)
  }

  try {
    while (!konec) {
      const { done, value } = await reader.read()
      signal?.throwIfAborted()
      buffer += decoder.decode(value, { stream: !done })
      const radky = buffer.split('\n')
      buffer = radky.pop() ?? ''
      for (const radek of radky) prijmi(radek)
      if (done) {
        prijmi(buffer)
        if (!konec) throw new Error('Spojení skončilo před dokončením zpracování. Zkus to znovu.')
        break
      }
    }
  } finally {
    signal?.removeEventListener('abort', zrus)
    try {
      await reader.cancel()
    } catch {
      // Spojení už může být přerušené.
    }
    reader.releaseLock()
  }
}

export async function predikujPrubezne(
  dotaz: StreamDotaz,
  onPrubeh: (prubeh: PrubehZpracovani) => void,
  signal: AbortSignal,
): Promise<void> {
  const zaklad = (import.meta.env?.VITE_API_URL || '/api').replace(/\/$/, '')
  try {
    const odpoved = await fetch(`${zaklad}/predict/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dotaz),
      signal,
    })
    if (!odpoved.ok) {
      let zprava = odpoved.status >= 500
        ? 'Server nemohl článek zpracovat. Zkontroluj, že běží backend i Ollama, a zkus to znovu.'
        : `Server odmítl požadavek (chyba ${odpoved.status}). Zkontroluj vložený článek a jeho délku.`
      const chyba = await odpoved.json().catch(() => null)
      if (odpoved.status < 500 && typeof chyba?.detail === 'string') zprava = chyba.detail
      throw new Error(zprava)
    }
    if (!odpoved.body) throw new Error('Server neposlal průběh zpracování.')
    await ctiPrubeh(odpoved.body, onPrubeh, signal)
  } catch (chyba) {
    if (signal.aborted) throw chyba
    if (chyba instanceof TypeError) {
      throw new Error('Spojení se serverem selhalo nebo server poslal nečitelná data. Zkontroluj backend a zkus to znovu.', { cause: chyba })
    }
    throw chyba
  }
}

export async function predikuj(text: string, rezim: 'prosty' | 'agentni', signal?: AbortSignal): Promise<Odpoved> {
  const zaklad = (import.meta.env?.VITE_API_URL || '/api').replace(/\/$/, '')
  const cesta = rezim === 'agentni' ? '/predict/agent' : '/predict'
  let odpoved: Response
  try {
    odpoved = await fetch(zaklad + cesta, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal,
    })
  } catch (chyba) {
    if (signal?.aborted) throw chyba
    throw new Error('Server není dostupný. Zkontroluj, že běží backend, a zkus to znovu.', { cause: chyba })
  }
  if (!odpoved.ok) {
    throw new Error(odpoved.status >= 500
      ? 'Server nemohl článek zpracovat. Zkontroluj, že běží backend i Ollama, a zkus to znovu.'
      : `Server odmítl požadavek (chyba ${odpoved.status}). Zkontroluj vložený článek.`)
  }
  let data: unknown
  try {
    data = await odpoved.json()
  } catch {
    throw new Error('Server nevrátil čitelný výsledek. Zkus zpracování zopakovat.')
  }
  if (!jeOdpoved(data)) throw new Error('Odpověď serveru není úplná. Zkus zpracování zopakovat.')
  return data
}
