const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1, date: 1, likes: 1 })
    res.json(users)
})

usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id).populate('blogs', { title: 1, url: 1, date: 1, likes: 1 })
    user ? response.json(user) : response.status(404).end()
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    if (!body.password || body.password.length < 3) {
        return response.status(400).json({
            error: 'password too short'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const saved = await user.save()
    response.json(saved)
})

module.exports = usersRouter