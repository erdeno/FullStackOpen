import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogValue, setBlogValue] = useState({ title: '', author: '', url: '' })
  const handleSubmit = async (event) => {
    event.preventDefault()
    const { title } = blogValue
    const { author } = blogValue
    const { url } = blogValue
    const blogObject = {
      title,
      author,
      url,
    }
    createBlog(blogObject)
    setBlogValue({ title: '', author: '', url: '' })
  }

  const handleChange = (event) => {
    // eslint-disable-next-line no-unused-vars
    const { name } = event.target
    const newBlogValue = { ...blogValue }
    newBlogValue[name] = event.target.value
    setBlogValue(newBlogValue)
  }

  return (
    <form onSubmit={handleSubmit}>
      <br />
      title
      <input
        value={blogValue.title}
        name="title"
        id="title"
        onChange={handleChange}
      />
      <br />
      author
      <input
        name="author"
        id="author"
        value={blogValue.author}
        onChange={handleChange}
      />
      <br />
      url
      <input
        name="url"
        id="url"
        value={blogValue.url}
        onChange={handleChange}
      />
      <br />
      <button id="create-button" type="submit">create</button>
    </form>
  )
}
export default BlogForm
