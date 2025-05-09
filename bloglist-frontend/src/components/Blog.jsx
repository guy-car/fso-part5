import { useState } from 'react'

const Blog = ({ blog, handleBlogLike, handleRemove, user }) => {
  const [view, setView] = useState(false)

  const username = blog.user && blog.user.username
    ? <p><span>User: </span>{blog.user.username}</p>
    : null

  const removeButton = blog.user && user && blog.user.id === user.id
    ? <button className='remove-button' onClick={() => handleRemove(blog)}>remove</button>
    : null

  console.log('blog.user is: ', blog.user)
  console.log('user is: ', user)
  console.log('blog.user.id is: ', blog.user.id)
  console.log('user.id is: ', user.id)


  const blogLong = (
    <div className='blog'>
      <p><span>Title: </span>{blog.title}</p>
      <p><span>Author: </span>{blog.author}</p>
      <p><span>Url: </span>{blog.url}</p>
      <p><span>Likes: </span>{blog.likes}<button
        className='small-button'
        onClick={() => handleBlogLike(blog)}>
        like</button></p>
      {username}
      <button className='small-button' onClick={() => setView(!view)}>hide</button>
      {removeButton}
    </div>
  )

  const blogShort = (
    <div className='blog'>
      <p>{blog.title}<button className='small-button' onClick={() => setView(!view)}>view</button></p>
    </div>

  )

  return (
    view? blogLong : blogShort
  )
}

export default Blog