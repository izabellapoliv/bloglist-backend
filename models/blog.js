const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2
    },
    author: {
        type: String,
        required: true,
        minlength: 5
    },
    url: {
        type: String,
        required: true,
        minlength: 5
    },
    date: {
        type: Date,
        required: false,
    },
    likes: Number,
    user: {
        type: mongoose.Types.ObjectId,
        required: false
    }
})

schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', schema)