const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const security = require('../utils/security')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    const userObjects = helper.initialUsers
        .map(user => new User(user))
    const promiseArrayUsers = userObjects.map(user => user.save())
    await Promise.all(promiseArrayUsers)

    const users = await helper.usersInDb();
    const userId = users[0].id

    const allBlogs = helper.initialBlogs
        .map(blog => ({ ...blog, user: userId }))

    await Blog.deleteMany({})
    const blogObjects = allBlogs
        .map(blog => new Blog(blog))
    const promiseArrayBlogs = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArrayBlogs)
})

describe('endpoint get /', () => {
    test('blogs are returned as json', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('the amount of blogs is correct', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toEqual(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const allTitles = response.body.map(r => r.title)
        expect(allTitles).toContain(helper.initialBlogs[1].title)
    })

    test('contains unique id', async () => {
        const response = await api.get(`/api/blogs`)
        response.body.map(blog => expect(blog.id).toBeDefined())
    })
})

describe('endpoint get /:id', () => {
    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToView = blogsAtStart[0]

        const resultBlog = await api.get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

        expect(resultBlog.body).toEqual(processedBlogToView)
    })
})

describe('endpoint post /', () => {
    test('a valid blog can be added', async () => {
        const users = await helper.usersWithoutJSON();
        const token = security.token(users[0])

        const blog = {
            title: "Frankstein",
            author: "Mary Shelley",
            url: "https://fullstackopen.com/",
            likes: 3214
        }

        await api.post('/api/blogs')
            .auth(token, { type: 'bearer' })
            .send(blog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const titles = blogsAtEnd.map(r => r.title)

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain(blog.title)
    })

    test('blog without title is not added', async () => {
        const users = await helper.usersWithoutJSON();
        const token = security.token(users[0])

        const blog = {
            author: 'George Orwell',
            url: 'https://www.google.com/'
        }

        await api
            .post('/api/blogs')
            .auth(token, { type: 'bearer' })
            .send(blog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
        const users = await helper.usersWithoutJSON();
        const token = security.token(users[0])

        const blog = {
            title: '1984',
            author: 'George Orwell'
        }

        await api
            .post('/api/blogs')
            .auth(token, { type: 'bearer' })
            .send(blog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a blog without the likes parameter defaults to zero likes', async () => {
        const users = await helper.usersWithoutJSON();
        const token = security.token(users[0])

        const blog = {
            title: "IT",
            author: "Stephen King",
            url: "https://fullstackopen.com/"
        }

        const response = await api
            .post('/api/blogs')
            .auth(token, { type: 'bearer' })
            .send(blog)
            .expect(200)
        expect(response.body.likes).toEqual(0)
    })
})

describe('endpoint delete /:id', () => {
    test('a blog can be deleted', async () => {
        const users = await helper.usersWithoutJSON();
        const token = security.token(users[0])

        const blog = {
            title: "Dom Casmurro",
            author: "Machado de Assis",
            url: "https://fullstackopen.com/",
            likes: 410945
        }

        const response = await api.post('/api/blogs')
            .auth(token, { type: 'bearer' })
            .send(blog)

        const blogCreated = response.body
        await api
            .delete(`/api/blogs/${blogCreated.id}`)
            .auth(token, { type: 'bearer' })
            .expect(204)
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length
        )

        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).not.toContain(blogCreated.title)
    })

    test('only the creator can delete blog', async () => {
        const users = await helper.usersWithoutJSON();
        const token = security.token(users[0])

        const blog = {
            title: "Dom Casmurro",
            author: "Machado de Assis",
            url: "https://fullstackopen.com/",
            likes: 410945
        }

        const response = await api.post('/api/blogs')
            .auth(token, { type: 'bearer' })
            .send(blog)

        const newToken = security.token(users[1])
        const blogCreated = response.body
        await api
            .delete(`/api/blogs/${blogCreated.id}`)
            .auth(newToken, { type: 'bearer' })
            .expect(403)
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length + 1
        )

        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).toContain(blogCreated.title)
    })
})

describe('endpoint put /:id', () => {
    test('increase likes by 1', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blog = blogsAtStart[0]
        blog.likes = blog.likes + 1

        const response = await api
            .put(`/api/blogs/${blog.id}`)
            .send(blog)
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        const blogChanged = response.body
        expect(blogChanged.likes).toEqual(blog.likes)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
