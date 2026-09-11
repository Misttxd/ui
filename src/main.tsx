import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Styly Mantine musí být načtené dřív než vlastní index.css, jinak by je
// Mantine přepsalo.
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import './index.css'

import App from './App'

// getElementById vrací HTMLElement | null. Vykřičník je slib, že prvek
// existuje — tady oprávněný, <div id="root"> je natvrdo v index.html.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </StrictMode>,
)
