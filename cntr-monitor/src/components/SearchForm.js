import React, { useState } from 'react'
import { useFlexSearch } from 'react-use-flexsearch'
import { graphql, useStaticQuery, navigate } from 'gatsby'
import { useCombobox } from 'downshift'
import SearchIcon from '../images/search.svg'
import * as styles from './SearchForm.module.scss'
import { useTranslation } from 'react-i18next'

function DropdownCombobox({ value, setValue, inputItems }) {
  const { t } = useTranslation()
  const { isOpen, getLabelProps, getMenuProps, getInputProps, highlightedIndex, getItemProps } = useCombobox({
    items: inputItems,
    defaultInputValue: value,
    onInputValueChange: ({ inputValue }) => {
      setValue(inputValue)
    },
    onSelectedItemChange: ({ selectedItem }) => {
      const localePrefix = `${selectedItem.locale === 'de' ? '' : `${selectedItem.locale}/`}`
      const issue = selectedItem.issue ? `${selectedItem.issue}/` : ''
      const path = `/${localePrefix}${issue}${selectedItem.slug}`
      navigate(path)
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
      <label className={styles.label} htmlFor="search" {...getLabelProps()}>
        <span className={styles.labelText}>Search</span>
        <SearchIcon />
      </label>
      <input className={styles.input} placeholder={t('Search...')} {...getInputProps()} data-testid="combobox-input" />
      <ul className={`${styles.choices} ${isOpen && inputItems.length > 0 ? styles.choicesActive : ''}`} {...getMenuProps({})}>
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
              <span className={styles.choiceTitle}>
                {item.postType === 'issue' && 'Monitor '}
                {item.title}
              </span>
              {(item.issue || item.authors) && (
                <span className={styles.choiceMeta}>
                  {item.issue && item.issue}
                  {item.authors && item.authors.length > 0 && ` ·  ${item.authors.split(';').join(', ')}`}
                </span>
              )}
            </li>
          ))}
      </ul>
    </div>
  )
}

function SearchForm({ addActiveTerm }) {
  const data = useStaticQuery(graphql`
    query {
      search: localSearchPosts {
        index
        store
      }
    }
  `)
  const { i18n } = useTranslation()
  const [query, setQuery] = useState('')
  const index = data.search.index
  const store = data.search.store
  const results = useFlexSearch(query, index, store)
    .filter((result) => {
      console.log(i18n)
      console.log(result)
      return result.locale === i18n.language
    })
    .slice(0, 5)

  return <DropdownCombobox value={query} setValue={setQuery} inputItems={results} addActiveTerm={addActiveTerm} />
}

export default SearchForm
