const jwt = require('jsonwebtoken')

const token = user => {
    const userForToken = {
        username: user.username,
        id: user._id,
    }

    return jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })
}

module.exports = {
    token
}