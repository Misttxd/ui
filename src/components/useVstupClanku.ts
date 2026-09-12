import { useEffect, useRef, useState } from 'react'
import { prectiSoubor, rozpoznejOdkaz, type PrilozenySoubor, type ZdrojClanku } from '../zdrojClanku'

export default function useVstupClanku(nacita: boolean, onZmena?: () => void) {
  const [text, setText] = useState('')
  const [soubor, setSoubor] = useState<PrilozenySoubor | null>(null)
  const [cteSoubor, setCteSoubor] = useState(false)
  const [chyba, setChyba] = useState<string | null>(null)
  const poradiCteni = useRef(0)
  const resetVyberu = useRef<() => void>(null)
  const editor = useRef<HTMLTextAreaElement>(null)
  const obsah = soubor ? soubor.text : text
  const odkaz = soubor ? { url: null, chyba: null } : rozpoznejOdkaz(text)
  const zamceno = nacita || cteSoubor

  useEffect(() => () => { poradiCteni.current += 1 }, [])

  function zmenText(hodnota: string) {
    if (soubor) setSoubor({ ...soubor, text: hodnota })
    else setText(hodnota)
    setChyba(null)
    onZmena?.()
  }

  async function nactiSoubory(soubory: File[]) {
    if (zamceno || soubory.length === 0) return
    resetVyberu.current?.()
    setChyba(null)
    if (soubory.length !== 1) {
      setChyba('Vlož jeden článek najednou. Vyber prosím jen jeden soubor.')
      return
    }
    const poradi = ++poradiCteni.current
    setCteSoubor(true)
    try {
      const nacteny = await prectiSoubor(soubory[0])
      if (poradi === poradiCteni.current) {
        setSoubor(nacteny)
        onZmena?.()
      }
    } catch (potiz) {
      if (poradi === poradiCteni.current) {
        setChyba(potiz instanceof Error ? potiz.message : 'Soubor se nepodařilo přečíst.')
      }
    } finally {
      if (poradi === poradiCteni.current) setCteSoubor(false)
    }
  }

  function odeberSoubor() {
    setSoubor(null)
    setChyba(null)
    onZmena?.()
    resetVyberu.current?.()
    editor.current?.focus()
  }

  function zdroj(): ZdrojClanku | null {
    if (!obsah.trim() || odkaz.chyba || zamceno) return null
    if (soubor) return { typ: 'soubor', nazev: soubor.nazev, text: soubor.text.trim() }
    if (odkaz.url) return { typ: 'odkaz', url: odkaz.url }
    return { typ: 'text', text: text.trim() }
  }

  return {
    obsah, soubor, cteSoubor, chyba: chyba ?? odkaz.chyba, odkaz: odkaz.url,
    zamceno, editor, resetVyberu,
    zmenText, nactiSoubory, odeberSoubor, zdroj,
  }
}
