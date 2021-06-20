import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders the blog\'s title and author, but does not render its url or number of likes', () => {
  const blog = {
    title: 'Testing with jest',
    author: 'Chelebi',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 12,
  }

  const component = render(
    <Blog blog={blog} />,
  )

  const div = component.container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Testing with jest Chelebi',
  )

  const togglable = component.container.querySelector('.blogDetails')
  expect(togglable).toHaveStyle('display: none')
})

test('the blog\'s url and number of likes are shown when the button controlling clicked', () => {
  const blog = {
    title: 'Testing with jest',
    author: 'Chelebi',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 12,
  }

  const component = render(
    <Blog blog={blog} />,
  )
  const button = component.getByText('show')
  fireEvent.click(button)

  const togglable = component.container.querySelector('.blogDetails')
  expect(togglable).not.toHaveStyle('display: none')
})

test('if the like button is clicked twice, the event handler the component received as props is called twice', () => {
  const blog = {
    title: 'Testing with jest',
    author: 'Chelebi',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 12,
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} like={mockHandler} />,
  )

  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
