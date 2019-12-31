var _ = require('lodash');

const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((sum, item) => sum + item.likes, 0)

const favoriteBlog = blogs => {
    return blogs.reduce((prev, current) => {
        return prev.likes > current.likes ? prev : current
    }, blogs[0])
}

const groupBlogsByAuthor = blogs => {
    return _.groupBy(blogs, blog => blog.author)
}

const getAuthorWithMaxPoints = authorBlogs => {
    return _.reduce(authorBlogs, (accumulator, value, key) => {
        if (value > accumulator.points) {
            return {
                author: key,
                points: value
            }
        }
        return accumulator
    }, { points: 0 });
}

const mostBlogs = blogs => {
    const blogsByAuthor = groupBlogsByAuthor(blogs)
    const authorBlogs = _.mapValues(blogsByAuthor,
        allBlogs => allBlogs.length
    )
    return getAuthorWithMaxPoints(authorBlogs)
}

const mostLikes = blogs => {
    const blogsByAuthor = groupBlogsByAuthor(blogs)
    const authorLikes = _.mapValues(blogsByAuthor,
        allBlogs => _.reduce(allBlogs, (accumulator, value, key) => {
            return accumulator + value.likes
        }, 0)
    )
    return getAuthorWithMaxPoints(authorLikes)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}