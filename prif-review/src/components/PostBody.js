import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import Figure from './FigureAdapter'
import Quote from '@shared/components/Quote'
import Button from './ButtonAdapter'
import { InterviewAdapter, InterviewQuestionAdapter, InterviewParticipantAdapter } from './InterviewAdapter'
import Notes from './Notes'
import Callout from '@shared/components/Callout'
import Leadin from './Leadin'
import { Flowchart, FlowchartNode } from './Flowchart'
import { Person, PersonList } from './Person'
import { Number, NumberList } from './Number'
import * as QuoteStyles from './Quote.module.scss'
import * as CalloutStyles from './Callout.module.scss'

const shortCodes = {
  Figure,
  Notes,
  Leadin,
  Flowchart,
  FlowchartNode,
  Person,
  PersonList,
  Number,
  NumberList,
  Callout: ({ ...props }) => <Callout {...props} buttonComponent={Button} styles={CalloutStyles} />,
  Quote: ({ ...props }) => <Quote {...props} styles={QuoteStyles} />,
  Interview: ({ ...props }) => <InterviewAdapter {...props} />,
  InterviewQuestion: ({ ...props }) => <InterviewQuestionAdapter {...props} />,
  InterviewParticipant: ({ ...props }) => <InterviewParticipantAdapter {...props} />,
}

export default function PostBody({ children }) {
  return <MDXProvider components={shortCodes}>{children}</MDXProvider>
}
