import { Container, Stack, Title } from '@mantine/core'

import VstupClanku from './components/VstupClanku'

export default function App() {
  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={2}>Predikce reakce BTC na zprávu</Title>

        {/* Vstup zatím nikam nevolá. Odeslání se napojí na backend později. */}
        <VstupClanku onOdeslat={() => {}} nacita={false} />
      </Stack>
    </Container>
  )
}
