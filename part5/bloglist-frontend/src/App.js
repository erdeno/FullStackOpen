import React, { useState, useEffect, useRef } from 'react'

import BlogForm from './components/BlogForm'
import Blogs from './components/Blogs'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((b) => setBlogs(b))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const localUser = JSON.parse(loggedUserJSON)
      setUser(localUser)
      blogService.setToken(localUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(loggedUser),
      )
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      setMessage({ success: `${loggedUser.username} Logged in successfully` })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage({ error: 'Wrong username or password' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }
  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const blogFormRef = useRef()
  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setMessage({ success: `a new blog ${blogObject.title} by ${blogObject.author}` })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleLike = async (blogObject) => {
    const changedBlog = { ...blogObject, likes: blogObject.likes + 1 }
    const returnedBlog = await blogService.update(blogObject.id, changedBlog)
    setBlogs(blogs.map((b) => (b.id !== blogObject.id ? b : returnedBlog)))
  }
  const handleDelete = async (id) => {
    const blogToDelete = blogs.find((i) => i.id === id)
    // eslint-disable-next-line no-alert
    if (window.confirm(`Delete ${blogToDelete.title} by ${blogToDelete.author}?`)) {
      await blogService.deleteBlog(blogToDelete.id)
      setBlogs(blogs.filter((b) => b.id !== id))
      setMessage({ success: `Deleted ${blogToDelete.title} by ${blogToDelete.author}` })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <Notification message={message} />
      {
        user === null ? (
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        )
          : (
            <div>
              <p>
                {
                  user.name
                }
                <span> logged-in </span>
                <button type="submit" onClick={handleLogout}>logout</button>
              </p>
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm
                  createBlog={createBlog}
                />
              </Togglable>
              <Blogs
                blogs={blogs}
                like={handleLike}
                user={user}
                handleDelete={handleDelete}
              />
            </div>
          )
      }
      <Footer />
    </div>
  )
}

export default App
