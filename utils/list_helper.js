const Blog = require('../models/blog')

const sumLikes = blogs => blogs.length > 0 ? blogs.reduce((accumulator, currentValue) => accumulator + currentValue) : 0
const favoriteBlog = blogs => blogs.length > 0 ? blogs.sort((a, b) => b.likes - a.likes)[0] : null
const mostBlogs = blogs => {
    if (blogs.length === 0) {
        return null
    }

    let authors = {}
    blogs.forEach(blog => authors[blog.author] ? authors[blog.author]++ : authors[blog.author] = 1)

    let sortable = Object.entries(authors)
    sortable.sort((a, b) => {
        return b[1] - a[1]
    });
    return sortable[0][0]
}
const mostLikes = blogs => {
    if (blogs.length === 0) {
        return null
    }

    let authors = {}
    blogs.forEach(blog => authors[blog.author] ? authors[blog.author] += blog.likes : authors[blog.author] = blog.likes)

    let sortable = Object.entries(authors)
    sortable.sort((a, b) => {
        return b[1] - a[1]
    });
    return sortable[0][0]
}

module.exports = {
    sumLikes, favoriteBlog, mostBlogs, mostLikes
}