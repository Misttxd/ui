// Pomocné funkce na formátování. Jsou tady zvlášť, protože je potřebuje víc
// komponent — kdyby byly v každé zvlášť, musel bys změnu dělat na víc místech.

// Backend posílá datum jako "2022-04-01T18:12:00Z" (formát ISO).
// new Date() z toho udělá objekt data, toLocaleString ho vypíše česky.
// Čas necháváme, protože u 30minutového cíle je podstatný.
export function formatujDatum(datum: string): string {
  return new Date(datum).toLocaleString('cs-CZ')
}

// Podobnost přijde jako číslo 0 až 1, třeba 0.644. Vynásobením stem
// a zaokrouhlením z toho vyjde "64 %". toFixed(0) znamená nula desetinných míst.
export function formatujPodobnost(podobnost: number): string {
  return (podobnost * 100).toFixed(0) + ' %'
}

// Procentní změna ceny. U kladných čísel přidáváme +, aby byl směr vidět
// na první pohled; minus si JavaScript doplní sám.
export function formatujZmenu(zmena_pct: number): string {
  return (zmena_pct > 0 ? '+' : '') + zmena_pct.toFixed(2) + ' %'
}

// Barvy tříd. Drží se jednotné v celé aplikaci, aby červená vždycky znamenala
// pokles. Používá se u predikce i u každé historické události.
export const BARVY_TRID = { down: 'red', neutral: 'gray', up: 'green' }
