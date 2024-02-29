import Color from 'colorjs.io'

export default function useColors(color) {
  if (!color) color = 'gray'
  const primary = new Color(color)

  const dark = new Color(color).set({ 'lch.l': 10, 'lch.c': 10, 'lch.h': (h) => h + 10 })

  const onWhite = Math.abs(primary.contrast('white', 'APCA'))
  const onBlack = Math.abs(primary.contrast('black', 'APCA'))
  const knockout = onWhite > onBlack ? 'white' : 'black'

  return { primary: primary, dark: dark, knockout: knockout }
}
