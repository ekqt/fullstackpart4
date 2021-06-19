const mongoose = require('mongoose')
const Post = require('../models/post')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('Backend posts tests', () => {

  test('notes are returned as json', async () => {
    await api
      .get('/api/posts')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two notes', async () => {
    const response = await api.get('/api/posts')
    expect(response.body).toHaveLength(2)
  })

  test('the second post is about', async () => {
    const response = await api.get('/api/posts')
    expect(response.body[1].description).toBe('Being a developer is hard, no doubt about it.')
  })

  test('a valid post can be added', async () => {
    const initialResponse = await api.get('/api/posts/')

    const newPost = {
      "tags": "tech",
      "title": `"Am I a bad developer?" - A question developers commonly face`,
      "author": "Dev.to",
      "description": "Being a developer is hard, no doubt about it.",
      "url": "https://dev.to/manuthecoder/am-i-a-bad-developer-a-question-developers-commonly-face-4gck",
      "imageUrl": "https://dev-to-uploads.s3.amazonaws.com/uploads/articles/45xih8wxw3b5svi44dm4.jpg"
    }

    await api
      .post('/api/posts')
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/posts')

    const descriptions = response.body.map(post => post.description)

    expect(descriptions).toContain(
      'Being a developer is hard, no doubt about it.'
    )

    expect(response.body.length).toBeGreaterThan(initialResponse.body.length)
  })

  test('bad request post', async () => {
    const newPost = {
      "tags": "tech",
      "author": "Dev.to",
      "description": "This post description should not be found",
      "imageUrl": "https://dev-to-uploads.s3.amazonaws.com/uploads/articles/45xih8wxw3b5svi44dm4.jpg"
    }

    await api
      .post('/api/posts')
      .send(newPost)
      .expect(400)

    const response = await api.get('/api/posts')

    const descriptions = response.body.map(post => post.description)

    expect(descriptions).not.toContain(
      'This post description should not be found'
    )
  })

  test('if no likes then 0', async () => {
    const newPost = {
      "tags": "tech",
      "title": `This is the post with NO likes`,
      "author": "Dev.to",
      "description": "Being a developer is hard, no doubt about it.",
      "url": "https://dev.to/manuthecoder/am-i-a-bad-developer-a-question-developers-commonly-face-4gck",
      "imageUrl": "https://dev-to-uploads.s3.amazonaws.com/uploads/articles/45xih8wxw3b5svi44dm4.jpg"
    }

    if (!newPost.likes) {
      newPost.likes = 0
    }

    await api
      .post('/api/posts')
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/posts')

    const postNoLikes = response.body.filter(post => post.title === 'This is the post with NO likes')

    console.log(postNoLikes)

    expect(postNoLikes[0].likes).toBe(0)
  })

  test('view a single post', async () => {
    const response = await api.get('/api/posts/')
    const postsInDb = response.body

    const postToView = postsInDb[0]

    const resultPost = await api
      .get(`/api/posts/${postToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultPost.body).toEqual(postToView)
  })

  test('id property is defined', async () => {
    const response = await api.get('/api/posts/')
    const postsInDb = response.body

    const postToView = postsInDb[0]

    const resultPost = await api
      .get(`/api/posts/${postToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultPost.body.id).toBeDefined()
  })

  test('delete a note', async () => {
    const response = await api.get('/api/posts/')
    const postsInDb = response.body

    const postToDelete = postsInDb[0]

    await api
      .delete(`/api/posts/${postToDelete.id}`)
      .expect(204)

    const postsAfterAll = await api.get('/api/posts/')
    const postsAfter = postsAfterAll.body

    const descriptions = postsAfter.map(post => post.description)

    expect(descriptions).not.toContain('postToDelete.description')

  })

  test('delete them all', async () => {
    await Post.deleteMany({})
    console.log('Deleted')
  })

  afterAll(() => {
    mongoose.connection.close()
  })

})