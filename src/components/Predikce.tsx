import { Badge, Stack, Text } from '@mantine/core'
import type { Odpoved } from '../api'
import { BARVY_TRID } from '../format'

// ═══════════════════════════════════════════════════════════════════════════
// ÚKOLY H, J, N — výsledek predikce
// ═══════════════════════════════════════════════════════════════════════════
//
// Ukazuje, co model odpověděl. Až budeš mít hotový backend (úkoly J a K),
// přibude sem i svíčkový graf s vyznačeným odhadem.

type PredikceProps = {
  vysledek: Odpoved
}

// ÚKOL H1 — varování, když vstup není zpráva
//
// Když je `vysledek.je_zprava` rovno false, vypiš zřetelné upozornění: vložený
// text vypadá jako komentář nebo analýza, ne jako zpráva o události, a výsledek
// bude nespolehlivý. Použij `Alert` se žlutou barvou.
//
// Vyzkoušej si to: vlož do aplikace úvahu nebo recenzi filmu.
//
// ÚKOL H2 — poznámka o experimentálním výstupu
//
// Někam do bloku napiš, že jde o experimentální výstup, který zatím
// nepřekonává jednoduché statistické metody. Je to jedna věta a předejde
// otázce u obhajoby.
//
// ÚKOL H3 — jádro dotazu
//
// Vypiš `vysledek.jadro_dotazu`. Jsou to věty, které model z článku vytáhl
// jako podstatné. Uživatel na nich hned vidí, jestli extrakce nezahodila něco
// důležitého. Hodí se `Code` nebo `Blockquote`.
//
// ÚKOL J1 — očekávaný rozsah (až bude backend hotový)
//
// Až přidáš rozsah do odpovědi API a do typu `Odpoved`, zobraz ho tady.
// Musí u něj být napsané, že je to odhad modelu.
//
// ÚKOL N1 — graf (až bude backend hotový)
//
// Vlož sem `<Graf />` s aktuální cenou a rozsahem vyznačeným čárkovaně.

export default function Predikce({ vysledek }: PredikceProps) {
  return (
    <Stack gap="xs">
      {vysledek.predikce === null ? (
        <Text>Model neodpověděl použitelnou třídou.</Text>
      ) : (
        <Badge color={BARVY_TRID[vysledek.predikce]} size="lg">
          {vysledek.predikce}
        </Badge>
      )}

      <Text size="sm" c="dimmed">
        režim: {vysledek.rezim}
      </Text>

      {/* sem doplň zbytek podle úkolů výše */}
    </Stack>
  )
}
