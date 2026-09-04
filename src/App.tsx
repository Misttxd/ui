import { useState } from 'react'
import { Container, Stack, Alert, Badge, Text, Title } from '@mantine/core'

import VstupClanku from './components/1VstupClanku'
import { predikuj } from './api'
import type { Odpoved } from './api'

const BARVY = { down: 'red', neutral: 'gray', up: 'green' }

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
          <Stack gap="xs">
            {vysledek.predikce === null ? (
              <Text>Model neodpověděl použitelnou třídou.</Text>
            ) : (
              <Badge color={BARVY[vysledek.predikce]} size="lg">
                {vysledek.predikce}
              </Badge>
            )}
            <Text size="sm" c="dimmed">
              režim: {vysledek.rezim}
            </Text>
            <Text>{vysledek.jadro_dotazu}</Text>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}
