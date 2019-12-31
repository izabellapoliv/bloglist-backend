const listHelper = require('../utils/list_helper')
const blogs = require('../utils/blogs_helper')

describe('most blogs', () => {
    test('when list has only one blog equals the first author and first blog likes', () => {
        const result = listHelper.mostLikes([blogs[0]])
        expect(result).toEqual({
            author: blogs[0].author,
            points: blogs[0].likes
        })
    })

    test('when list has many blogs equals the author with most likes on their blogs', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            points: 17
        })
    })

    test('when list has no blogs equals undefined', () => {
        const result = listHelper.mostLikes([])
        expect(result).toEqual({ points: 0 })
    })
})