// vite-imagetools transforms images at build time.
// The query-string imports (e.g. ?format=webp&w=630) are resolved by Vite
// and return a plain string URL. The @ts-ignore comments suppress TS errors
// on those specific import lines since TypeScript doesn't support query-param
// module declaration patterns.
