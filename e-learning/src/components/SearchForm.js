import React, { useState } from 'react'
import { useFlexSearch } from 'react-use-flexsearch'
import { graphql, useStaticQuery } from 'gatsby'
import { useCombobox } from 'downshift'

function DropdownCombobox({ value, setValue, inputItems }) {
  const { isOpen, getToggleButtonProps, getLabelProps, getMenuProps, getInputProps, highlightedIndex, getItemProps, selectedItem, selectItem } =
    useCombobox({
      items: inputItems,
      onInputValueChange: ({ inputValue }) => {
        setValue(inputValue)
      },
    })
  return (
    <div>
      <label {...getLabelProps()}>Search:</label>
      <div>
        <input {...getInputProps()} data-testid="combobox-input" />
        <button aria-label="toggle menu" data-testid="combobox-toggle-button" {...getToggleButtonProps()}>
          {isOpen ? <>&#8593;</> : <>&#8595;</>}
        </button>
        <button aria-label="toggle menu" data-testid="clear-button" onClick={() => selectItem(null)}>
          &#10007;
        </button>
      </div>
      <ul {...getMenuProps()}>
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              style={{
                padding: '4px',
                backgroundColor: highlightedIndex === index ? '#bde4ff' : null,
              }}
              key={`${item}${index}`}
              {...getItemProps({
                item,
                index,
              })}
            >
              {item.title}
            </li>
          ))}
      </ul>
    </div>
  )
}

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

  return (
    <>
      <DropdownCombobox value={query} setValue={setQuery} inputItems={results} />
      <ul>
        {results.map((result) => (
          <li>{JSON.stringify(result)}</li>
        ))}
      </ul>
    </>
  )
}

export { SearchForm }
