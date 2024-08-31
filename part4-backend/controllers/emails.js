const blogRouter = require('express').Router()
const Blog = require('../models/email')
const User = require('../models/user')

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

blogRouter.post('/', async (request, response) => {

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
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) =>{


  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  
  if ( blog.user.toString() === user.id ){
    await Blog.findByIdAndDelete(blog.id)
    return response.status(204).end()
  }else{
    return response.status(401).json({ error: 'not created by this user' })
  }
})

blogRouter.put('/:id', async(request, response) =>{
  const blog = request.body
  await Blog.findByIdAndUpdate(request.params.id,blog)
  response.status(200).end()
})


module.exports = blogRouter