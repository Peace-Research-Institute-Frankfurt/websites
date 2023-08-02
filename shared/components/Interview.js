import React, { useId, Children } from 'react'

function Interview({ styles, title, children }) {
  if (!styles) styles = {}
  const baseId = useId()
  const childElements = Children.toArray(children)

  const questions = childElements
    .filter((child) => {
      return child.type.name === 'InterviewQuestion'
    })
    .map((child, i) => {
      return React.cloneElement(child, {
        key: `${baseId}-question-${i}`,
      })
    })

  const participants = childElements
    .filter((child) => {
      return child.type.name === 'InterviewParticipant'
    })
    .map((child, i) => {
      return React.cloneElement(child, {
        key: `${baseId}-participant-${i}`,
      })
    })
  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {participants.length > 0 && <section className={styles.participants}>{participants}</section>}
      <ol className={styles.questions}>{questions}</ol>
    </div>
  )
}

function InterviewQuestion({ styles, q, children }) {
  if (!styles) styles = {}
  return (
    <li className={styles.question}>
      <strong className={styles.prompt}>{q}</strong>
      <div className={styles.answer}>{children}</div>
    </li>
  )
}

function InterviewParticipant({ styles, name, image, children }) {
  if (!styles) styles = {}
  return (
    <div className={styles.participant}>
      {image}
      <div className={styles.participantCopy}>
        <em className={styles.participantName}>{name}</em>
        <div className={styles.participantBio}>{children}</div>
      </div>
    </div>
  )
}

export { Interview, InterviewQuestion, InterviewParticipant }
