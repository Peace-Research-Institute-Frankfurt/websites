import { Link } from 'gatsby'
import React, { useEffect, useRef, useState } from 'react'
import Button from './ButtonAdapter.js'
import ButtonGroup from './ButtonGroup.js'
import { Field, Form } from './Form.js'
import * as styles from './EmailShareForm.module.scss'

export default function EmailShareForm({ posts }) {
  if (posts === undefined) {
    posts = []
  }

  const defaultData = { userEmail: '', targetEmails: '', message: '' }

  const captchaRef = useRef(null)
  const [location, setLocation] = useState('')
  const [flowState, setFlowState] = useState('collapsed')
  const [formLoadingState, setFormLoadingState] = useState('default')
  const [formData, setFormData] = useState(defaultData)
  const [formErrors] = useState([])

  useEffect(() => {
    setLocation(window.location.origin)
  }, [])

  // If the server-side email fails, we fall back to a mailto link
  let mailto = ''
  if (posts.length > 0) {
    const emailTitle = `Work New @ Leibniz`
    const emailBody = posts.map((p) => `${p.childMdx.frontmatter.title} – ${location}/${p.childMdx.fields.slug}`).join(`\n`)
    const to = formData.targetEmails.split(',').join(';')
    mailto = `mailto:${to}?subject=${emailTitle}&body=${encodeURIComponent(`${formData.message}\n\n${emailBody}`)}`
  }

  async function handleSubmit() {
    setFormLoadingState('loading')
    window.location.href = mailto
    setFormLoadingState('default')
    setFlowState('success')
  }
  const defaultView = (
    <>
      <Form captchaRef={captchaRef} onSubmit={handleSubmit} data={formData} setData={setFormData} errors={formErrors} loadingState={formLoadingState}>
        <Field
          state={formLoadingState === 'loading' ? 'disabled' : 'default'}
          name="userEmail"
          type="email"
          label="Ihre Email-Adresse"
          required={true}
          placeholder="you@work.com"
        />
        <Field
          state={formLoadingState === 'loading' ? 'disabled' : 'default'}
          name="targetEmails"
          type="text"
          label="Empfänger"
          required={true}
          placeholder="alice@work.com, bob@work.com"
        />
        <Field
          state={formLoadingState === 'loading' ? 'disabled' : 'default'}
          name="message"
          type="textarea"
          label="Nachricht"
          required={false}
          maxLength={400}
          placeholder=""
        />
        <ButtonGroup>
          <Button size="medium" htmlType="submit" priority="primary" as="input" label={`${posts.length} Artikel teilen`} state={formLoadingState} />
          <Button
            size="medium"
            state={formLoadingState === 'loading' && 'disabled'}
            priority="secondary"
            label="Abbrechen"
            onClick={() => setFlowState('collapsed')}
          />
        </ButtonGroup>
      </Form>
      <p className={styles.privacy}>
        Bitte beachten Sie unsere <Link to="/datenschutz">Datenschutzhinweise</Link>.
      </p>
    </>
  )

  const successView = (
    <div>
      <p className={`${styles.feedback} ${styles.success}`}>Email erfolgreich vorbereitet!</p>
      <ButtonGroup>
        <Button size="medium" onClick={() => setFlowState('collapsed')} priority="primary" state="" label="Schließen" />
        <Button size="medium" onClick={() => setFlowState('default')} priority="secondary" state="" label="Weitere Email schicken" />
      </ButtonGroup>
    </div>
  )
  const errorView = (
    <div>
      <p className={`${styles.feedback} ${styles.error}`}>
        Versand fehlgeschlagen. Versuchen Sie es in ein paar Minuten erneut oder <a href={mailto}>schicken die Email manuell</a> mit Ihrer Email-App.
      </p>
      <ButtonGroup>
        <Button size="medium" onClick={() => setFlowState('default')} state="" label="Zurück" />
        <Button size="medium" onClick={() => setFlowState('collapsed')} state="" label="Abbrechen" />
      </ButtonGroup>
    </div>
  )

  return (
    <>
      {flowState === 'collapsed' && (
        <div className={styles.toggle}>
          <Button size="medium" priority="primary" onClick={() => setFlowState('default')} label="Per Email teilen" />
        </div>
      )}
      {flowState === 'default' && <>{defaultView}</>}
      {flowState === 'success' && <>{successView}</>}
      {flowState === 'error' && <>{errorView}</>}
    </>
  )
}
