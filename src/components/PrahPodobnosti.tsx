import { useId } from 'react'
import styles from './PrahPodobnosti.module.css'

export default function PrahPodobnosti({ value, disabled, onChange }: {
  value: number; disabled: boolean; onChange: (value: number) => void
}) {
  const id = useId()
  return <div className={styles.panel}>
    <div className={styles.hlavicka}>
      <label htmlFor={id}>Minimální podobnost podkladů</label>
      <span className={styles.cislo}>
        <input aria-label="Minimální podobnost v procentech" type="number" min={0} max={100} step={1} value={value} disabled={disabled}
          onChange={(event) => { const n = event.currentTarget.valueAsNumber; if (Number.isFinite(n)) onChange(Math.max(0, Math.min(100, Math.round(n)))) }} /> %
      </span>
    </div>
    <input id={id} className={styles.slider} type="range" min={0} max={100} step={1} value={value} disabled={disabled}
      aria-valuetext={`${value} procent`} aria-describedby={`${id}-popis`} onChange={(event) => onChange(Number(event.currentTarget.value))} />
    <div className={styles.popisky}><span>0 % · širší souvislosti</span><span>100 % · těsná shoda</span></div>
    <p id={`${id}-popis`} className={styles.napoveda}>Vyšší práh obvykle znamená méně podkladů. Nemusí projít žádný.</p>
  </div>
}
