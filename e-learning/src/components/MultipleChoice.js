import React from 'react'
import * as styles from './Quiz.module.scss'
import Check from '../assets/icons/check.svg'

const Choice = function (props) {
  function handleChange(e) {
    props.handleChange(props.questionId, props.choiceId)
  }

  return (
    <label className={props.checked ? styles.radioChoiceChecked : styles.radioChoice} htmlFor={props.id}>
      <input data-index={props.index} checked={props.checked} type="checkbox" name={props.name} id={props.id} onChange={handleChange} />
      {props.value}

      {props.correct && props.resultsVisible && (
        <span className={styles.correctIndicator}>
          (Correct Answer)
          <Check />
        </span>
      )}
    </label>
  )
}

export { Choice }
