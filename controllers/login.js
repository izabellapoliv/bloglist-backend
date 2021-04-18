const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const security = require('../utils/security')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid credentials'
        })
    }

    const token = security.token(user)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter