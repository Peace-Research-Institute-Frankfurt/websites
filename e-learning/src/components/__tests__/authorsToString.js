import authorsToString from '../authorsToString'

const testAuthors = [{ frontmatter: { name: 'Alice' } }, { frontmatter: { name: 'Bob' } }, { frontmatter: { name: 'Charlie' } }]

test('Lists one author', () => {
  expect(authorsToString([testAuthors[0]])).toBe('Alice')
})
test('Lists two authors', () => {
  expect(authorsToString(testAuthors.slice(0, 2))).toBe('Alice and Bob')
})
test('Lists three authors', () => {
  expect(authorsToString(testAuthors)).toBe('Alice, Bob and Charlie')
})
