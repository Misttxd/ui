import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ctiPrubeh, predikujPrubezne } from '../src/api.ts'

// Spuštění bez dalších závislostí: node --experimental-strip-types --test tests/api-stream.test.mjs
const encoder = new TextEncoder()
const kroky = ['vstup', 'priprava', 'embedding', 'hledani', 'predikce']
const zacatek = { faze: 'vstup', hotove: [], zprava: 'Načítám článek.' }
const podklady = {
  faze: 'predikce', hotove: kroky.slice(0, 4), zprava: 'Vyhodnocuji podklady.',
  jadro: 'Česká zpráva o rozhodnutí.', podobne: [],
}
const hotovo = {
  ...podklady, faze: 'hotovo', hotove: kroky, zprava: 'Hotovo.',
  vysledek: {
    rezim: 'prosty_rag', predikce: 'neutral', surova_odpoved: 'neutral',
    jadro_dotazu: podklady.jadro, je_zprava: true, podobne: [],
  },
}
const varovani = {
  faze: 'varovani', hotove: ['vstup'], zprava: 'Text nedává smysl.', text_vstupu: 'xyzxyz',
}

function streamText(text, poBajtech = false) {
  const data = encoder.encode(text)
  return new ReadableStream({
    start(controller) {
      if (poBajtech) for (const byte of data) controller.enqueue(Uint8Array.of(byte))
      else controller.enqueue(data)
      controller.close()
    },
  })
}

function zaznamy(...data) { return data.map((d) => JSON.stringify(d)).join('\n') + '\n' }

test('rozpozná více zpráv v jednom bloku i české UTF-8 znaky rozdělené po bajtech', async () => {
  for (const poBajtech of [false, true]) {
    const prijate = []
    await ctiPrubeh(streamText(zaznamy(zacatek, podklady, hotovo), poBajtech), (d) => prijate.push(d))
    assert.deepEqual(prijate, [zacatek, podklady, hotovo])
  }
})

test('přijme CRLF, prázdné řádky a poslední zprávu bez ukončovacího řádku', async () => {
  const prijate = []
  await ctiPrubeh(streamText(`\r\n${JSON.stringify(zacatek)}\r\n\r\n${JSON.stringify(hotovo)}`), (d) => prijate.push(d))
  assert.deepEqual(prijate, [zacatek, hotovo])
})

test('varování a chyba ukončí čtení bez čekání na uzavření spojení', async () => {
  for (const terminal of [varovani, { ...podklady, faze: 'chyba', zprava: 'Ollama není dostupná.' }]) {
    let zruseno = false
    const stream = new ReadableStream({
      start(controller) { controller.enqueue(encoder.encode(zaznamy(terminal))) },
      cancel() { zruseno = true },
    })
    const prijate = []
    await ctiPrubeh(stream, (d) => prijate.push(d))
    assert.deepEqual(prijate, [terminal])
    assert.equal(zruseno, true)
    assert.equal(stream.locked, false)
  }
})

test('předčasný konec zachová již předané podklady a vyvolá chybu', async () => {
  const prijate = []
  await assert.rejects(ctiPrubeh(streamText(zaznamy(zacatek, podklady)), (d) => prijate.push(d)), /před dokončením/)
  assert.deepEqual(prijate, [zacatek, podklady])
})

test('prázdná odpověď není úspěšná predikce', async () => {
  await assert.rejects(ctiPrubeh(streamText(''), () => {}), /před dokončením/)
})

test('odmítne porušený JSON a neplatné kódování', async () => {
  await assert.rejects(ctiPrubeh(streamText('{neplatne}\n'), () => {}), /nečitelný/)
  const stream = new ReadableStream({ start(c) { c.enqueue(Uint8Array.of(255)); c.close() } })
  await assert.rejects(ctiPrubeh(stream, () => {}), TypeError)
})

test('odmítne neplatné stavy, chybějící výsledek a varování bez původního textu', async () => {
  const neplatne = [
    null, { ...zacatek, faze: 'neznama' }, { ...zacatek, hotove: ['neznama'] },
    { ...zacatek, zprava: 12 }, { ...hotovo, vysledek: undefined },
    { ...hotovo, hotove: ['vstup'] }, { ...hotovo, vysledek: { ...hotovo.vysledek, predikce: null } },
    { ...varovani, text_vstupu: '' }, { ...varovani, text_vstupu: undefined },
    { ...podklady, podobne: [{ titulek: 'Neúplný záznam' }] },
    { ...podklady, jadro: {} },
  ]
  for (const data of neplatne) {
    await assert.rejects(ctiPrubeh(streamText(zaznamy(data)), () => {}), /neplatný stav/)
  }
})

test('zrušení ukončí čekání na další zprávu a uvolní stream', async () => {
  const controller = new AbortController()
  let zruseno = false
  const stream = new ReadableStream({ cancel() { zruseno = true } })
  const cekani = ctiPrubeh(stream, () => assert.fail('Zrušený požadavek nesmí poslat zprávu.'), controller.signal)
  controller.abort()
  await assert.rejects(cekani, { name: 'AbortError' })
  assert.equal(zruseno, true)
  assert.equal(stream.locked, false)
})

test('po zrušení nepředá zbývající zprávy již načteného bloku', async () => {
  const controller = new AbortController()
  const prijate = []
  await assert.rejects(ctiPrubeh(streamText(zaznamy(zacatek, hotovo)), (d) => {
    prijate.push(d)
    controller.abort()
  }, controller.signal), { name: 'AbortError' })
  assert.deepEqual(prijate, [zacatek])
})

test('streamovací požadavek odešle odkaz, režim a potvrzení a předá výsledek', async (t) => {
  const signal = new AbortController().signal
  const dotaz = { url: 'https://example.com/clanek', rezim: 'agentni', pokracovat_i_tak: false }
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/predict/stream')
    assert.equal(options.method, 'POST')
    assert.equal(options.signal, signal)
    assert.deepEqual(JSON.parse(options.body), dotaz)
    return new Response(zaznamy(varovani), { headers: { 'Content-Type': 'application/x-ndjson' } })
  })
  const prijate = []
  await predikujPrubezne(dotaz, (d) => prijate.push(d), signal)
  assert.deepEqual(prijate, [varovani])
})

test('pokračování odešle potvrzený text bez opětovného stahování odkazu', async (t) => {
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body), { text: varovani.text_vstupu, rezim: 'prosty', pokracovat_i_tak: true })
    return new Response(zaznamy(hotovo))
  })
  await predikujPrubezne({ text: varovani.text_vstupu, rezim: 'prosty', pokracovat_i_tak: true }, () => {}, new AbortController().signal)
})

test('HTTP odmítnutí použije srozumitelnou zprávu backendu', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ detail: 'Článek je příliš dlouhý.' }), { status: 400 }))
  await assert.rejects(predikujPrubezne({ text: 'text', rezim: 'prosty', pokracovat_i_tak: false }, () => {}, new AbortController().signal), /příliš dlouhý/)
})

test('výpadek sítě převede na čitelnou chybu', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch') })
  await assert.rejects(predikujPrubezne({ text: 'text', rezim: 'prosty', pokracovat_i_tak: false }, () => {}, new AbortController().signal), /Spojení se serverem selhalo/)
})
