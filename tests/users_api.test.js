const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('Backend user tests', () => {

    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({
            username: 'Root',
            passwordHash
        })

        await user.save()
    })

    test('Creating user', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: "ckronenberg",
            name: "Clara Kronenberg",
            password: "basketball"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const usersAtEnd = await User.find({})
        expect(usersAtEnd.length).toBeGreaterThan(usersAtStart.length)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)

    })

    test('Creating unique user', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'Root',
            name: 'Superuser',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        expect(result.body.error).toContain("User validation failed: username: Error, expected `username` to be unique. Value: `Root`")

        const usersAtEnd = await User.find({})
        expect(usersAtEnd.length).toEqual(usersAtStart.length)

    })

    afterAll(() => {
        mongoose.connection.close()
    })

})