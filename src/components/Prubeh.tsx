import { useId } from 'react'
import { Button, Group, Progress, Stack, Text, Title } from '@mantine/core'
import { KROKY, type PrubehZpracovani } from '../prubeh'
import styles from './Prubeh.module.css'
import { procenta } from '../ceny'

type PrubehProps = {
  prubeh: PrubehZpracovani
  onUpravit: () => void
  onPokracovat?: () => void
  onOpakovat: () => void
}

const SMERY = { up: 'Růst', down: 'Pokles', neutral: 'Neutrální' }

export default function Prubeh({ prubeh, onUpravit, onPokracovat, onOpakovat }: PrubehProps) {
  const nadpisId = useId()
  const { faze, vysledek } = prubeh
  const hotovo = faze === 'hotovo'
  const problem = faze === 'chyba' || faze === 'varovani'
  const bezi = !hotovo && !problem && faze !== 'cekani'
  const nadpis = hotovo ? 'Analýza dokončena' : problem ? 'Zpracování přerušeno' : faze === 'cekani' ? 'Článek je připravený' : 'Zpracovávám článek'

  return (
    <section aria-labelledby={nadpisId} className={styles.panel}>
      <Stack gap="md" className={styles.obsah}>
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            {faze === 'zpracovani' && <span className={styles.loader} aria-hidden="true" />}
            <Title order={2} size="h4" id={nadpisId}>{nadpis}</Title>
          </Group>
          {bezi && <Button type="button" variant="subtle" size="compact-sm" color="gray" onClick={onUpravit} className={styles.tlacitko}>Zrušit čekání</Button>}
        </Group>
        <Text size="xs" c="dimmed" role="status" aria-atomic="true">{problem ? 'Pro pokračování je potřeba tvoje pozornost.' : prubeh.zprava}</Text>

        <ol className={styles.kroky} aria-label="Průběh zpracování">
          {KROKY.map((krok) => {
            const dokonceno = prubeh.hotove.includes(krok.id)
            const aktivni = faze === krok.id
            return (
              <li key={krok.id} className={styles.krok} data-stav={dokonceno ? 'hotovo' : aktivni ? 'aktivni' : 'ceka'} aria-current={aktivni ? 'step' : undefined}>
                <span className={styles.znacka} aria-hidden="true">
                  {dokonceno ? <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg> : aktivni ? <span className={styles.loader} /> : <span className={styles.tecka} />}
                </span>
                <span className={styles.nazevKroku}>{krok.nazev}</span>
                <span className={styles.stavKroku}>{dokonceno ? 'Hotovo' : aktivni ? 'Probíhá' : problem || faze === 'zpracovani' ? '' : 'Čeká'}</span>
              </li>
            )
          })}
        </ol>

        {problem && (
          <div className={styles.problem} data-varovani={faze === 'varovani' || undefined}>
            <div role="alert">
              <Text fw={500} size="sm">{faze === 'varovani' ? 'Vstup nemusí být použitelný' : 'Zpracování se nepodařilo dokončit'}</Text>
              <Text size="sm" mt={6}>{prubeh.zprava}</Text>
            </div>
            <Group gap="xs" mt="md" className={styles.akce}>
              {(faze === 'varovani' ? !!onPokracovat : prubeh.lzeOpakovat !== false) && (
                <Button type="button" color="dark" onClick={faze === 'varovani' ? onPokracovat : onOpakovat}>
                  {faze === 'varovani' ? 'Pokračovat i tak' : 'Zkusit znovu'}
                </Button>
              )}
              <Button type="button" variant="default" onClick={onUpravit}>{faze === 'varovani' ? 'Zrušit' : 'Upravit vstup'}</Button>
            </Group>
          </div>
        )}

        {hotovo && vysledek && (
          <div className={styles.vysledek}>
            <Text size="xs" c="dimmed">Odhad reakce BTC · 30 minut po zprávě</Text>
            <Text size="xl" fw={600} mt={4}>{vysledek.predikce ? SMERY[vysledek.predikce] : 'Model nevrátil platnou predikci'}</Text>
            {vysledek.zmena_pct !== undefined && <Text size="sm">{procenta(vysledek.zmena_pct)} za 30 minut</Text>}
            {vysledek.opora_pct !== undefined && <Stack gap={6} mt="md">
              <Group justify="space-between"><Text size="sm">Historická opora</Text><Text size="sm" fw={600}>{vysledek.opora_pct.toLocaleString('cs-CZ')} %</Text></Group>
              <Progress value={vysledek.opora_pct} color={vysledek.opora_pct < 100 / 3 ? 'red' : vysledek.opora_pct < 200 / 3 ? 'orange' : 'green'} aria-label="Historická opora" />
              <Text size="xs" c="dimmed">{vysledek.podobne.length === 0 ? 'Bez historických podkladů. Model vychází pouze z článku a obecných znalostí.' : `${vysledek.podobne.length} podkladů · minimální podobnost ${vysledek.min_podobnost} %`}</Text>
              <Text size="xs" c="dimmed" title="Skóre kombinuje průměrnou podobnost, počet různých událostí a shodu historických směrů. Nejde o měřenou úspěšnost predikce.">Orientační skóre podkladů, nikoli pravděpodobnost správné predikce.</Text>
            </Stack>}
          </div>
        )}

        {(prubeh.jadro || prubeh.podobne) && (
          <div className={styles.podklady}>
            {prubeh.jadro && (
              <details className={styles.detail}>
                <summary>Zestručněný článek</summary>
                <Text size="sm" className={styles.text}>{prubeh.jadro}</Text>
              </details>
            )}
            {!!vysledek?.dotazy_modelu?.length && (
              <details className={styles.detail}>
                <summary>Co model hledal</summary>
                <ul className={styles.udalosti}>
                  {vysledek.dotazy_modelu.map((dotaz, index) => <li key={index}><Text size="sm" className={styles.text}>{dotaz.dotaz}</Text><Text size="xs" c="dimmed">Nalezeno: {dotaz.nalezeno}</Text></li>)}
                </ul>
              </details>
            )}
            {vysledek?.predikce === null && vysledek.surova_odpoved && (
              <details className={styles.detail}>
                <summary>Odpověď modelu</summary>
                <Text size="sm" className={styles.text}>{vysledek.surova_odpoved}</Text>
              </details>
            )}
          </div>
        )}
      </Stack>
    </section>
  )
}
