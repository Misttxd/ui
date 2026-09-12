import { useEffect, useRef, useState } from 'react'
import { predikujPrubezne } from './api'
import type { PrubehZpracovani } from './prubeh'
import type { Rezim, ZdrojClanku } from './zdrojClanku'

type Zpracovani = {
  zdroj: ZdrojClanku
  rezim: Rezim
  potvrzeno: boolean
  textVstupu?: string
  prubeh: PrubehZpracovani
}

export default function useZpracovani() {
  const [zpracovani, setZpracovani] = useState<Zpracovani | null>(null)
  const pozadavek = useRef<AbortController | null>(null)

  useEffect(() => () => { pozadavek.current?.abort() }, [])

  function zpet() {
    pozadavek.current?.abort()
    pozadavek.current = null
    setZpracovani(null)
  }

  async function spust(
    zdroj: ZdrojClanku,
    rezim: Rezim,
    potvrzeno = false,
    textVstupu?: string,
  ) {
    pozadavek.current?.abort()
    const controller = new AbortController()
    pozadavek.current = controller

    const zadani = { zdroj, rezim, potvrzeno, textVstupu }

    setZpracovani({ ...zadani, prubeh: {
      faze: 'vstup', hotove: [], zprava: 'Předávám článek ke zpracování.',
    } })

    try {
      const vstup = textVstupu !== undefined
        ? { text: textVstupu }
        : zdroj.typ === 'odkaz' ? { url: zdroj.url } : { text: zdroj.text }

      await predikujPrubezne({ ...vstup, rezim, pokracovat_i_tak: potvrzeno }, (prubeh) => {
        if (controller.signal.aborted || pozadavek.current !== controller) return
        setZpracovani({ ...zadani, prubeh })
      }, controller.signal)
    } catch (chyba) {
      if (controller.signal.aborted || pozadavek.current !== controller) return
      setZpracovani((predchozi) => predchozi ? {
        ...predchozi,
        prubeh: {
          ...predchozi.prubeh,
          faze: 'chyba',
          zprava: chyba instanceof Error ? chyba.message : 'Článek se nepodařilo zpracovat.',
        },
      } : null)
    } finally {
      if (pozadavek.current === controller) pozadavek.current = null
    }
  }

  function opakovat() {
    if (zpracovani) void spust(
      zpracovani.zdroj, zpracovani.rezim, zpracovani.potvrzeno, zpracovani.textVstupu,
    )
  }

  function pokracovat() {
    if (zpracovani?.prubeh.faze !== 'varovani' || !zpracovani.prubeh.text_vstupu) return
    void spust(zpracovani.zdroj, zpracovani.rezim, true, zpracovani.prubeh.text_vstupu)
  }

  return { zpracovani, spust, zpet, opakovat, pokracovat }
}
