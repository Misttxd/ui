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

export async function predikuj(text: string): Promise<Odpoved> {
    const odpoved = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text }),
    })
    if (!odpoved.ok) {
    throw new Error('Server odpověděl chybou ' + odpoved.status)
    }
    return (await odpoved.json()) as Odpoved
}