import Color from 'colorjs.io'

export default function useColors(color) {
  const text = new Color(color)

  const background = new Color(color).set({ 'lch.l': 95, 'lch.c': 2, 'lch.h': (h) => h + 10 })

  const onWhite = Math.abs(text.contrast('white', 'APCA'))
  const onBlack = Math.abs(text.contrast('black', 'APCA'))
  const knockout = onWhite > onBlack ? 'white' : 'black'

  return { text: text, background: background, knockout: knockout }
}
