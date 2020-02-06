const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'The Next Big Thing in Code',
        author: 'Claire Flowers',
        url: 'https://www.example.com/act',
        likes: 15
    },
    {
        title: 'Will Test Ever Rule the World?',
        author: 'Steffan Camacho',
        url: 'https://www.example.com/afternoon',
        likes: 27
    },
]

const defaultUser = {
    name: "Martine Jenkins",
    username: "super_martine",
    password: "little.miss.amazing"
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
    defaultUser,
    usersInDb
}