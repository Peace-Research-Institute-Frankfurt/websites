import React from 'react'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Details } from '../components/Details.js'

function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}

test('renders closed by default', () => {
  render(<Details summary="Title">Content</Details>)
  expect(screen.getByText('Title')).toBeVisible()
  expect(screen.getByText('Content')).not.toBeVisible()
})

test('renders open when prop is passed', () => {
  render(
    <Details open={true} summary="Title">
      Content
    </Details>
  )
  expect(screen.getByText('Content')).toBeVisible()
})

test('opens on click', async () => {
  const { user } = setup(<Details summary="Title">Content</Details>)

  const trigger = screen.getByText('Title')

  expect(screen.getByText('Content')).not.toBeVisible()
  await user.click(trigger)
  expect(screen.getByText('Content')).toBeVisible()
})

test('is accessible', async () => {
  const main = document.createElement('main')

  const result = render(<Details summary="Summary">Content</Details>, {
    container: document.body.appendChild(main),
  })
  await expect(screen.getByText('Summary')).toBeVisible()
  await expect(result.container).toBeAccessible('Details')
})
