const jwt = require('jsonwebtoken')

const token = user => {
    const userForToken = {
        username: user.username,
        id: user._id,
    }

    return jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })
}

const verify = token => {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    return decodedToken
}

module.exports = {
    token, verify
}