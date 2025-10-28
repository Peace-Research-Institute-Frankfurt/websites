import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import Callout from '@shared/components/Callout'
import Leadin from './Leadin'
import Figure from './FigureAdapter'
import Button from './ButtonAdapter'
import Quote from '@shared/components/Quote'
import Chevron from '../images/chevron.svg'
import Aside from './Aside'
import TermsList from './TermsList'
import TermAdapter from './TermAdapter'
import Table from './Table'
import * as CalloutStyles from './Callout.module.scss'
import * as QuoteStyles from './Quote.module.scss'
import * as styles from './PostBody.module.scss'

const shortCodes = {
  Aside,
  Callout: ({ ...props }) => <Callout expandable={false} buttonComponent={Button} {...props} styles={CalloutStyles} />,
  Chevron,
  Figure,
  Leadin,
  Term: ({ ...props }) => <TermAdapter {...props} />,
  TermsList,
  Table,
  Quote: ({ ...props }) => <Quote {...props} styles={QuoteStyles} />,
}

export default function PostBody({ children }) {
  return (
    <section className={styles.container}>
      <MDXProvider components={shortCodes}>{children}</MDXProvider>
    </section>
  )
}
