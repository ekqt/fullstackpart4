const postsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')

postsRouter.get('/', async (request, response) => {
  const posts = await Post.find({}).populate('user', { username: 1 })
  response.json(posts)
})

postsRouter.get('/:id', async (request, response) => {
  const post = await Post.findById(request.params.id).populate('user', { username: 1 })
  if (post) {
    response.json(post)
  } else {
    response.status(404).end()
  }
})

postsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  const post = new Post({
    date: new Date(),
    tags: body.tags,
    title: body.title,
    author: body.author,
    description: body.description,
    url: body.url,
    imageUrl: body.imageUrl,
    likes: body.likes,
    user: user.id
  })

  const newPost = await post.save()
  user.posts = user.posts.concat(newPost.id)
  await user.save()

  response.status(201).json(newPost)
})

postsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  const post = await Post.findById(request.params.id).populate('user', { username: 1 })
  if (!post) {
    response.status(404).end()
  }

  if(post.user.id === user.id) {
    await Post.deleteOne(post)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'Unauthorized user! Cannot delete this post!' })
  }
})

postsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const post = {
    tags: body.tags,
    title: body.title,
    author: body.author,
    description: body.description,
    url: body.url,
    imageUrl: body.imageUrl,
    likes: body.likes
  }

  const updatedPost = await Post.findByIdAndUpdate(request.params.id, post, { new: true })
  response.json(updatedPost)
})

module.exports = postsRouter