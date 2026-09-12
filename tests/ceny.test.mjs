import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cilovaCena, jeCeny } from '../src/ceny.ts'

test('procentní odhad převádí na cílovou cenu', () => {
  assert.equal(cilovaCena(100000, 1.8), 101800)
  assert.equal(cilovaCena(100000, -2), 98000)
  assert.equal(cilovaCena(100000, 0), 100000)
})

test('cenová data vyžadují platné OHLC, seřazené svíčky a výchozí minutu', () => {
  const data = { symbol: 'BTCUSDT', interval: '1m', cas: 120, zacatek: 120, cena: 100, historicky: false,
    svicky: [{ time: 120, open: 100, high: 102, low: 98, close: 101 }] }
  assert.equal(jeCeny(data), true)
  assert.equal(jeCeny({ ...data, svicky: [] }), false)
  assert.equal(jeCeny({ ...data, zacatek: 60 }), false)
  assert.equal(jeCeny({ ...data, svicky: [...data.svicky, ...data.svicky] }), false)
  assert.equal(jeCeny({ ...data, svicky: [{ ...data.svicky[0], high: 99 }] }), false)
  assert.equal(jeCeny({ ...data, cena: Infinity }), false)
})
