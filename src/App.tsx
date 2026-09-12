import { useRef } from 'react'
import { Container, Stack, Text, Title } from '@mantine/core'

import VstupClanku from './components/VstupClanku'
import Prubeh from './components/Prubeh'
import GrafBTC from './components/GrafBTC'
import HistorickePodklady from './components/HistorickePodklady'
import useZpracovani from './useZpracovani'
import styles from './App.module.css'

export default function App() {
  const { zpracovani, spust, zpet, opakovat, pokracovat } = useZpracovani()
  const vstupPanel = useRef<HTMLDivElement>(null)
  const vysledekPanel = useRef<HTMLDivElement>(null)
  const bezi = !!zpracovani && !['hotovo', 'chyba', 'varovani', 'cekani'].includes(zpracovani.prubeh.faze)

  function upravit() {
    zpet()
    requestAnimationFrame(() => vstupPanel.current?.querySelector('textarea')?.focus())
  }

  return (
    <Container size={1280} px={{ base: 'md', sm: 'xl' }} py="xl" component="main">
      <Stack gap="xl">
        <Stack gap={6}>
          <Title order={1} size="h2">Predikce reakce BTC</Title>
          <Text size="sm" c="dimmed">Analýza zprávy v kontextu podobných událostí z minulosti.</Text>
        </Stack>

        <div className={styles.pracovniPlocha}>
          <div ref={vstupPanel} className={styles.sloupec}>
            <VstupClanku
              onOdeslat={(zdroj, rezim, minimum) => {
                void spust(zdroj, rezim, minimum)
              }}
              onZmena={zpet}
              nacita={bezi}
            />
          </div>
          {zpracovani && (
            <div ref={vysledekPanel} className={styles.sloupec} tabIndex={-1} style={{ outline: 'none' }}>
              <Prubeh
                prubeh={zpracovani.prubeh}
                onUpravit={upravit}
                onPokracovat={pokracovat}
                onOpakovat={() => {
                  opakovat()
                  requestAnimationFrame(() => vysledekPanel.current?.focus())
                }}
              />
            </div>
          )}
        </div>
        {zpracovani?.prubeh.podobne && <HistorickePodklady udalosti={zpracovani.prubeh.podobne} minimum={zpracovani.minimum} />}
        {zpracovani?.prubeh.faze === 'hotovo' && zpracovani.prubeh.vysledek?.zmena_pct !== undefined && (
          <GrafBTC zmenaPct={zpracovani.prubeh.vysledek.zmena_pct} />
        )}
      </Stack>
    </Container>
  )
}
