import { useState } from 'react'
import { Container, Stack, Alert, Title, Divider } from '@mantine/core'

import VstupClanku from './components/VstupClanku'
import Predikce from './components/Predikce'
import DotazyModelu from './components/DotazyModelu'
import SeznamUdalosti from './components/SeznamUdalosti'
import Srovnani from './components/Srovnani'
import { predikuj } from './api'
import type { Odpoved } from './api'

// ═══════════════════════════════════════════════════════════════════════════
// App — drží stav celé aplikace a skládá stránku
// ═══════════════════════════════════════════════════════════════════════════
//
// Stav je tady, protože ho potřebuje víc komponent naráz. Dolů se posílá propy,
// nahoru se hlásí funkcemi — to je ten jednosměrný tok dat z úkolu 9.
//
// ÚKOL — rozvržení je na tobě
//
// Pořadí sekcí, nadpisy, oddělovače, šířka. Zkus si nechat navrhnout vzhled
// podle PROMPTY_DESIGN.md a pak sem přenes, co se ti bude líbit.
//
// ÚKOL O6 — až budeš mít streamování (úkol L)
//
// Přidej stav `faze` a vykresli `<Prubeh faze={faze} />` místo pouhého
// kolečka na tlačítku.

export default function App() {
  const [nacita, setNacita] = useState(false)
  const [vysledek, setVysledek] = useState<Odpoved | null>(null)
  const [chyba, setChyba] = useState<string | null>(null)

  return (
    <Container size="sm" py="xl">
      <Stack>
        <Title order={2}>Predikce pohybu BTC ze zprávy</Title>

        <VstupClanku
          nacita={nacita}
          onOdeslat={async (text, rezim) => {
            setChyba(null)
            setNacita(true)
            try {
              setVysledek(await predikuj(text, rezim))
            } catch (potiz) {
              setChyba(potiz instanceof Error ? potiz.message : 'Neznámá chyba')
              setVysledek(null)
            } finally {
              setNacita(false)
            }
          }}
        />

        {chyba !== null && (
          <Alert color="red" title="Chyba">
            {chyba}. Běží backend a Ollama?
          </Alert>
        )}

        {vysledek !== null && (
          <>
            <Divider />
            <Predikce vysledek={vysledek} />

            <Divider label="Co model hledal" />
            <DotazyModelu dotazy={vysledek.dotazy_modelu} />

            <Divider label="Nalezené historické události" />
            <SeznamUdalosti udalosti={vysledek.podobne} />
          </>
        )}

        <Divider label="Srovnání metod" />
        <Srovnani />
      </Stack>
    </Container>
  )
}
