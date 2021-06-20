import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('that the form calls the event handler it received as props with the right details when a new blog is created', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />,
  )

  const author = component.container.querySelector('#author')
  const title = component.container.querySelector('#title')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'Testing with Jest' },
  })

  fireEvent.change(author, {
    target: { value: 'Chelebi' },
  })

  fireEvent.change(url, {
    target: { value: 'https://fullstackopen.com/' },
  })

  fireEvent.submit(form)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing with Jest')
  expect(createBlog.mock.calls[0][0].author).toBe('Chelebi')
  expect(createBlog.mock.calls[0][0].url).toBe('https://fullstackopen.com/')
})
