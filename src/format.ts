// ═══════════════════════════════════════════════════════════════════════════
// ÚKOL E — formátování data a čísel
// ═══════════════════════════════════════════════════════════════════════════
//
// Syntaxe je v UKOLY_APLIKACE.md, úkol E. Sem si ji přepiš do funkcí, ať ji
// nemusíš psát na každém místě znovu.
//
// Zatím tu funkce jen vracejí hodnotu tak, jak přišla — nic se neformátuje.
// Tvoje práce je je dopsat.


// ÚKOL E1 — datum
//
// Backend posílá "2022-04-01T18:12:00Z". Uživateli ukaž čitelné datum.
// Rozmysli si, jestli chceš i čas — u 30minutového cíle je čas podstatný.
//
// TODO: převeď na Date a naformátuj přes toLocaleString nebo toLocaleDateString
export function formatujDatum(datum: string): string {
  return datum
}


// ÚKOL E2 — podobnost
//
// Backend posílá číslo 0 až 1, třeba 0.644.
// Rozhodni se, jestli ukážeš "0,64" nebo "64 %". Procenta jsou čitelnější,
// ale nejsou to procenta v pravém smyslu — je to kosinová podobnost. Když
// zvolíš procenta, napiš to v rozhraní do vysvětlivky.
//
// TODO: zaokrouhli přes toFixed
export function formatujPodobnost(podobnost: number): string {
  return String(podobnost)
}


// ÚKOL E3 — změna ceny
//
// Backend posílá procentní změnu, třeba 0.22 nebo -0.41.
// Kladná změna by měla mít znaménko +, aby bylo na první pohled poznat,
// kterým směrem se cena pohnula.
//
// TODO: zaokrouhli a u kladných čísel přidej "+"
export function formatujZmenu(zmena_pct: number): string {
  return String(zmena_pct)
}


// ÚKOL E4 — barva podle třídy
//
// Používá se na Badge u predikce i u každé události. Drž ji jednotnou
// v celé aplikaci: down červená, neutral šedá, up zelená.
//
// Tenhle jeden ti dám hotový, protože ho budeš potřebovat hned v úkolu D.
export const BARVY_TRID = { down: 'red', neutral: 'gray', up: 'green' }
