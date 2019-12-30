const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((sum, item) => sum + item.likes, 0)

const favoriteBlog = blogs => {
    return blogs.reduce((prev, current) => {
        return prev.likes > current.likes ? prev: current
    }, blogs[0])
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}