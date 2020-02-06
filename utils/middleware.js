const errorHandler = (error, request, response, next) => {
    console.error(error.name, error.message)

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

module.exports = {
    errorHandler
}