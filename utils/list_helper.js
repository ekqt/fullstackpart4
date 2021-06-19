const _ = require('lodash')

const dummy = array => {
    if (array) {
        return 1
    }
}

const totalLikes = posts => {
    const reducer = (sum, likes) => {
        return sum + likes
    }

    const allPostLikes = posts.map(post => post.likes)

    return allPostLikes.reduce(reducer, 0)
}

const favoritePost = posts => {
    const reducer = (favorite, post) => {
        return favorite.likes > post.likes ? { title: favorite.title, author: favorite.author, likes: favorite.likes } : post
    }

    return posts.reduce(reducer, 0)
}

const mostBlogs = posts => {
    let blogsPerAuthor = []
    _.forEach([...new Set(_.map(posts, 'author'))], (author) => {
        blogsPerAuthor.push({
            author: author,
            blogs: _.size((_.filter(posts, ['author', author])))
        })
    })
    return _.maxBy(blogsPerAuthor, 'blogs')
}

const mostLikes = posts => {
    let likesPerAuthor = []
    _.forEach([...new Set(_.map(posts, 'author'))], (author) => {
        likesPerAuthor.push({
            author: author,
            likes: _.sumBy((_.filter(posts, ['author', author])), "likes")
        })
    })
    return _.maxBy(likesPerAuthor, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoritePost,
    mostBlogs,
    mostLikes
}
