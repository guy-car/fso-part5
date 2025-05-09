import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { vi } from 'vitest'

test('form calls createBlog with correct details when submitted', async () => {
  // Create a mock function for createBlog
  const mockCreateBlog = vi.fn()
  const user = userEvent.setup()

  // Render the form
  render(<BlogForm createBlog={mockCreateBlog} />)

  // Get the input fields
  const titleInput = screen.getByLabelText('Title')
  const authorInput = screen.getByLabelText('Author')
  const urlInput = screen.getByLabelText('Url')
  const saveButton = screen.getByText('save')

  // Fill in the form
  await user.type(titleInput, 'Test Blog Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://testblog.com')

  // Submit the form
  await user.click(saveButton)

  // Check that createBlog was called with the correct data
  expect(mockCreateBlog.mock.calls).toHaveLength(1)
  expect(mockCreateBlog.mock.calls[0][0]).toEqual({
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 0
  })
})