import React from 'react'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { FlipCards, Card } from '../components/FlipCards.js'

function setup(jsx) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}

// test('Renders closed by default', () => {
//   render(<Details summary="Title">Content</Details>)
//   expect(screen.getByText('Title')).toBeVisible()
//   expect(screen.getByText('Content')).not.toBeVisible()
// })

// test('Opens on click', async () => {
//   const { user } = setup(<Details summary="Title">Content</Details>)

//   const trigger = screen.getByText('Title')

//   expect(screen.getByText('Content')).not.toBeVisible()
//   await user.click(trigger)
//   expect(screen.getByText('Content')).toBeVisible()
// })

test('is accessible', async () => {
  const main = document.createElement('main')

  const result = render(
    <FlipCards>
      <Card front={'Title 1'}>Content 1</Card>
      <Card front={'Title 2'}>Content 2</Card>
    </FlipCards>,
    {
      container: document.body.appendChild(main),
    }
  )
  await expect(result.container).toBeAccessible('Cards')
})
