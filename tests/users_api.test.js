const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
})

describe('invalid user', () => {
    test('when username is not unique', async () => {
        await api
            .post('/api/users')
            .send(helper.defaultUser)
            .expect(201)

        const newUser = {
            name: "Nigella Martinez",
            username: helper.defaultUser.username,
            password: "marinara_sauce"
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(1)
    })

    test('when username is empty', async () => {
        const newUser = helper.defaultUser
        newUser.username = ""

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(0)
    })

    test('when username is less than 3 characters long', async () => {
        const newUser = helper.defaultUser
        newUser.username = "yo"
        
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(0)
    })

    test('when password is empty', async () => {
        const newUser = helper.defaultUser
        newUser.password = ""
        
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(0)
    })

    test('when password is less than 3 characters long', async () => {
        const newUser = helper.defaultUser
        newUser.password = "12"
        
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(0)
    })
})

afterAll(() => {
    mongoose.connection.close()
})