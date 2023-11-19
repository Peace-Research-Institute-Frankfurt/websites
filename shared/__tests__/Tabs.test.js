import React from 'react'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Tab, Tabs } from '../components/Tabs.js'

const testTabs = (
  <Tabs testid="container">
    <Tab title="Tab A Trigger">Tab A content</Tab>
    <Tab title="Tab B Trigger">Tab B content</Tab>
    <Tab title="Tab C Trigger">Tab C content</Tab>
  </Tabs>
)

function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}

test('Shows only the first tab on load', () => {
  render(testTabs)
  expect(screen.getByText('Tab A content')).toBeVisible()
  expect(screen.getByText('Tab B content')).not.toBeVisible()
  expect(screen.getByText('Tab C content')).not.toBeVisible()
})

test('Shows the other tabs on click', async () => {
  const { user } = setup(testTabs)

  const tabATrigger = screen.getByText('Tab A Trigger')
  const tabBTrigger = screen.getByText('Tab B Trigger')
  const tabCTrigger = screen.getByText('Tab C Trigger')

  expect(screen.getByText('Tab A content')).toBeVisible()

  await user.click(tabBTrigger)
  expect(screen.getByText('Tab A content')).not.toBeVisible()
  expect(screen.getByText('Tab B content')).toBeVisible()
  expect(screen.getByText('Tab C content')).not.toBeVisible()

  await user.click(tabCTrigger)
  expect(screen.getByText('Tab A content')).not.toBeVisible()
  expect(screen.getByText('Tab B content')).not.toBeVisible()
  expect(screen.getByText('Tab C content')).toBeVisible()

  await user.click(tabATrigger)
  expect(screen.getByText('Tab A content')).toBeVisible()
  expect(screen.getByText('Tab B content')).not.toBeVisible()
  expect(screen.getByText('Tab C content')).not.toBeVisible()
})

test('Shows the other tabs on tab', async () => {
  const { user } = setup(testTabs)

  const tabATrigger = screen.getByText('Tab A Trigger')
  const tabBTrigger = screen.getByText('Tab B Trigger')
  const tabCTrigger = screen.getByText('Tab C Trigger')

  expect(document.body).toHaveFocus()

  await user.tab()
  expect(tabATrigger).toHaveFocus()

  await user.tab()
  expect(tabBTrigger).toHaveFocus()

  await user.tab()
  expect(tabCTrigger).toHaveFocus()
})
