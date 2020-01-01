const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    let body = request.body
    if (body.likes === undefined) {
        body.likes = 0
    }

    try {
        const blog = new Blog(body)
        const result = await blog.save()
        response.status(201).json(result)
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter