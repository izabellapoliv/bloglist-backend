const expressRouter = require('express').Router()
const Login = require('../models/login')
const mongoose = require('mongoose')

expressRouter.post('/', (request, response) => {
    const user = {
        _id: "1YFomrEXjSi0DFq0SWfDNUIQjztWSlmW",
        name: 'Izabella Oliveira',
        username: 'user',
        password: '123456',
        token: 'etgp9kHdLdFq4Uc7Dhki',
    }

    response.json(user)
})

module.exports = expressRouter