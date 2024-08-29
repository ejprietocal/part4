const blogRouter = require('express').Router()
const Blog = require('../models/email')

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
        response.json(blogs)
        })
    }
)

blogRouter.get('/:id', (request, response, next) => {
    Note.findById(request.params.id)
      .then(note => {
        if (note) {
          response.json(note)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })
blogRouter.post('/', (request, response, next) => {

    const blog = new Blog(request.body)

    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      }).catch(error => next(error))
})

module.exports = blogRouter