import Color from 'colorjs.io'

export default function useColors(color, isBrand) {
  if (!color) color = 'gray'

  let primary, light, dark

  if (isBrand) {
    primary = new Color('rgb(34,70,99)')
    dark = new Color('rgb(34, 70, 99)')
    light = new Color('rgb(222, 242, 251)')
  } else {
    primary = new Color(color)
    dark = new Color(color).set({ 'lch.l': 25, 'lch.c': 40, 'lch.h': (h) => h + 10 })
    light = new Color(color).set({ 'lch.l': 93, 'lch.c': 12, 'lch.h': (h) => h + 10 })
  }

  const onWhite = Math.abs(primary.contrast('white', 'APCA'))
  const onBlack = Math.abs(primary.contrast('black', 'APCA'))
  const knockout = onWhite > onBlack ? 'white' : 'black'

  return { primary: primary, dark: dark, light: light, knockout: knockout }
}
