const mongoose = require('mongoose')
const supertest = require('supertest')
const listHelper = require('../utils/list_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(listHelper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(listHelper.initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(listHelper.initialBlogs[2])
  await blogObject.save()
})

describe('get blog posts', () => {
  test('bloglist are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('the method returns 3 blog post', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(3)
  })
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([listHelper.initialBlogs[0]])
    expect(result).toBe(7)
  })
  test('when list has only Two blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.initialBlogs)
    expect(result).toBe(22)
  })
  test('check that is id property defined', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    expect(blog.id).toBeDefined()
  })
})

describe('favorite and most creative', () => {
  test('bring most liked post', () => {
    const result = listHelper.favoriteBlog(listHelper.initialBlogs)
    expect(result).toEqual({
      title: 'First class tests',
      author: 'Michael Chan',
      likes: 10,
    })
  })
  test('bring the writer that most writes', () => {
    const result = listHelper.mostBlogs(listHelper.initialBlogs)
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 2,
    })
  })
})

describe('create blog post', () => {
  test('a valid blog can be added', async () => {
    const logUser = {
      username: 'root',
      password: 'sekret',
    }
    const res = await await api.post('/api/login').send(logUser)
    const { token } = res.body
    const newBlog = {
      title: 'React patterns II',
      author: 'Michael Chan II',
      url: 'https://reactpatterns.com/II',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map((b) => b.title)
    expect(contents).toContain(
      'React patterns II',
    )
  })
  test('adding a blog fails if a token is not provided', async () => {
    const newBlog = {
      title: 'React patterns II',
      author: 'Michael Chan II',
      url: 'https://reactpatterns.com/II',
      likes: 12,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length)

    const contents = blogsAtEnd.map((b) => b.title)
    expect(contents).not.toContain(
      'React patterns II',
    )
  })
  test('if the like property not exist must be return 0', async () => {
    const logUser = {
      username: 'root',
      password: 'sekret',
    }
    const res = await await api.post('/api/login').send(logUser)
    const { token } = res.body
    const newBlog = {
      title: 'React patterns II',
      author: 'Michael Chan II',
      url: 'https://reactpatterns.com/II',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await listHelper.blogsInDb()
    const lastItem = blogsAtEnd[blogsAtEnd.length - 1]
    expect(lastItem.likes).toBe(0)
  })
  test('respond 400 without title and url', async () => {
    const newBlog = {
      author: 'Michael Chan II',
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('delete blog post', () => {
  test('if id is valid must be return 204', async () => {
    const logUser = {
      username: 'root',
      password: 'sekret',
    }
    const res = await await api.post('/api/login').send(logUser)
    const { token } = res.body
    const newBlog = {
      title: 'This blog will be deleted',
      author: 'Michael Chan II',
      url: 'https://reactpatterns.com/II',
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
    const blogToDelete = result.body

    const blogsAfterAdding = await listHelper.blogsInDb()
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await listHelper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      blogsAfterAdding.length - 1,
    )

    const titles = blogsAtEnd.map((r) => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('update blog post', () => {
  test('changing a posts likes to 12', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogtoUpdate = { ...blogsAtStart[0], likes: 12 }
    const updatedBlog = await api.put(`/api/blogs/${blogtoUpdate.id}`).send(blogtoUpdate)
    expect(updatedBlog.body.likes).toEqual(12)
    expect(blogsAtStart[0].likes).not.toEqual(updatedBlog.body.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
