import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'
import './app.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      console.log('Login response: ', user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`welcome ${user.username}! How are you today?`)
    } catch (exception) {
      showNotification('Wrong credentials')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    console.log('user logged out')
    window.location.reload()
  }

  const handleBlogLike = async (blog) => {
    const likedBlog = {
      likes: blog.likes + 1 }

    try {
      const updatedBlog = await blogService.likeBlog(blog.id, likedBlog)
      setBlogs(blogs.map(b =>
        b.id === updatedBlog.id
          ? updatedBlog
          : b))
      showNotification(`Liked "${updatedBlog.title}"`)
    } catch (error) {
      console.error('Error liking blog', error)
      showNotification('Error liking blog')
    }
  }

  const handleRemove = async (blog) => {

    if (!window.confirm(`Remove blog "${blog.title}"?`)) {
      return
    }

    const updatedBlogs = blogs.filter(b => b.id !== blog.id)

    try {
      await blogService.remove(blog.id)
      setBlogs(updatedBlogs)
      showNotification(`Deleted blog ${blog.title}`)
    } catch (error) {
      console.error('Error deleting blog', error)
      showNotification('Error deleting blog')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  // console.log('newTitle is: ', newTitle)
  // console.log('newAuthor is: ', newAuthor)
  // console.log('newUrl is: ', newUrl)
  // console.log('blogs is: ', blogs)

  const addBlog = async (blogObject) => {

    try {
      const returnedBlog = await blogService.create(blogObject)
      const completeBlog = {
        ...returnedBlog,
        user: {
          username: user.username,
          name: user.name,
          id: user.id
        }
      }
      setBlogs(blogs.concat(completeBlog))
      showNotification('Blog posted successfully!')
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      console.error('Error creating blog', error)
      showNotification('Error creating blog')
    }
  }

  const showNotification = (text) => {
    setNotification(text)
    setTimeout( () => {
      setNotification(null)
    }, 4000)
  }

  const userGreeting = user && (
    <div className="user-greeting">
      <span className="username">{user.username}</span> is logged in
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  )

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>Blogs</h2>

      <Notification message={notification}/>
      {user === null && loginForm()}
      <Togglable buttonLabel='Create a new blog' ref={blogFormRef}>
        <BlogForm
          createBlog = {addBlog}
        />
      </Togglable>
      <h3>Your Blogs</h3>
      {user !== null && sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleBlogLike={handleBlogLike}
          handleRemove={handleRemove}
          user={user}
        />
      )}
      <b>{userGreeting}</b>
    </div>
  )
}

export default App