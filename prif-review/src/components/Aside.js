import React from "react"
import * as styles from "./Aside.module.scss"

const Aside = ({title, children}) => {
  return (
    <aside className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
    </aside>
  )
}

export default Aside