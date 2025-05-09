import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'

test('renders title but not URL or likes by default', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User',
      id: '123456'
    }
  }

  // Mock functions for the props
  const mockHandleBlogLike = vi.fn()
  const mockHandleRemove = vi.fn()
  const user = {
    username: 'testuser',
    name: 'Test User',
    id: '123456'
  }

  // Render the component
  render(
    <Blog
      blog={blog}
      handleBlogLike={mockHandleBlogLike}
      handleRemove={mockHandleRemove}
      user={user}
    />
  )

  // Check that title is rendered
  const titleElement = screen.getByText('Test Blog Title', { exact: false })
  expect(titleElement).toBeDefined()

  // Check that URL and likes are not rendered
  const urlElement = screen.queryByText('https://testblog.com', { exact: false })
  const likesElement = screen.queryByText('Likes: 5', { exact: false })

  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('URL and likes are shown when the view button is clicked', async () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User',
      id: '123456'
    }
  }

  const mockHandleBlogLike = vi.fn()
  const mockHandleRemove = vi.fn()
  const user = {
    username: 'testuser',
    name: 'Test User',
    id: '123456'
  }

  render(
    <Blog
      blog={blog}
      handleBlogLike={mockHandleBlogLike}
      handleRemove={mockHandleRemove}
      user={user}
    />
  )

  // Set up user-event
  const userEvent1 = userEvent.setup()

  // Find and click the view button
  const viewButton = screen.getByText('view')
  await userEvent1.click(viewButton)

  // Check that URL and likes are now visible
  const urlSpan = screen.getByText('Url:', { exact: false })
  const urlValue = screen.getByText('https://testblog.com', { exact: false })
  const likesSpan = screen.getByText('Likes:', { exact: false })

  expect(urlSpan).toBeDefined()
  expect(urlValue).toBeDefined()
  expect(likesSpan).toBeDefined()
})

test('like button calls event handler twice when clicked twice', async () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User',
      id: '123456'
    }
  }

  const mockHandleBlogLike = vi.fn()
  const mockHandleRemove = vi.fn()
  const user = {
    username: 'testuser',
    name: 'Test User',
    id: '123456'
  }

  render(
    <Blog
      blog={blog}
      handleBlogLike={mockHandleBlogLike}
      handleRemove={mockHandleRemove}
      user={user}
    />
  )

  // Set up user-event
  const userEvent1 = userEvent.setup()

  // First, we need to show the blog details by clicking the view button
  const viewButton = screen.getByText('view')
  await userEvent1.click(viewButton)

  // Now find and click the like button twice
  const likeButton = screen.getByText('like')
  await userEvent1.click(likeButton)
  await userEvent1.click(likeButton)

  // Check that the event handler was called twice
  expect(mockHandleBlogLike.mock.calls).toHaveLength(2)
})