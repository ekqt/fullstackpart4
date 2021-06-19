const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: [3, 'Your username be at least 3 letters long, you got {VALUE}!'],
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
      },
    name: {
        type: String,
        minLength: [3, 'Your name be at least 3 letters long, you got {VALUE}!'],
        required: true,
        uniqueCaseInsensitive: true
      },
    passwordHash: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)