const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// eslint-disable-next-line consistent-return
blogsRouter.post('/', async (request, response) => {
  const { body } = request
  const loggedUser = request.user
  if (body.title === undefined && body.url === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  if (!loggedUser) {
    return response.status(401).json({ error: 'token missing' })
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0,
    user: loggedUser,

  })
  const savedBlog = await blog.save()
  // eslint-disable-next-line no-underscore-dangle
  loggedUser.blogs = loggedUser.blogs.concat(savedBlog._id)
  await loggedUser.save()
  response.json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const { body } = request
  const blog = {
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url,
    id: body.id,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

// eslint-disable-next-line consistent-return
blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const loggedUser = request.user
  if (loggedUser.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'you are not creator of this post' })
  }
})

module.exports = blogsRouter
