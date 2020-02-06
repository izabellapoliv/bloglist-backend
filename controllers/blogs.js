const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    try {
        const token = request.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token >> !decodedToken.id) {
            return response
                .status(401)
                .json({ error: 'token missing or invalid' })
        }

        let body = request.body
        if (body.likes === undefined) {
            body.likes = 0
        }
        const user = await User.findById(decodedToken.id)
        body.user = user._id

        const blog = new Blog(body)
        const result = await blog.save()
        user.blogs = user.blogs.concat(result._id)
        await user.save()

        response.status(201).json(result)
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const token = request.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token >> !decodedToken.id) {
            return response
                .status(401)
                .json({ error: 'token missing or invalid' })
        }

        const blog = await Blog.findById(request.params.id)
        if (blog.user.toString() != decodedToken.id) {
            return response
                .status(401)
                .json({ error: 'token missing or invalid' })
        }
        
        await blog.remove()
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        likes: body.likes
    }

    try {
        const updatedBlog = await Blog
            .findByIdAndUpdate(
                request.params.id,
                blog,
                { new: true }
            )
        response.json(updatedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter