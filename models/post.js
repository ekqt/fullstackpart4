const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    date: String,
    tags: String,
    title: {
        type: String,
        required: true
    },
    author: String,
    description: String,
    url: {
        type: String,
        required: true
    },
    imageUrl: String,
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Post', postSchema)