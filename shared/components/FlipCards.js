import React, { useState } from 'react'

function Card() {
  return null
}

function FlipCards({ styles, children }) {
  if (!styles) styles = {}

  const [activeCard, setActiveCard] = useState(null)

  function handleClick(i) {
    if (activeCard === i) {
      setActiveCard(null)
    } else {
      setActiveCard(i)
    }
  }

  const cards = React.Children.map(children, (child, index) => {
    const isActive = activeCard === index
    const activeClass = isActive ? styles.cardActive : ''

    return (
      <li className={`${styles.card} + ${activeClass}`} onClick={(e) => handleClick(index)}>
        <div className={styles.front}>{child.props.front}</div>
        <div className={styles.back}>{child.props.children}</div>
      </li>
    )
  })

  return <ul className={styles.container}>{cards}</ul>
}

export { FlipCards, Card }
