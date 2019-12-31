const listHelper = require('../utils/list_helper')
const blogs = require('../utils/blogs_helper')

describe('most blogs', () => {
    test('when list has only one blog equals the first author and one blog', () => {
        const result = listHelper.mostBlogs([blogs[0]])
        expect(result).toEqual({
            author: blogs[0].author,
            points: 1
        })
    })

    test('when list has many blogs equals the author with most blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({
            author: 'Robert C. Martin',
            points: 3
        })
    })

    test('when list has no blogs equals undefined', () => {
        const result = listHelper.mostLikes([])
        expect(result).toEqual({ points: 0 })
    })
})