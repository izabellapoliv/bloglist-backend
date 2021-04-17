const expressRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose')

expressRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})

expressRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    blog ? response.json(blog) : response.status(404).end()
})

expressRouter.post('/', async (request, response) => {
    const body = request.body
    if (!body.title) {
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
    })
    if (body.id) {
        blog._id = body.id
    }

    const saved = await blog.save()
    response.json(saved)
})

expressRouter.put('/:id', async (request, response) => {
    if (!request.params.id) {
        return response.status(400).json({
            error: 'id missing'
        })
    }

    const newBlog = new Blog(request.body)
    await newBlog.save()
    response.json(newBlog)
})

expressRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = expressRouter
