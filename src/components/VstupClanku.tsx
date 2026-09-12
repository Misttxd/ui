import { useRef, useState, type DragEvent } from 'react'
import { Badge, Box, Button, CloseButton, FileButton, Group, SegmentedControl, Stack, Text, Textarea } from '@mantine/core'
import { POVOLENE_SOUBORY, type Rezim, type ZdrojClanku } from '../zdrojClanku'
import useVstupClanku from './useVstupClanku'
import styles from './VstupClanku.module.css'

export type { Rezim } from '../zdrojClanku'

type VstupClankuProps = {
  onOdeslat: (zdroj: ZdrojClanku, rezim: Rezim) => void
  nacita: boolean
  onZmena?: () => void
}

export default function VstupClanku({ onOdeslat, nacita, onZmena }: VstupClankuProps) {
  const { editor, resetVyberu, ...vstup } = useVstupClanku(nacita, onZmena)
  const [rezim, setRezim] = useState<Rezim>('prosty')
  const [pretahuje, setPretahuje] = useState(false)
  const hloubkaPretazeni = useRef(0)

  function pretazeni(event: DragEvent<HTMLDivElement>) {
    if (!event.dataTransfer.types.includes('Files')) return
    event.preventDefault()
    event.dataTransfer.dropEffect = vstup.zamceno ? 'none' : 'copy'
  }

  return (
    <form onSubmit={(event) => {
      event.preventDefault()
      const zdroj = vstup.zdroj()
      if (zdroj) {
        onOdeslat(zdroj, rezim)
      }
    }}>
      <Stack gap="md">
        <Box
          className={styles.vstup}
          data-pretahuje={(pretahuje && !vstup.zamceno) || undefined}
          aria-busy={vstup.cteSoubor}
          onDragOver={pretazeni}
          onDragEnter={(event) => {
            if (!event.dataTransfer.types.includes('Files')) return
            event.preventDefault()
            hloubkaPretazeni.current += 1
            setPretahuje(true)
          }}
          onDragLeave={() => {
            hloubkaPretazeni.current = Math.max(0, hloubkaPretazeni.current - 1)
            if (hloubkaPretazeni.current === 0) setPretahuje(false)
          }}
          onDrop={(event) => {
            if (!event.dataTransfer.types.includes('Files')) return
            event.preventDefault()
            hloubkaPretazeni.current = 0
            setPretahuje(false)
            void vstup.nactiSoubory(Array.from(event.dataTransfer.files))
          }}
        >
          <Stack gap="sm">
            <Textarea
              ref={editor}
              label="Článek"
              description={vstup.soubor
                ? 'Načtený text můžeš před použitím upravit.'
                : 'Vlož text nebo odkaz na článek. Soubor můžeš přiložit i přetáhnout sem.'}
              value={vstup.obsah}
              onChange={(event) => vstup.zmenText(event.currentTarget.value)}
              placeholder="Text článku nebo https://…"
              autosize minRows={6} maxRows={14}
              readOnly={nacita}
              disabled={vstup.cteSoubor}
              error={vstup.chyba || undefined}
              classNames={{ input: styles.editor }}
            />

            {vstup.soubor && (
              <Group gap="xs" wrap="nowrap" className={styles.zdroj}>
                <Badge color="gray" variant="light">Soubor</Badge>
                <Text size="sm" truncate className={styles.nazev}>{vstup.soubor.nazev}</Text>
                <CloseButton aria-label="Odebrat soubor a vrátit rozepsaný text" title="Odebrat soubor a vrátit rozepsaný text" size="lg" disabled={vstup.zamceno} onClick={vstup.odeberSoubor} />
              </Group>
            )}

            {vstup.odkaz && (
              <Group gap="xs" wrap="nowrap" className={styles.zdroj} role="status">
                <Badge color="gray" variant="light">Odkaz rozpoznán</Badge>
                <Text size="sm" truncate className={styles.nazev}>{new URL(vstup.odkaz).hostname}</Text>
              </Group>
            )}

            <Group justify="space-between" gap="xs">
              <FileButton resetRef={resetVyberu} onChange={(soubor) => { if (soubor) void vstup.nactiSoubory([soubor]) }} accept={POVOLENE_SOUBORY} disabled={vstup.zamceno}>
                {(props) => <Button {...props} type="button" variant="default" loading={vstup.cteSoubor} disabled={vstup.zamceno}>
                  {vstup.soubor ? 'Změnit soubor' : 'Přiložit soubor'}
                </Button>}
              </FileButton>
              <Text size="xs" c="dimmed">{vstup.odkaz ? 'Webový zdroj' : `${vstup.obsah.length.toLocaleString('cs-CZ')} znaků`}</Text>
            </Group>
            <Text size="xs" c="dimmed" role="status">
              {pretahuje && !vstup.zamceno ? 'Pusť sem jeden soubor s článkem.' : 'TXT nebo Markdown · do 2 MB'}
            </Text>
          </Stack>
        </Box>

        <Group justify="space-between" align="flex-end" className={styles.ovladani}>
          <Stack gap={6} className={styles.rezim}>
            <Text size="sm" fw={500}>Režim vyhledávání</Text>
            <SegmentedControl value={rezim} onChange={(hodnota) => { setRezim(hodnota as Rezim); onZmena?.() }} disabled={vstup.zamceno} aria-label="Režim vyhledávání" data={[
              { label: 'Klasický RAG', value: 'prosty' },
              { label: 'Agentní RAG', value: 'agentni' },
            ]} />
          </Stack>
          <Button type="submit" color="dark" disabled={!vstup.zdroj()} className={styles.odeslat}>
            {nacita ? 'Zpracovávám…' : 'Zpracovat článek'}
          </Button>
        </Group>

      </Stack>
    </form>
  )
}
