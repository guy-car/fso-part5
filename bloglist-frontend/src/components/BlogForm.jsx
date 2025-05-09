import { useState } from 'react'

const BlogForm = ({ 
    createBlog, 
}) => {

    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    })
    console.log('Blog posted!')
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
}

    return (
<div className="blog-form">
  <h3>Add a new blog</h3>
  <form onSubmit={addBlog}>
    <div className="form-row">
      <label>Title</label>
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
    </div>
    <div className="form-row">
      <label>Author</label>
      <input
        value={newAuthor}
        onChange={(e) => setNewAuthor(e.target.value)}
      />
    </div>
    <div className="form-row">
      <label>Url</label>
      <input
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
      />
    </div>
    <button type="submit">save</button>
  </form>  
</div>

)}

  export default BlogForm