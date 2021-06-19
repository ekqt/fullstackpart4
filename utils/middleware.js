const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

morgan.token('content', function (req, res) {
    return [
        JSON.stringify(req.body)
    ]
})

const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms :content')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    } 

    next()
}

const userExtractor = async (request, response, next) => {
    if(request.method === 'POST' || request.method === 'DELETE') {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
          return response.status(401).json({ error: 'Token mission or invalid' })
        }
        
        const user = await User.findById(decodedToken.id)
        request.user = user
    }

    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        console.log('errorHandler middleware taking over for CastError!')
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        console.log('errorHandler middleware taking over for ValidationError!')
        return response.status(400).send({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'errorHandler middleware taking over for TokenError'
        })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'errorHandler middleware taking over for TokenExpired'
        })
    }

    next(error)
}

module.exports = {
    morganLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}
