import { useId, useState } from 'react'
import { Badge, Button, Group, Stack, Text, Title } from '@mantine/core'
import type { Udalost } from '../api'
import { procenta } from '../ceny'
import GrafBTC from './GrafBTC'
import styles from './HistorickePodklady.module.css'

function odkaz(value: string) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined }
  catch { return undefined }
}
const klic = (u: Udalost) => `${u.datum}|${u.url}|${u.titulek}`

export default function HistorickePodklady({ udalosti, minimum }: { udalosti: Udalost[]; minimum: number }) {
  const id = useId()
  const [vybrana, setVybrana] = useState<string | null>(null)
  const vyber = udalosti.find((u) => klic(u) === vybrana)
  return <section className={styles.panel} aria-labelledby={id}>
    <Group justify="space-between" mb="md">
      <Title id={id} order={2} size="h4">Historické podklady <Badge variant="light" color="gray">{udalosti.length}</Badge></Title>
      <Text size="xs" c="dimmed">Minimální podobnost {minimum} %</Text>
    </Group>
    {!udalosti.length ? <Text size="sm" c="dimmed">Žádný podklad nesplnil nastavenou podobnost. Predikce nemá historickou oporu.</Text> : <div className={styles.rozlozeni}>
      <ul className={styles.seznam} aria-label="Vyber historický článek pro graf">
        {udalosti.map((u) => <li key={klic(u)}>
          <button type="button" className={styles.udalost} aria-pressed={klic(u) === vybrana} aria-controls={`${id}-graf`} onClick={() => setVybrana(klic(u))}>
            <span className={styles.titulek}>{u.titulek}</span>
            <span className={styles.metadata}>{u.zdroj} · {new Date(u.datum).toLocaleDateString('cs-CZ', { timeZone: 'UTC' })}</span>
            <span className={styles.hodnoty}><span>Podobnost {(u.podobnost * 100).toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %</span><span>BTC {procenta(u.zmena_pct)}</span></span>
          </button>
        </li>)}
      </ul>
      <div id={`${id}-graf`} className={styles.graf}>
        {vyber ? <Stack gap="xs">
          <Group justify="space-between">
            {odkaz(vyber.url) && <Text component="a" size="sm" href={odkaz(vyber.url)} target="_blank" rel="noreferrer">Otevřít původní článek ↗</Text>}
            <Button size="compact-xs" variant="subtle" color="gray" onClick={() => setVybrana(null)}>Zavřít detail</Button>
          </Group>
          <GrafBTC key={klic(vyber)} datum={vyber.datum} titulek={vyber.titulek} skutecnaZmena={vyber.zmena_pct} />
        </Stack> : <div className={styles.prazdny}><Text size="sm" c="dimmed">Vyber článek ze seznamu a zobraz jeho cenový vývoj.</Text></div>}
      </div>
    </div>}
  </section>
}
