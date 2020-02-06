const User = require('../models/user')

const defaultUser = {
    name: "Martine Jenkins",
    username: "super_martine",
    password: "little.miss.amazing"
}

const createNewUser = () => {
    try {
        const passwordHash = getPasswordHash(defaultUser.password)

        const user = new User({
            name: defaultUser.name,
            username: defaultUser.username,
            passwordHash,
        })

        await user.save()
    } catch (e) {
        console.error(e)
    }
}

const getPasswordHash = (password) => {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
}

module.exports = [
    defaultUser,
    createNewUser,
    getPasswordHash
]