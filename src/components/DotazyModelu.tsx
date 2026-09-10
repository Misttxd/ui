import { List, Text } from '@mantine/core'
import type { Dotaz } from '../api'

// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL G — co model hledal (jen agentní režim)
// ═══════════════════════════════════════════════════════════════════════════
//
// Tohle je nejsilnější prvek pro obhajobu. Ukazuje, že si model vyhledávací
// dotazy formuluje sám a že událost zobecňuje — na tom předvedeš rozdíl mezi
// klasickým a agentním RAG.
//
// Pozor: `dotazy_modelu` je v typu `Odpoved` s otazníkem, takže nemusí
// existovat. Klasický endpoint ho neposílá vůbec.

type DotazyModeluProps = {
  dotazy?: Dotaz[]
}


//aa

// ÚKOL G1 — ošetři, že pole nemusí přijít
//
// Prop má taky otazník, takže uvnitř může být `undefined`. Použij `??`
// a prázdné pole, jak je to popsané v úkolu G v dokumentu.
//
// ÚKOL G2 — vyber zobrazení
//
// `List` (odrážky), `Table`, nebo `Timeline` (ukáže, že dotazy šly po sobě).
// Zápisy máš v dokumentu v sekci JAK VYPADAJÍ TY ALTERNATIVY.
//
// ÚKOL G3 — rozhodni, co s klasickým režimem
//
// Buď sekci schovej úplně, nebo napiš, že v klasickém režimu model dotazy
// netvoří. Druhá varianta je pro obhajobu názornější.
//
// ÚKOL G4 — ukázat i `nalezeno`?
//
// Je to počet událostí, které ten dotaz našel. Zvaž, jestli to uživateli
// něco řekne.

export default function DotazyModelu({ dotazy }: DotazyModeluProps) {
  const seznam = dotazy ?? []

  if (seznam.length === 0) {
    return <Text c="dimmed">V klasickém režimu model vlastní dotazy netvoří.</Text>
  }

  return (
    <List>
      {seznam.map((d) => (
        <List.Item key={d.dotaz}>{d.dotaz}</List.Item>
      ))}
    </List>
  )
}
