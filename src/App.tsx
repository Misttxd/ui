// ÚKOL 0 — propojení souborů (import / export)
//
// Cviceni.jsx končí řádkem `export default function Cviceni()`. Slovo `default`
// znamená, že soubor vyváží jednu hlavní věc a při importu si pro ni můžeš
// zvolit libovolné jméno.
//
// Naimportuj ji sem a vlož do JSX níž jako <Cviceni />.
// Cesta se píše relativně a u vlastních souborů začíná ./ nebo ../
//
//   import Cviceni from './cviceni/Cviceni'
//
// Pak spusť `npm run dev` a zkontroluj, že se stránka zobrazí.

import Cviceni from './cviceni/Cviceni'
import Cviceni2 from './cviceni/Cviceni2'

import { Container, Stack, Textarea, Button, Loader, Alert, Badge } from '@mantine/core'

export default function App() {
  return (
    <>
    <Container size={"sm"}>
        <Stack>
          <Cviceni2 />  
      </Stack>
    </Container>
      
      
    </>
  )
}
