import { useId, useState } from 'react'
import { Button, Group, Stack, Text, Title } from '@mantine/core'
import { KROKY, type PrubehZpracovani } from '../prubeh'
import styles from './Prubeh.module.css'
import GrafBTC from './GrafBTC'
import { procenta } from '../ceny'

type PrubehProps = {
  prubeh: PrubehZpracovani
  onUpravit: () => void
  onPokracovat?: () => void
  onOpakovat: () => void
}

const SMERY = { up: 'Růst', down: 'Pokles', neutral: 'Neutrální' }

function bezpecnyOdkaz(hodnota: string) {
  try {
    const url = new URL(hodnota)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined
  } catch {
    return undefined
  }
}

export default function Prubeh({ prubeh, onUpravit, onPokracovat, onOpakovat }: PrubehProps) {
  const nadpisId = useId()
  const [vybrana, setVybrana] = useState<string | null>(null)
  const historicka = prubeh.podobne?.find((u) => u.datum + u.url === vybrana)
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
            {prubeh.podobne && (
              <details className={styles.detail} onToggle={(event) => { if (!event.currentTarget.open) setVybrana(null) }}>
                <summary>Historické podklady <span className={styles.pocet}>{prubeh.podobne.length}</span></summary>
                {prubeh.podobne.length === 0 ? <Text size="sm" c="dimmed">Žádné podobné události se nepodařilo najít.</Text> : (
                  <ul className={styles.udalosti}>
                    {prubeh.podobne.map((udalost, index) => (
                      <li key={index}>
                        {bezpecnyOdkaz(udalost.url) ? <a href={bezpecnyOdkaz(udalost.url)} target="_blank" rel="noreferrer">{udalost.titulek}</a> : <Text size="sm" fw={500}>{udalost.titulek}</Text>}
                        <Text size="xs" c="dimmed" mt={4}>{udalost.zdroj} · BTC {udalost.zmena_pct > 0 ? '+' : ''}{udalost.zmena_pct.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} % za 30 min</Text>
                        <Button size="compact-xs" variant="subtle" mt="xs" aria-expanded={vybrana === udalost.datum + udalost.url} onClick={() => setVybrana(vybrana === udalost.datum + udalost.url ? null : udalost.datum + udalost.url)}>{vybrana === udalost.datum + udalost.url ? 'Skrýt graf' : 'Zobrazit v grafu'}</Button>
                      </li>
                    ))}
                  </ul>
                )}
                {historicka && <GrafBTC key={vybrana} datum={historicka.datum} titulek={historicka.titulek} skutecnaZmena={historicka.zmena_pct} />}
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
