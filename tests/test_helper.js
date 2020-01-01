const Blog = require('../models/blog')

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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}