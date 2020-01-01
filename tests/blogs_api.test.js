const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects
        .map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('list blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body.length).toBe(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)

        expect(contents)
            .toContain(helper.initialBlogs[0].title)
    })

    test('returned blogs do not contain nonexistent blog', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)

        expect(contents)
            .not.toContain('Invalid blog title')
    })

    test('property id is defined', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body[0].id).toBeDefined()
    })
})

describe('add new blog', () => {
    test('a valid blog can be added', async () => {
        const blogTitle = 'Programming: Expectations vs. Reality'
        const newBlog = {
            title: blogTitle,
            author: 'Taylah Finnegan',
            url: 'https://www.example.com/alarm/aftermath',
            likes: 22
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

        const contents = blogsAtEnd.map(blog => blog.title)
        expect(contents).toContain(blogTitle)
    })

    test('likes defaults to zero if missing', async () => {
        const newBlog = {
            title: 'Async Explained in Fewer than 140 Characters',
            author: 'Ellie-Mai Whittington',
            url: 'http://www.example.com/?activity=bed&angle=art',
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)

        expect(response.body.likes).toBeDefined()
        expect(response.body.likes).toBe(0)
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            title: '',
            author: 'Tammy Ford',
            url: 'https://example.com/',
            likes: 13,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
        const newBlog = {
            title: 'This Week\'s Top Stories About Blog Ideas',
            author: 'Tammy Ford',
            likes: 13,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})