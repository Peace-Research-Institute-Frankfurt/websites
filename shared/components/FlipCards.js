import React, { useState } from 'react'

function Card({front, children, active, styles, index, onClick}) {
  return(
    <li className={`${styles.card} + ${active ? styles.active : null}`} onClick={(e) => onClick(index)}>
        <div className={styles.front}>{front}</div>
        <div className={styles.back}>{children}</div>
      </li>
  )
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
    return (React.cloneElement(child, {styles: styles, active: activeCard === index, onClick: handleClick, index: index}))
  })

  return <ul className={styles.container}>{cards}</ul>
}

export { FlipCards, Card }
