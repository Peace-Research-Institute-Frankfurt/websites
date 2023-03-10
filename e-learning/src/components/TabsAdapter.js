import React from 'react'
import { Tabs, Tab } from '@shared/components/Tabs'
import * as TabStyles from './Tabs.module.scss'

const TabsAdapter = ({ ...props }) => <Tabs styles={TabStyles} {...props} />
const TabAdapter = ({ ...props }) => <Tab styles={TabStyles} {...props} />

export { TabsAdapter as Tabs, TabAdapter as Tab }
