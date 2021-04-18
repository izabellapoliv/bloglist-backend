const expressRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const security = require('../utils/security')

expressRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
    res.json(blogs)
})

expressRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', { name: 1, username: 1 })
    blog ? response.json(blog) : response.status(404).end()
})

expressRouter.post('/', async (request, response) => {
    const token = request.token
    const decodedToken = security.verify(token)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const body = request.body
    if (!body.title || !body.url) {
        return response.status(400).json({
            error: 'title missing'
        })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        date: new Date(),
        likes: body.likes ? body.likes : 0,
        user: user._id
    })
    if (body.id) {
        blog._id = body.id
    }

    const saved = await blog.save()
    user.blogs = user.blogs.concat(saved._id)
    await user.save()

    response.json(saved)
})

expressRouter.put('/:id', async (request, response) => {
    if (!request.params.id || !request.body.likes) {
        return response.status(400).json({
            error: 'check the payload'
        })
    }

    const newBlog = await Blog.findById(request.params.id)
    newBlog.likes = request.body.likes

    const saved = await newBlog.save()
    response.json(saved)
})

expressRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user')
    const token = request.token
    const decodedToken = security.verify(token)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    if (decodedToken.id.toString() !== blog.user._id.toString()) {
        return response.status(403).json({ error: 'forbidden' })
    }

    await blog.remove()
    response.status(204).end()
})

module.exports = expressRouter
