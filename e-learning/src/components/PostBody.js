import React from 'react'
import { MDXProvider } from '@mdx-js/react'

import Button from './ButtonAdapter'
import { Embed } from './EmbedAdapter'
import EmbedChoices from './EmbedChoicesAdapter'
import FigureAdapter from './FigureAdapter'
import Institution from './Institution'
import LectureVideo from './LectureVideo'
import Map from './Map'
import LayeredMap from './LayeredMap'
import MapLegend from './MapLegend'
import MarkerLayer from './MarkerLayer'
import BarGraph from './charts/BarGraph'
import PieChart from './charts/PieChart'
import LineChart from './charts/LineChart'
import CountryStatisticsLayer from './CountryStatisticsLayer'
import { Choice } from './MultipleChoice'
import { Question, Quiz, RadioChoice } from './Quiz.js'
import QuoteAdapter from './QuoteAdapter'
import Resolution from './Resolution'
import { Tab, Tabs } from './TabsAdapter'
import TermAdapter from './TermAdapter'
import Treaty from './Treaty'
import Related from './Related'
import Callout from '@shared/components/Callout'
import { Details, DetailsGroup } from '@shared/components/Details'
import { Event, Timeline } from '@shared/components/Timeline'
import { FlipCards, Card } from '@shared/components/FlipCards'

import * as CalloutStyles from './Callout.module.scss'
import * as DetailsStyles from './Details.module.scss'
import * as FigureStyles from './Figure.module.scss'
import * as FlipCardsStyles from './FlipCards.module.scss'
import * as QuoteStyles from './Quote.module.scss'
import * as TermStyles from './Term.module.scss'
import * as TimelineStyles from './Timeline.module.scss'

const shortCodes = {
  Embed,
  EmbedChoices,
  Quiz,
  RadioChoice,
  Question,
  Choice,
  Resolution,
  Treaty,
  Institution,
  Tab,
  Tabs,
  Related,
  Quote: ({ ...props }) => <QuoteAdapter {...props} styles={QuoteStyles} />,
  Term: ({ ...props }) => <TermAdapter styles={TermStyles} {...props} />,
  Figure: ({ ...props }) => <FigureAdapter styles={FigureStyles} {...props} />,
  LectureVideo,
  Event: ({ ...props }) => <Event styles={TimelineStyles} {...props} />,
  Timeline: ({ ...props }) => <Timeline styles={TimelineStyles} {...props} />,
  FlipCards: ({ ...props }) => <FlipCards styles={FlipCardsStyles} {...props} />,
  Card: ({ ...props }) => <Card styles={FlipCardsStyles} {...props} />,
  Details: ({ ...props }) => <Details {...props} styles={DetailsStyles} />,
  DetailsGroup: ({ ...props }) => <DetailsGroup {...props} styles={DetailsStyles} />,
  Callout: ({ ...props }) => <Callout {...props} buttonComponent={Button} styles={CalloutStyles} />,
  Map,
  LayeredMap,
  MapLegend,
  MarkerLayer,
  CountryStatisticsLayer,
  ColumnBreak: () => <></>,
  BarGraph,
  PieChart,
  LineChart
}

const PostBody = ({ content }) => {
  return <MDXProvider components={shortCodes}>{content}</MDXProvider>
}

export default PostBody
