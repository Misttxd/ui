import { useEffect, useId, useRef, useState } from 'react'
import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { CandlestickSeries, ColorType, createChart, createSeriesMarkers, LineSeries, LineStyle, type UTCTimestamp } from 'lightweight-charts'
import { cenaText, cilovaCena, nactiCeny, procenta, type Ceny } from '../ceny'
import styles from './GrafBTC.module.css'

type Props = { datum?: string; zmenaPct?: number; titulek?: string; skutecnaZmena?: number }

function SvickovyGraf({ data, zmenaPct }: { data: Ceny; zmenaPct?: number }) {
  const element = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!element.current) return
    const chart = createChart(element.current, {
      autoSize: true,
      layout: { background: { type: ColorType.Solid, color: '#ffffff' }, textColor: '#59636e', attributionLogo: true },
      grid: { vertLines: { visible: false }, horzLines: { color: '#eef0f2' } },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#e5e7eb' },
      rightPriceScale: { borderColor: '#e5e7eb' },
      localization: { locale: 'cs-CZ', timeFormatter: (time: number) => new Date(time * 1000).toLocaleString('cs-CZ', { timeZone: 'UTC' }) },
      handleScroll: { vertTouchDrag: false },
    })
    const candles = chart.addSeries(CandlestickSeries, {
      upColor: '#278474', downColor: '#b65c58', wickUpColor: '#278474', wickDownColor: '#b65c58', borderVisible: false,
      lastValueVisible: false, priceLineVisible: false,
    })
    const svicky = data.svicky.map((s) => ({ ...s, time: s.time as UTCTimestamp }))
    const konec = data.zacatek + 1800
    // Prázdné minuty zachovají časové měřítko i v budoucí části grafu.
    candles.setData(data.historicky ? svicky : [...svicky, ...Array.from({ length: 30 }, (_, i) => ({ time: (data.zacatek + (i + 1) * 60) as UTCTimestamp }))])
    if (!data.historicky && zmenaPct !== undefined) {
      const line = chart.addSeries(LineSeries, { color: '#496c97', lineStyle: LineStyle.Dashed, lineWidth: 2, priceLineVisible: false, title: 'Odhad' })
      line.setData([{ time: data.zacatek as UTCTimestamp, value: data.cena }, { time: konec as UTCTimestamp, value: cilovaCena(data.cena, zmenaPct) }])
      createSeriesMarkers(line, [
        { time: data.zacatek as UTCTimestamp, position: 'belowBar', color: '#59636e', shape: 'circle', text: 'Výchozí cena' },
        { time: konec as UTCTimestamp, position: 'aboveBar', color: '#496c97', shape: 'circle', text: `${procenta(zmenaPct)} · +30 min` },
      ])
    } else if (data.historicky) {
      createSeriesMarkers(candles, [
        { time: data.zacatek as UTCTimestamp, position: 'aboveBar', color: '#496c97', shape: 'arrowDown', text: 'Vydání článku' },
        ...(svicky.some((s) => s.time === konec) ? [{ time: konec as UTCTimestamp, position: 'aboveBar' as const, color: '#59636e', shape: 'circle' as const, text: '+30 min' }] : []),
      ])
    }
    chart.timeScale().fitContent()
    return () => chart.remove()
  }, [data, zmenaPct])
  return <div ref={element} className={styles.platno} role="img" aria-label={data.historicky ? 'Minutové svíčky BTC kolem vydání článku. Značky označují vydání a konec 30 minut.' : 'Minutové svíčky BTC. Přerušovaná čára spojuje výchozí cenu s odhadem za 30 minut.'} />
}

export default function GrafBTC({ datum, zmenaPct, titulek, skutecnaZmena }: Props) {
  const id = useId()
  const [pokus, setPokus] = useState(0)
  const [stav, setStav] = useState<{ data?: Ceny; chyba?: string }>({})
  useEffect(() => {
    const controller = new AbortController()
    nactiCeny(datum, controller.signal).then((data) => {
      if (!controller.signal.aborted) setStav({ data })
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setStav({ chyba: error instanceof TypeError ? 'Spojení se serverem selhalo. Zkontroluj, že běží backend.' : error instanceof Error ? error.message : 'Ceny se nepodařilo načíst.' })
    })
    return () => controller.abort()
  }, [datum, pokus])
  const { data, chyba } = stav
  return <section className={styles.panel} aria-labelledby={id}>
    <Stack gap="sm">
      <Title id={id} order={datum ? 3 : 2} size="h4">{datum ? 'Reakce na historický článek' : 'BTC · cenový výhled'}</Title>
      {titulek && <Text size="sm">{titulek}</Text>}
      {!data && !chyba && <Text size="sm" c="dimmed" role="status">Načítám cenová data…</Text>}
      {chyba && <Group><Text size="sm" role="alert">{chyba}</Text><Button variant="default" size="xs" onClick={() => { setStav({}); setPokus((n) => n + 1) }}>Zkusit znovu</Button></Group>}
      {data && <>
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="xs" c="dimmed">{datum ? 'Vydání článku (UTC)' : 'Cena při načtení výsledku'}</Text>
            <Text fw={600}>{datum ? new Date(data.cas * 1000).toLocaleString('cs-CZ', { timeZone: 'UTC' }) : cenaText(data.cena)}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">{datum ? 'Reakce za 30 min · dataset' : 'Odhad za 30 minut'}</Text>
            <Text fw={600}>{datum ? (skutecnaZmena !== undefined ? procenta(skutecnaZmena) : '—') : zmenaPct !== undefined ? `${procenta(zmenaPct)} · ${cenaText(cilovaCena(data.cena, zmenaPct))}` : '—'}</Text>
          </div>
        </Group>
        <SvickovyGraf data={data} zmenaPct={zmenaPct} />
        <Text size="xs" c="dimmed">Binance · BTC/USDT · svíčky 1 min · časy UTC. {datum ? 'Značka vydání je zaokrouhlená na minutu; procentní reakce pochází z datasetu.' : `Snímek ${new Date(data.cas * 1000).toLocaleTimeString('cs-CZ', { timeZone: 'UTC' })} UTC. Přerušovaná čára ukazuje cílový odhad, nikoli průběh budoucích svíček.`}</Text>
        <Text size="xs" c="dimmed">TradingView Lightweight Charts™ · Copyright © 2025 <a href="https://www.tradingview.com/" target="_blank" rel="noreferrer">TradingView, Inc.</a></Text>
      </>}
    </Stack>
  </section>
}
