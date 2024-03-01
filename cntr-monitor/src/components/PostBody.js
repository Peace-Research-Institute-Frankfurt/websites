import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import Callout from '@shared/components/Callout'
import Leadin from './Leadin'
import Figure from './FigureAdapter'
import Button from './ButtonAdapter'
import Quote from '@shared/components/Quote'
import Chevron from '../images/chevron.svg'
import * as CalloutStyles from './Callout.module.scss'
import * as QuoteStyles from './Quote.module.scss'
import * as styles from './PostBody.module.scss'

const shortCodes = {
  Leadin,
  Figure,
  Chevron,
  Callout: ({ ...props }) => <Callout {...props} buttonComponent={Button} styles={CalloutStyles} />,
  Quote: ({ ...props }) => <Quote {...props} styles={QuoteStyles} />,
}

export default function PostBody({ children }) {
  return (
    <section className={styles.container}>
      <MDXProvider components={shortCodes}>{children}</MDXProvider>
    </section>
  )
}
