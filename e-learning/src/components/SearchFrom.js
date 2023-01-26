import React, { useState } from 'react'
import { useFlexSearch } from 'react-use-flexsearch'
import { graphql, useStaticQuery } from 'gatsby'

function SearchForm() {
  const data = useStaticQuery(graphql`
    query {
      search: localSearchChapters {
        index
        store
      }
    }
  `)
  const [query, setQuery] = useState('')
  const index = data.search.index
  const store = data.search.store
  const results = useFlexSearch(query, index, store)

  function handleChange(e) {
    setQuery(e.target.value)
  }

  function handleFocus() {}

  return (
    <>
      <input type="search" value={query} onChange={handleChange} onFocus={handleFocus} />
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </>
  )
}

export { SearchForm }
