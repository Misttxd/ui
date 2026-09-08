import { Card, Text } from '@mantine/core'
import type { Udalost } from '../api'

// ═══════════════════════════════════════════════════════════════════════════
// ÚKOLY D, E, F, M — karta jedné nalezené historické události
// ═══════════════════════════════════════════════════════════════════════════
//
// Tohle je nejdůležitější komponenta celého rozhraní. Ukazuje, že systém
// nevěští, ale opírá se o skutečné historické události a o to, jak se po nich
// cena doopravdy pohnula.
//
// Syntaxe ke všem úkolům je v UKOLY_APLIKACE.md. Tady jsou jen kroky.
//
// K dispozici máš z `Udalost`:
//   titulek, datum, label, zmena_pct, podobnost, jadro, zdroj, url, obsah


type UdalostKartaProps = {
  udalost: Udalost
}


// ÚKOL D — co všechno na kartě bude
//
// D1. Doplň zbylé údaje. Rozmysli si hierarchii: co má být vidět první?
//     Titulek? Nebo `jadro`, které říká, čím se ta událost vyznačovala?
//
// D2. Zvýrazni `podobnost`. Řekl jsi, že si na téhle metrice zakládáš, tak jí
//     dej prostor. Na výběr máš číslo, `Progress` (pruh) nebo `RingProgress`
//     (kroužek) — zápisy všech tří jsou v úkolu D v dokumentu.
//
// D3. Zvýrazni `zmena_pct`. Je to skutečný pohyb ceny po té události, tedy
//     jádro celé myšlenky. Použij `Badge` s barvou z `BARVY_TRID`.
//
// D4. Napiš k podobnosti vysvětlivku (`Tooltip`). Ty víš, co to číslo znamená.
//     Oponent u obhajoby ne.
//
// ÚKOL E — nezobrazuj syrová data
//
// E1. Datum ani čísla neukazuj tak, jak přišla. Použij funkce z `../format`.
//
// ÚKOL F — odkaz a původní text
//
// F1. Přidej `Anchor` na `udalost.url` s `target="_blank"` a `rel="noreferrer"`.
//     Tohle je důležité: dokládá, že si systém událost nevymyslel.
//
// F2. Schovej `udalost.obsah` pod `Spoiler` nebo `Accordion`, ať nezabírá
//     půl obrazovky.
//
// ÚKOL M — graf (až po backendu, úkol K)
//
// M1. Až budeš mít endpoint `/candles/{id}`, vlož sem `<Graf />` tak, aby se
//     otevřel po rozkliknutí karty. `Accordion` se stavem na to je v úkolu F.

export default function UdalostKarta({ udalost }: UdalostKartaProps) {
  return (
    <Card withBorder padding="md">
      <Text fw={700}>{udalost.titulek}</Text>
      <Text size="sm" c="dimmed">
        {udalost.zdroj}
      </Text>

      {/* sem doplň zbytek podle úkolů výše */}
    </Card>
  )
}
