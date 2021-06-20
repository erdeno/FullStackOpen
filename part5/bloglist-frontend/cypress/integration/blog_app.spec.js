/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = {
      name: 'Chelebi',
      username: 'storm',
      password: 'pass',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user1)
    const user2 = {
      name: 'User2',
      username: 'user2',
      password: 'pass',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.login({ username: 'storm', password: 'pass' })
      cy.contains('Chelebi logged-in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('storm')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })
  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'storm', password: 'pass' })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()

      cy.get('#title').type('Test title')
      cy.get('#author').type('Chelebi')
      cy.get('#url').type('https:google.com')
      cy.get('#create-button').click()

      cy.get('.success')
        .should('contain', 'a new blog Test title by Chelebi')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.contains('Test title Chelebi')
    })
  })
  describe('When a blog created', function () {
    beforeEach(function () {
      cy.login({ username: 'storm', password: 'pass' })
      cy.createBlog({
        title: 'Test title',
        author: 'Chelebi',
        blogUrl: 'https://google.com',
      })
    })

    it('A blog can be liked', function () {
      cy.contains('Test title Chelebi')
        .get('#show').click()
        .get('#like')
        .click()
      cy.contains('likes 1')
    })

    it('The user who created a blog can delete it', function () {
      cy.get('#show').click()
      cy.get('#remove').click()
      cy.get('.success')
        .should('contain', 'Deleted Test title by Chelebi')
    })

    it('Other users cannot delete blog', function () {
      cy.contains('logout').click()
      cy.login({ username: 'user2', password: 'pass' })
      cy.contains('User2 logged-in')

      cy.get('#show').click()
      cy.get('.blogDetails').should('not.contain', 'remove')
    })
  })
  describe('When multiple blogs created', function () {
    beforeEach(function () {
      cy.login({ username: 'storm', password: 'pass' })
    })

    it.only('the blogs are ordered according to likes', function () {
      cy.createBlog({
        title: 'Test title1',
        author: 'Chelebi',
        blogUrl: 'https://google.com',
      })
      cy.createBlog({
        title: 'Test title2',
        author: 'Harry',
        blogUrl: 'https://google.com',
      })
      cy.createBlog({
        title: 'Test title3',
        author: 'Hermione',
        blogUrl: 'https://google.com',
      })

      // like first blog 3 times
      cy.contains('Test title1 Chelebi').contains('show').click()
      cy.contains('Test title1 Chelebi')
        .within(() => {
          setTimeout(() => {
          }, 2000)
          cy.get('#like').click()
          setTimeout(() => {
          }, 2000)
          cy.get('#like').click()
          setTimeout(() => {
          }, 2000)
          cy.get('#like').click()
          setTimeout(() => {
          }, 2000)
        })

      // like second blog 1 time
      setTimeout(() => {
      }, 2000)
      cy.contains('Test title2 Harry').contains('show').click()
      cy.contains('Test title2 Harry')
        .within(() => {
          setTimeout(() => {
          }, 2000)
          cy.get('#like').click()
        })

      // like third blog 5 times
      setTimeout(() => {
      }, 2000)
      cy.contains('Test title3 Hermione').contains('show').click()
      cy.contains('Test title3 Hermione')
        .within(() => {
          setTimeout(() => {
          }, 2000)
          cy.get('#like').click()
          setTimeout(() => {
          }, 2000)
          cy.get('#like').click()
          setTimeout(() => {
          }, 2000)
          cy.get('#like').click()
          setTimeout(() => {
          }, 2000)
          cy.get('#like').click()
          setTimeout(() => {
          }, 2000)
          cy.get('#like').click()
          setTimeout(() => {
          }, 2000)
        })

      setTimeout(() => {
      }, 4000)
      let lastCount
      cy.get('.blogDetails').each(($el) => {
        const currentValue = parseInt($el.children('#like-count').text(), 10)
        if (lastCount) {
          assert.isBelow(currentValue, lastCount, `${currentValue} is lower than ${lastCount}`)
        }
        lastCount = currentValue
      })
    })
  })
})
