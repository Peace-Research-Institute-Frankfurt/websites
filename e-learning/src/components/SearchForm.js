import React, { useState } from 'react'
import { useFlexSearch } from 'react-use-flexsearch'
import { graphql, useStaticQuery, navigate } from 'gatsby'
import { useCombobox } from 'downshift'
import * as styles from './SearchForm.module.scss'

function DropdownCombobox({ value, setValue, inputItems }) {
  const { isOpen, getLabelProps, getMenuProps, getInputProps, highlightedIndex, getItemProps, selectedItem, selectItem } = useCombobox({
    items: inputItems,
    defaultInputValue: value,
    onInputValueChange: ({ inputValue }) => {
      setValue(inputValue)
    },
    onSelectedItemChange: ({ selectedItem }) => {
      navigate(`/${selectedItem.unit}/${selectedItem.slug}`)
    },
    itemToString: (item) => {
      if (item) {
        return item.title
      }
      return ''
    },
  })
  return (
    <div className={styles.container}>
      <label {...getLabelProps()}>Search:</label>
      <div>
        <input
          {...getInputProps({
            onKeyDown: (event) => {},
          })}
          data-testid="combobox-input"
        />
        <button data-testid="clear-button" onClick={() => selectItem(null)}>
          Clear
        </button>
      </div>
      <ul className={styles.choices} {...getMenuProps({})}>
        {true &&
          inputItems.map((item, index) => (
            <li
              className={`${styles.choice} ${highlightedIndex === index ? styles.selected : ''}`}
              key={`${item}.${index}`}
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
  const [query, setQuery] = useState('a')
  const index = data.search.index
  const store = data.search.store
  const results = useFlexSearch(query, index, store)

  return <DropdownCombobox value={query} setValue={setQuery} inputItems={results.slice(0, 5)} />
}

export { SearchForm }
