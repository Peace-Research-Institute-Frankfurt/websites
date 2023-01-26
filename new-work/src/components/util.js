const gra = function (min, max) {
  return Math.random() * (max - min) + min
}

const gri = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export { gra, gri }
