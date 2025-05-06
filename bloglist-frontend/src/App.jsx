import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './app.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

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
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
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
        setErrorMessage(null)
      }, 5000)
    }
}

const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  console.log('user logged out')
  window.location.reload()
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

const blogForm = () => (
  <div>
    <h3>Add a new blog</h3>
    <form onSubmit={addBlog} className="blog-form">
      <label>Title
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      </label>
      <label>Author
        <input
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
        />
      </label>
      <label>Url
        <input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
      </label>
      <button type="submit">save</button>
    </form>  
  </div>
)

// console.log('newTitle is: ', newTitle)
// console.log('newAuthor is: ', newAuthor)
// console.log('newUrl is: ', newUrl)

const addBlog = (event) => {
  event.preventDefault()
  const blogObject = {
    title: newTitle,
    author: newAuthor,
    url: newUrl
  }
  showNotification('Blog posted successfully!')
  blogService.create(blogObject).then((returnedBlog) => {
    setBlogs(blogs.concat(returnedBlog))
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  })
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
  return (
    <div>
      <h2>blogs</h2>
      <b>{userGreeting}</b>
      <Notification message={notification}/>
      {user === null && loginForm()}
      {user !== null && blogForm()}
      <h3>Your Blogs</h3>
      {user !== null && blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App