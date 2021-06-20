import React, { useState } from 'react'
import Button from './Button'

const Blog = ({
  blog, like, user, handleDelete,
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} className="blog">
      { blog.title}
      {' '}
      {blog.author}
      <Button
        text={visible ? 'hide' : 'show'}
        id="show"
        handleClick={toggleVisibility}
      />
      <div className="blogDetails" style={showWhenVisible}>
        {blog.url}
        <br />
        <span>likes </span>
        <span id="like-count">{blog.likes}</span>
        <Button
          text="like"
          id="like"
          handleClick={() => like(blog)}
        />
        <br />
        {blog.user ? blog.user.name : ''}
        <br />
        {blog.user && user.username === blog.user.username
          ? <Button id="remove" text="remove" handleClick={() => handleDelete(blog.id)} /> : ''}
      </div>
    </div>
  )
}

export default Blog
