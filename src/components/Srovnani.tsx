import { Table, Text } from '@mantine/core'

// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL H — tabulka srovnání metod
// ═══════════════════════════════════════════════════════════════════════════
//
// Tenhle soubor plní bod 5 zadání: porovnání s RSI, MACD a náhodným výběrem.
//
// Data jsou statická, měřená na 110 validačních záznamech. Zdroj:
// ..\DATASET\dataset_v5\baseline_validation.json

const BASELINE = [
  { metoda: 'náhoda (průměr ze 100 běhů)', f1: 0.326 },
  { metoda: 'MACD', f1: 0.324 },
  { metoda: 'market-only lineární', f1: 0.286 },
  { metoda: 'RSI 30/70', f1: 0.224 },
  { metoda: 'majorita', f1: 0.161 },
]

// ÚKOL H4 — doplň sloupec s přesností
//
// U MACD je 32,7 %, u RSI 28,2 %, u majority 31,8 %. U náhody a lineárního
// modelu přesnost změřená není, takže tam nech prázdno.
//
// ÚKOL H5 — vysvětli metody
//
// Zvaž sloupec s krátkým popisem, co která metoda dělá. Oponent nemusí vědět,
// co je MACD ani co znamená „majorita".
//
// ÚKOL H6 — kam tabulku dát
//
// Ukázat vždycky, nebo schovat pod rozbalení? Je to doklad poctivosti, ale
// zabírá místo.

export default function Srovnani() {
  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Metoda</Table.Th>
            <Table.Th>Macro-F1</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {BASELINE.map((r) => (
            <Table.Tr key={r.metoda}>
              <Table.Td>{r.metoda}</Table.Td>
              <Table.Td>{r.f1.toFixed(3)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* Tuhle větu nemaž. Bez ní čísla klamou: 110 vzorků je málo a rozdíly
          mezi metodami jsou v mezích náhody. */}
      <Text size="xs" c="dimmed">
        Měřeno na 110 validačních záznamech. Rozdíly mezi metodami jsou v mezích
        statistické náhody.
      </Text>
    </>
  )
}
