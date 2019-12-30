const listHelper = require('../utils/list_helper')
const blogs = require('../utils/blogs_helper')

describe('total likes', () => {
    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes([blogs[0]])
        expect(result).toBe(7)
    })

    test('when list has many blogs equals the sum of all', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })

    test('when list has no blogs equals zero', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })
})