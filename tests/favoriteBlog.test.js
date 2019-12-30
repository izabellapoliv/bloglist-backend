const listHelper = require('../utils/list_helper')
const blogs = require('../utils/blogs_helper')

describe('favorite blog', () => {
    test('when list has only one blog equals itself', () => {
        const result = listHelper.favoriteBlog([blogs[0]])
        expect(result).toEqual(blogs[0])
    })

    test('when list has many blogs equals the one with most likes', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[2])
    })

    test('when list has no blogs equals undefined', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toEqual(undefined)
    })
})