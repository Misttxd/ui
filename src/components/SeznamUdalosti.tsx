import { Stack, Text } from '@mantine/core'
import type { Udalost } from '../api'
import UdalostKarta from './Udalost'

// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL D — seznam nalezených událostí
// ═══════════════════════════════════════════════════════════════════════════
//
// Tahle komponenta nic nevykresluje sama. Jen projde pole a pro každou položku
// zavolá `UdalostKarta`. Rozdělení má smysl proto, že se karta ladí líp
// v samostatném souboru než uvnitř cyklu.

type SeznamUdalostiProps = {
  udalosti: Udalost[]
}

// ÚKOL D5 — prázdné pole
//
// Backend může vrátit prázdné `podobne`. Rozhraní to musí snést a napsat, že
// se nic nenašlo — ne spadnout ani ukázat prázdné místo.
//
// ÚKOL D6 — řazení
//
// Události přijdou seřazené podle podobnosti, od nejpodobnější. Rozmysli si,
// jestli to tak chceš nechat, nebo je seřadíš jinak. Řadí se metodou .sort().

export default function SeznamUdalosti({ udalosti }: SeznamUdalostiProps) {
  if (udalosti.length === 0) {
    return <Text c="dimmed">Žádné podobné události se nenašly.</Text>
  }

  return (
    <Stack>
      {udalosti.map((u) => (
        <UdalostKarta key={u.url} udalost={u} />
      ))}
    </Stack>
  )
}
