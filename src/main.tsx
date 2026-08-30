// ÚKOL 0b — zapojení Mantine (udělej hned po úkolu 0)
//
// Mantine je knihovna hotových komponent (tlačítka, karty, tabulky). Bez těchhle
// dvou řádků se komponenty vykreslí úplně bez stylů a budeš chybu hledat jinde.
//
// 1) přidej import stylů — MUSÍ být před './index.css', jinak ti Mantine
//    přepíše tvoje vlastní styly:
//        import '@mantine/core/styles.css'
// 2) přidej import poskytovatele:
//        import { MantineProvider } from '@mantine/core'
// 3) obal <App /> do <MantineProvider>...</MantineProvider>
//
// Ověření: v Cviceni.jsx zkus  import { Button } from '@mantine/core'  a vlož
// <Button>Test</Button>. Když je modré a zakulacené, je to zapojené správně.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import './index.css'
import App from './App.jsx'

// TypeScript hlásil chybu: getElementById vrací HTMLElement | null, protože
// prvek s tím id nemusí existovat. Vykřičník na konci je „non-null assertion" —
// slib kompilátoru, že tam ten prvek je. Slibovat se má jen tam, kde to víš
// jistě; tady ano, <div id="root"> je natvrdo v index.html.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </StrictMode>,
)
