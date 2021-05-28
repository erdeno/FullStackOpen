/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line no-unused-vars
const _ = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'First class tests',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 10,
  },
]

const dummy = () => 1

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, current) => ((prev.likes > current.likes) ? prev : current)
  const max = blogs.reduce(reducer)
  delete max.id
  delete max.url
  return max
}

const mostBlogs = (blogs) => {
  const newList = blogs.map((item) => (item.author))
  const newObj = {}
  for (let i = 0; i < newList.length; i++) {
    const item = newList[i]
    if (!newObj[item]) {
      newObj[item] = 1
    } else {
      newObj[item]++
    }
  }

  const objectKeys = Object.keys(newObj)

  let mostCommonItem = objectKeys[0]
  for (let i = 0; i < objectKeys.length; i++) {
    const key = objectKeys[i]
    if (newObj[key] > newObj[mostCommonItem]) {
      mostCommonItem = key
    }
  }
  const result = {
    author: mostCommonItem,
    blogs: newObj[mostCommonItem],
  }
  return result
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  usersInDb,
}
