import React, { useId } from 'react'

function Interview({ styles, children }) {
  if (!styles) styles = {}
  const baseId = useId()
  const questions = React.Children.map(children, (child, i) => {
    return React.cloneElement(child, {
      key: `${baseId}-${i}`,
    })
  })
  return (
    <div className={styles.container}>
      <ol>{questions}</ol>
    </div>
  )
}
function InterviewQuestion({ styles, q, children }) {
  if (!styles) styles = {}
  return (
    <li className={styles.question}>
      <strong class={styles.prompt}>{q}</strong>
      <div className={styles.answer}>{children}</div>
    </li>
  )
}

export { Interview, InterviewQuestion }
