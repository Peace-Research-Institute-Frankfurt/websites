import { MDXProvider } from '@mdx-js/react'
import React from 'react'
import Figure from './FigureAdapter'
import Quote from '@shared/components/Quote'
import Button from './ButtonAdapter'
import { InterviewAdapter, InterviewQuestionAdapter, InterviewParticipantAdapter } from './InterviewAdapter'
import Notes from './Notes'
import Callout from '@shared/components/Callout'
import Leadin from './Leadin'
import { Map } from './Map'
import { PRIFNetworkLayer } from './PRIFNetworkLayer'
import CountriesLayer from './CountriesLayer'
import { Flowchart, FlowchartNode } from './Flowchart'
import { Person, PersonList } from './Person'
import { Number, NumberList } from './Number'
import { IconChart, IconChartGroup } from './IconChart'
import * as QuoteStyles from './Quote.module.scss'
import * as CalloutStyles from './Callout.module.scss'
import * as styles from './PostBody.module.scss'

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
  IconChart,
  IconChartGroup,
  Map,
  CountriesLayer,
  PRIFNetworkLayer,
  Callout: ({ ...props }) => <Callout {...props} buttonComponent={Button} styles={CalloutStyles} />,
  Quote: ({ ...props }) => <Quote {...props} styles={QuoteStyles} />,
  Interview: ({ ...props }) => <InterviewAdapter {...props} />,
  InterviewQuestion: ({ ...props }) => <InterviewQuestionAdapter {...props} />,
  InterviewParticipant: ({ ...props }) => <InterviewParticipantAdapter {...props} />,
}

export default function PostBody({ children }) {
  return (
    <section className={styles.container}>
      <MDXProvider components={shortCodes}>{children}</MDXProvider>
    </section>
  )
}
