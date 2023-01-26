import React, { useState } from 'react'
import * as styles from './FlipCards.module.scss'

function Card() {
  return null
}

function FlipCards({ children }) {
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

  // const cardElements = cards.map((c, i) => {
  //   return <Card key={i} isActive={activeCard === i} front={c.front} back={c.back} clickHandler={handleClick} index={i} />;
  // });
  return (
    <>
      <ul className={styles.container}>{cards}</ul>
    </>
  )
}

export { FlipCards, Card }
