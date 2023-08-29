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
  const [formErrors, setFormErrors] = useState([])

  useEffect(() => {
    setLocation(window.location.origin)
  }, [])

  let flattenedPosts = []
  if (posts.length > 0) {
    flattenedPosts = posts.map((p) => {
      let authors = ''
      if (p.childMdx.frontmatter.authors) {
        authors = p.childMdx.frontmatter.authors
          .map((a) => {
            return a.frontmatter.name
          })
          .join(', ')
      }
      return {
        title: p.childMdx.frontmatter.title,
        authors: authors,
        link: `${location}/${p.childMdx.fields.slug}`,
        origin: location,
      }
    })
  }

  // If the server-side email fails, we fall back to a mailto link
  let mailto = ''
  if (posts.length > 0) {
    const emailTitle = `Work New @ Leibniz`
    const emailBody = posts.map((p) => `${p.childMdx.frontmatter.title} – ${location}/${p.childMdx.fields.slug}`).join(`\n`)
    const to = formData.targetEmails.split(',').join(';')
    mailto = `mailto:${to}?subject=${emailTitle}&body=${encodeURIComponent(`${formData.message}\n\n${emailBody}\n\nPasswort: Leibniz123\n\n`)}`
  }

  async function handleSubmit() {
    setFormLoadingState('loading')
    const res = await fetch('/.netlify/functions/triggerShareEmail', {
      method: 'POST',
      body: JSON.stringify({
        userEmail: formData['userEmail'],
        targetEmails: formData['targetEmails'].split(','),
        message: formData['message'],
        posts: flattenedPosts,
        origin: location,
      }),
    })
    setFormLoadingState('default')
    if (res.status === 200) {
      const data = await res.json()
      if (data.errors) {
        setFormErrors(data.errors)
      } else {
        setFlowState('success')
      }
    } else {
      setFlowState('error')
    }
  }
  const defaultView = (
    <>
      <Form
        className={styles.form}
        captchaRef={captchaRef}
        onSubmit={handleSubmit}
        data={formData}
        setData={setFormData}
        errors={formErrors}
        loadingState={formLoadingState}
      >
        <Field
          state={formLoadingState === 'loading' && 'disabled'}
          name="userEmail"
          type="email"
          label="Deine Email-Adresse"
          required={true}
          placeholder="you@work.com"
        />
        <Field
          state={formLoadingState === 'loading' && 'disabled'}
          name="targetEmails"
          type="text"
          label="Empfänger"
          required={true}
          placeholder="alice@work.com, bob@work.com"
        />
        <Field
          state={formLoadingState === 'loading' && 'disabled'}
          name="message"
          type="textarea"
          label="Nachricht"
          required={false}
          maxLength={400}
          placeholder=""
        />
        <ButtonGroup>
          <Button htmlType="submit" priority="primary" as="input" label={`${posts.length} Artikel teilen`} state={formLoadingState} />
          <Button
            state={formLoadingState === 'loading' && 'disabled'}
            priority="secondary"
            label="Abbrechen"
            onClick={() => setFlowState('collapsed')}
          />
        </ButtonGroup>
      </Form>
      <p className={styles.privacy}>
        Bitte beachte unsere <Link to="/datenschutz">Datenschutzhinweise</Link> wenn du diese Funktion benutzt.
      </p>
    </>
  )

  const successView = (
    <div>
      <p className={`${styles.feedback} ${styles.success}`}>Email erfolgreich verschickt!</p>
      <ButtonGroup>
        <Button onClick={() => setFlowState('collapsed')} priority="primary" state="" label="Schließen" />
        <Button onClick={() => setFlowState('default')} priority="secondary" state="" label="Weitere Email schicken" />
      </ButtonGroup>
    </div>
  )
  const errorView = (
    <div>
      <p className={`${styles.feedback} ${styles.error}`}>
        Versand fehlgeschlagen. Versuch es in ein paar Minuten erneut oder <a href={mailto}>schick die Email manuell</a> mit deiner Email-App.
      </p>
      <ButtonGroup>
        <Button onClick={() => setFlowState('default')} state="" label="Zurück" />
        <Button onClick={() => setFlowState('collapsed')} state="" label="Abbrechen" />
      </ButtonGroup>
    </div>
  )

  return (
    <>
      {flowState === 'collapsed' && (
        <div className={styles.toggle}>
          <Button priority="secondary" onClick={() => setFlowState('default')} label="Per Email teilen" />
        </div>
      )}
      {flowState === 'default' && <>{defaultView}</>}
      {flowState === 'success' && <>{successView}</>}
      {flowState === 'error' && <>{errorView}</>}
    </>
  )
}
