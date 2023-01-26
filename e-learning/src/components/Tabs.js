import React, { cloneElement } from 'react'
import { useState } from 'react'
import { useId } from 'react'
import * as styles from './Tabs.module.scss'

function Tab({ children, tabId, labelledBy, isActive }) {
  const activeClass = isActive ? styles.tabContentActive : ''
  return (
    <div className={`${styles.tabContent} ${activeClass}`} aria-labelledby={labelledBy} id={tabId}>
      {children}
    </div>
  )
}

function Tabs({ children }) {
  const baseId = useId()
  const [currentTab, setCurrentTab] = useState(0)
  function generateId(base, index) {
    return `${base}-${index}`
  }

  function handleTabClick(e, i) {
    e.preventDefault()
    setCurrentTab(i)
  }

  const filteredChildren = React.Children.toArray(children).filter((c) => c.type)
  const tabItems = filteredChildren.map((c, i) => {
    const id = generateId(baseId, i)
    const isActive = currentTab === i
    const activeClass = isActive ? styles.tabActive : ''
    const title = c.props.title
    return (
      <li key={`tabs-${i}`} className={`${styles.tab} ${activeClass}`}>
        <button type="button" onClick={(e) => handleTabClick(e, i)} aria-controls={id} role="tab">
          {title}
        </button>
      </li>
    )
  })
  const tabContent = filteredChildren.map((c, i) => {
    const props = {
      tabId: generateId(baseId, i),
      isActive: currentTab === i,
    }
    return cloneElement(c, props)
  })
  return (
    <div className={styles.container}>
      <ul className={styles.tabsList} role="tablist">
        {tabItems}
      </ul>
      <div>{tabContent}</div>
    </div>
  )
}

export { Tab, Tabs }
