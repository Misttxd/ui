export type Rezim = 'prosty' | 'agentni'

// Odkaz je samostatný typ: jeho adresu nesmíme poslat modelu jako text článku.
export type ZdrojClanku =
  | { typ: 'text'; text: string }
  | { typ: 'odkaz'; url: string }
  | { typ: 'soubor'; nazev: string; text: string }

export type PrilozenySoubor = { nazev: string; text: string }

export const POVOLENE_SOUBORY = '.txt,.md,.markdown,text/plain,text/markdown'
const MAX_VELIKOST = 2 * 1024 * 1024

export function rozpoznejOdkaz(text: string): { url: string | null; chyba: string | null } {
  const hodnota = text.trim()
  // Článek obsahující odkaz je pořád článek. Rozpoznáváme jen samotnou adresu.
  if (!hodnota || /\s/.test(hodnota)) return { url: null, chyba: null }
  const vypadaJakoOdkaz = /^(?:[a-z][a-z\d+.-]*:\/\/|www\.)/i.test(hodnota)
  if (!vypadaJakoOdkaz) return { url: null, chyba: null }

  try {
    const url = new URL(/^www\./i.test(hodnota) ? `https://${hodnota}` : hodnota)
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) {
      throw new Error('Neplatná adresa')
    }
    return { url: url.href, chyba: null }
  } catch {
    return { url: null, chyba: 'Vlož úplný odkaz na článek, například https://web.cz/clanek.' }
  }
}

export async function prectiSoubor(soubor: File): Promise<PrilozenySoubor> {
  if (!/\.(txt|md|markdown)$/i.test(soubor.name)) {
    throw new Error('Vyber textový soubor .txt nebo .md. Z PDF či Wordu zatím zkopíruj text.')
  }
  if (soubor.size > MAX_VELIKOST) throw new Error('Soubor je příliš velký. Maximum jsou 2 MB.')

  let text: string
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(await soubor.arrayBuffer())
  } catch {
    throw new Error('Soubor se nepodařilo přečíst. Zkus jej uložit jako text v kódování UTF-8.')
  }
  if (!text.trim()) throw new Error('Soubor je prázdný. Vyber soubor s textem článku.')
  for (let i = 0; i < text.length; i += 1) {
    const znak = text.charCodeAt(i)
    if (znak < 32 && ![9, 10, 12, 13].includes(znak)) {
      throw new Error('Soubor neobsahuje běžný text. Vyber textový soubor .txt nebo .md.')
    }
  }
  return { nazev: soubor.name, text }
}
