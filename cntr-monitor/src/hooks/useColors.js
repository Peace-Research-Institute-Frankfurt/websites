import Color from 'colorjs.io'

export default function useColors(color) {
  if (!color) color = 'gray'
  const primary = new Color(color)

  const dark = new Color(color).set({ 'lch.l': 25, 'lch.c': 40, 'lch.h': (h) => h + 10 })
  const light = new Color(color).set({ 'lch.l': 92, 'lch.c': 7, 'lch.h': (h) => h + 10 })

  const onWhite = Math.abs(primary.contrast('white', 'APCA'))
  const onBlack = Math.abs(primary.contrast('black', 'APCA'))
  const knockout = onWhite > onBlack ? 'white' : 'black'

  return { primary: primary, dark: dark, light: light, knockout: knockout }
}
