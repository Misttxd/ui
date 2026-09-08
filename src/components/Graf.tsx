import { Text } from '@mantine/core'

// ═══════════════════════════════════════════════════════════════════════════
// ÚKOLY M, N — svíčkový graf
// ═══════════════════════════════════════════════════════════════════════════
//
// POZOR: tenhle soubor nemá smysl dělat, dokud nemáš hotový úkol K na backendu
// (předpočítaná cenová okna a endpoint /candles/{id}). Bez něj není co kreslit.
//
// Napiš komponentu obecně, ať slouží na dvou místech:
//   • u historické události — okno kolem publikace, značka v okamžiku zprávy
//   • u predikce — aktuální cena a čárkovaně vyznačený odhad rozsahu
//
// Celá syntaxe včetně useRef, useEffect a lightweight-charts verze 5
// je v UKOLY_APLIKACE.md, úkoly M a N. Návody z internetu jsou často pro
// verzi 4 a nebudou fungovat.

// ÚKOL M1 — typ jedné svíčky
//
// Napiš si `type Svicka` s časem a čtyřmi čísly: open, high, low, close.
// Čas chce knihovna v sekundách od roku 1970, ne jako ISO text.

// ÚKOL M2 — props
//
// Rozmysli si, co komponenta potřebuje zvenčí. Nabízí se:
//   • `id` — podle čeho si stáhne svíčky z backendu
//   • `casZnacky` — kdy vyšla zpráva, aby ji šlo vyznačit (nepovinné)
//   • `linky` — cenové úrovně na vyznačení rozsahu (nepovinné, pro úkol N)
//
// Nepovinné props se píšou s otazníkem, stejně jako `dotazy_modelu`.

type GrafProps = {
  id: string
}

// ÚKOL M3 — načtení svíček
//
// První `useEffect` stáhne data z `/candles/{id}` a uloží je do stavu.
// Nezapomeň na proměnnou `zruseno` v úklidu — bez ní se `setSvicky` zavolá
// na komponentě, která už neexistuje.
//
// ÚKOL M4 — vykreslení
//
// Druhý `useEffect` vytvoří graf, jakmile data dorazí. Potřebuje `useRef`
// na ten `<div>`, do kterého knihovna kreslí.
//
// V úklidu MUSÍ být `graf.remove()`. Bez toho zůstane graf v paměti a po pár
// rozkliknutích se stránka zpomalí.
//
// ÚKOL M5 — vyznač okamžik zprávy
//
// `createSeriesMarkers`. Bez téhle značky graf nic neříká — celá pointa je
// vidět, kde v tom pohybu ta zpráva vyšla.
//
// ÚKOL M6 — co ukázat, než data dorazí
//
// `Skeleton` nebo `Loader`. Skeleton je klidnější, protože stránka
// neposkakuje.
//
// ÚKOL N2 — cenové linky (jen u predikce)
//
// `rada.createPriceLine(...)` s `lineStyle: 2` pro čárkovanou čáru.
// Z grafu musí být na první pohled jasné, co je skutečná cena a co odhad,
// a u grafu musí být napsáno, že jde o odhad modelu.

export default function Graf({ id }: GrafProps) {
  return <Text c="dimmed">Graf pro {id} zatím není hotový (úkoly K a M).</Text>
}
