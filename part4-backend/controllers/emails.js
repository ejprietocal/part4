const blogRouter = require('express').Router()
const Blog = require('../models/email')
const User = require('../models/user')
const middleware = require('../utils/middleware')

const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
      const blogs = await Blog.find({}).populate('user',{username: 1, name: 1,})
      response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if(blog){
      response.json(blog)
    }
    else{
      response.status(404).end()
    }
  })

blogRouter.post('/',middleware.userExtractor,async (request, response) => {

    const {title,author,url,likes} = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = request.user

    const blog = new Blog({
      title: title,
      author: author,
      url: url,
      likes: likes,
      user: user.id
    })
    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 });

    response.status(201).json(populatedBlog)
})

blogRouter.delete('/:id',middleware.userExtractor,async (request, response) =>{
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  
  if ( blog.user.toString() === user.id ){
    const blogDeleted = await Blog.findByIdAndDelete(blog.id)
    return response.status(200).json(blogDeleted)
  }else{
    return response.status(401).json({ error: 'not created by this user' })
  }
})

blogRouter.put('/:id', async(request, response) =>{
  const blog = request.body
  const savedBlog = await Blog.findByIdAndUpdate(request.params.id,blog, {new: true})
  response.status(200).json(savedBlog)
})


module.exports = blogRouter