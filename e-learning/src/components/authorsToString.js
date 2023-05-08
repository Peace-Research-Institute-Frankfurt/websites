export default function authorsToString(authors) {
  let authorNames = ''
  if (authors.length === 1) {
    authorNames = authors[0].frontmatter.name
  } else {
    authorNames += authors
      .slice(0, -1)
      .map((el) => el.frontmatter.name)
      .join(', ')
    authorNames += ` and ${authors[authors.length - 1].frontmatter.name}`
  }
  return authorNames
}
