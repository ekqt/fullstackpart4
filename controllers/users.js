const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('posts', { title: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.username || !body.password) {
    return response.status(400).json({
      error: 'Either username or password is missing'
    })
  } else if (body.password.length < 3) {
    return response.status(400).json({
      error: 'Please choose a stronger password'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const newUser = await user.save()
  response.status(201).json(newUser)
})

module.exports = usersRouter