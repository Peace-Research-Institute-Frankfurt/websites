import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import Figure from './FigureAdapter'
import { Interview, InterviewQuestion } from '@shared/components/Interview'
import * as InterviewStyles from './Interview.module.scss'

const shortCodes = {
  Figure,
  Interview: ({ ...props }) => <Interview styles={InterviewStyles} {...props} />,
  InterviewQuestion: ({ ...props }) => <InterviewQuestion styles={InterviewStyles} {...props} />,
}

export default function PostBody({ children }) {
  return <MDXProvider components={shortCodes}>{children}</MDXProvider>
}
