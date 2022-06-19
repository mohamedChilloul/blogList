const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./helper')
const bcrypt = require('bcrypt')
const { default: mongoose } = require('mongoose')
const api = supertest(app)

describe('testing add users ', () =>{

    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('pass', 10)
        const newUser = {
            username : 'admin',
            name : 'mohamed',
            passwordHash : passwordHash
        }
        const user = new User(newUser)
        await user.save()
    })

    test('success add ', async () => {
        const usersBefore = await helper.usersInDb()

        const newUser = {
            username : 'root',
            name : 'mohamed',
            password : 'pass'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const usersAfter = await helper.usersInDb()

        expect(usersAfter.length).toBe(usersBefore.length + 1)

    })
    test('failed add when existing username ', async () => {
        const usersBefore = await helper.usersInDb()

        const newUser = {
            username : 'admin',
            name : 'mohamed',
            password : 'pass'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const usersAfter = await helper.usersInDb()
        expect(result.body.error).toContain('username must be unique')
        expect(usersAfter).toEqual(usersBefore)

    })
    test('failed add when missing username or password', async () => {
        const usersBefore = await helper.usersInDb()

        const newUser = {
           // username : 'chilloul',
            name : 'mohamed',
            password : 'pass'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const usersAfter = await helper.usersInDb()
        expect(result.body.error).toContain('missing password or username')
        expect(usersAfter).toEqual(usersBefore)

    })
    test('failed add when length of username or password < 3', async () => {
        const usersBefore = await helper.usersInDb()

        const newUser = {
            username : 'chilloul',
            name : 'mohamed',
            password : 'pa'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const usersAfter = await helper.usersInDb()
        expect(result.body.error).toContain('length')
        expect(usersAfter).toEqual(usersBefore)

    })
})

afterAll(()=>{
    mongoose.connection.close()
})