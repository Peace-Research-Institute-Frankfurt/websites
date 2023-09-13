import HCaptcha from '@hcaptcha/react-hcaptcha'
import React from 'react'
import Warning from '../images/warning.svg'
import { TextArea } from './Textarea'
import * as styles from './Form.module.scss'

const HCAPTCHA_SITE_KEY = '517bbe8f-3822-4493-b2bd-59c6b58a2da0'

const Form = function ({ data, className, errors, loadingState, onSubmit, setData, children, captchaRef }) {
  const handleSubmit = function (e) {
    e.preventDefault()
    onSubmit()
  }

  const handleChange = function (fieldName, fieldValue) {
    setData((prev) => {
      const newData = { ...prev }
      newData[fieldName] = fieldValue
      return newData
    })
  }

  const fields = React.Children.map(children, (child, index) => {
    const fieldErrors = errors.filter((err) => {
      return err.field === child.props.name
    })
    const fieldValue = data[child.props.name]
    const props = {
      id: `field-${index}`,
      errors: fieldErrors,
      value: fieldValue,
      captchaRef: captchaRef,
      onChange: handleChange,
    }
    return React.cloneElement(child, props)
  })

  return (
    <form className={className ? className : ''} onSubmit={handleSubmit}>
      {fields}
    </form>
  )
}

const CaptchaInput = ({ name, onChange, captchaRef }) => {
  function handleVerify(token) {
    onChange(name, token)
  }
  const onLoad = () => {
    captchaRef.current.execute()
  }
  return (
    <div className={styles.captcha}>
      <HCaptcha sitekey={HCAPTCHA_SITE_KEY} onLoad={onLoad} onVerify={handleVerify} ref={captchaRef} />
    </div>
  )
}

const EmailInput = ({ value, id, placeholder, required, name, state, onChange }) => {
  return (
    <input
      value={value}
      type="email"
      id={id}
      disabled={state === 'disabled'}
      state={state}
      placeholder={placeholder}
      required={required}
      onChange={(e) => {
        onChange(name, e.target.value)
      }}
    />
  )
}

const TextInput = ({ value, id, placeholder, required, name, state, onChange }) => {
  return (
    <input
      value={value}
      type="text"
      id={id}
      disabled={state === 'disabled'}
      placeholder={placeholder}
      required={required}
      onChange={(e) => {
        onChange(name, e.target.value)
      }}
    />
  )
}

const Field = ({ type, state, value, name, placeholder, label, required, id, errors, onChange, maxLength, captchaRef }) => {
  const hasError = errors.length > 0
  return (
    <div className={`${styles.field} ${hasError && styles.error} ${state && styles[state]}`} key={id}>
      {type !== 'captcha' && (
        <label htmlFor={id}>
          <span>{label}</span>
          {required !== true && <span className={styles.isRequired}>(Optional)</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {type === 'text' && (
          <TextInput onChange={onChange} value={value} placeholder={placeholder} required={required} id={id} name={name} state={state} />
        )}
        {type === 'email' && (
          <EmailInput state={state} onChange={onChange} value={value} placeholder={placeholder} required={required} id={id} name={name} />
        )}
        {type === 'textarea' && (
          <TextArea
            state={state}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            required={required}
            id={id}
            maxLength={maxLength}
            name={name}
          />
        )}
        {type === 'captcha' && <CaptchaInput name={name} onChange={onChange} captchaRef={captchaRef} />}
        {hasError && (
          <div className={styles.errorIndicator}>
            <Warning />
            Error
          </div>
        )}
      </div>

      {hasError && (
        <ul className={styles.fieldErrors}>
          {errors.map((err, i) => {
            return (
              <li key={`${id}-error-${i}`} className={styles.fieldError}>
                {err.message}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export { Form, Field }
