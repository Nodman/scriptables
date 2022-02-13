export type PaletteT = {
  bgStart: string,
  bgEnd: string,
  primary: string,
  secondary: string,
  accent?: string,
}

export type DynamicPaletteT = {
  dark: PaletteT,
  light: PaletteT,
}
