import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import Figure from './FigureAdapter'
import Quote from '@shared/components/Quote'
import { Interview, InterviewQuestion } from '@shared/components/Interview'
import * as InterviewStyles from './Interview.module.scss'
import * as QuoteStyles from './Quote.module.scss'

const shortCodes = {
  Figure,
  Quote: ({ ...props }) => <Quote {...props} styles={QuoteStyles} />,
  Interview: ({ ...props }) => <Interview styles={InterviewStyles} {...props} />,
  InterviewQuestion: ({ ...props }) => <InterviewQuestion styles={InterviewStyles} {...props} />,
}

export default function PostBody({ children }) {
  return <MDXProvider components={shortCodes}>{children}</MDXProvider>
}
