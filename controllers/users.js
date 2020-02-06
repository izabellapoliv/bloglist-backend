const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users)
})

const generatePasswordHash = async (password) => {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}

usersRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body
        if (request.body.password.length < 3) {
            return response.status(400).json({ error: 'Password must be at least 3 characters long' })
        }

        const passwordHash = await generatePasswordHash(body.password)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        const result = await user.save()
        response.status(201).json(result)
    } catch (exception) {
        next(exception)
    }
})

usersRouter.put('/:id', async (request, response, next) => {
    try {
        const body = request.body
        const user = await User.findById(request.params.id)
        console.log(body, user.passwordHash)

        const passwordCorrect = !user
            ? false
            : await bcrypt.compare(body.password, user.passwordHash)

        if (!passwordCorrect) {
            return res.status(401).json({
                error: 'invalid password'
            })
        }

        const passwordHash = await generatePasswordHash(body.newPassword)
        const updatedUser = await User
            .findByIdAndUpdate(
                request.params.id,
                { passwordHash },
                { new: true }
            )
        response.json(updatedUser.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = usersRouter