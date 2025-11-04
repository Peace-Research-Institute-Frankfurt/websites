import Color from 'colorjs.io'

export default function useColors(color, isBrand, year, isAppendix = false) {
  if (!color) color = 'gray'

  let primary, light, dark

  // Anhang/Annex = immer Blau, unabhängig vom Jahr
  if (isAppendix) {
    primary = new Color('rgb(34,70,99)')
    dark = new Color('rgb(34,70,99)')
    light = new Color('rgb(222,242,251)')
  } else {
    const isAfter2024 = year >= 2025

    if (!isAfter2024) {
      // 2024: unverändert
      if (isBrand) {
        primary = new Color('rgb(34,70,99)')
        dark = new Color('rgb(34,70,99)')
        light = new Color('rgb(222,242,251)')
      } else {
        primary = new Color(color)
        dark = new Color(color).set({ 'lch.l': 25, 'lch.c': 40, 'lch.h': (h) => h + 10 })
        light = new Color(color).set({ 'lch.l': 93, 'lch.c': 12, 'lch.h': (h) => h + 10 })
      }
    } else {
      // 2025+: umgekehrt
      if (isBrand) {
        primary = new Color(color)
        dark = new Color(color).set({ 'lch.l': 25, 'lch.c': 40, 'lch.h': (h) => h + 10 })
        light = new Color(color).set({ 'lch.l': 93, 'lch.c': 12, 'lch.h': (h) => h + 10 })
      } else {
        primary = new Color('rgb(34,70,99)')
        dark = new Color('rgb(34,70,99)')
        light = new Color('rgb(222,242,251)')
      }
    }
  }

  const onWhite = Math.abs(primary.contrast('white', 'APCA'))
  const onBlack = Math.abs(primary.contrast('black', 'APCA'))
  const knockout = onWhite > onBlack ? 'white' : 'black'

  return { primary, dark, light, knockout }
}