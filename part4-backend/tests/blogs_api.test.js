const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/email')
const blogsHelper = require('./blogs_helper')

const api = supertest(app)


describe('When there is initially some blogs Saved', () =>{

    beforeEach(async () =>{
        await Blog.deleteMany({})
    
        const newBlogs = blogsHelper.initialBlogs.map(blog => new Blog(blog))
        const promiseArray = newBlogs.map(note => note.save())
        await Promise.all(promiseArray)
    
    })    
    test('Getting the same amount of entries', async() =>{
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length,blogsHelper.initialBlogs.length)
    })

    test('Checking ID property', async() =>{
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => assert.ok(blog.hasOwnProperty('id'),'Blog have an id property'))    
    })

    describe('Addition of a new blog', () =>{
        test('A proper blog can be added', async () =>{
        
            const newBlog = {
                title: "whispers of the forest",
                author: "amanda lopez",
                url: "whispers.forest.com",
                likes: 7
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await blogsHelper.blogsInDB()
            assert.strictEqual(blogsAtEnd.length, blogsHelper.initialBlogs.length + 1)
        
        })
    })
    describe('Deletetion of a blog' , () =>{

        test('succes with code 204 if id is valid', async() =>{
            const blogsAtStart = await blogsHelper.blogsInDB()
            const blogToDelete = blogsAtStart[0]

            await api.delete(`/api/blogs/${blogToDelete.id}`)
                        .expect(204)

            const blogsAtTheEnd = await blogsHelper.blogsInDB()
            assert.strictEqual(blogsAtTheEnd.length, blogsHelper.initialBlogs.length - 1)
        })
    })

    describe('Updating a particular blog', () =>{
        test('succes updated with code 200 if id is valid', async ()=>{

            const blogsAtStart = await blogsHelper.blogsInDB()

            const id = "5a422bc61b54a676234d17fc"
            const newBlog = {
                title: "Proff that updating new blog works",
                author: "amanda lopez",
                url: "updated.forest.com",
                likes: 7
            }
            await api
                .put(`/api/blogs/${id}`)
                .send(newBlog)
                .expect(200)

            const blogsAtEnd = await blogsHelper.blogsInDB()
            assert.notStrictEqual(blogsAtStart,blogsAtEnd)

        })
    })


})

after(async () => {
    await mongoose.connection.close()
  })
