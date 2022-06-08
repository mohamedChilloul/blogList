const Blog = require('../models/blog')
const blogRouter = require('express').Router()
require('express-async-errors')

blogRouter.get('/',async (req, response)=>{
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/',async (req,response)=>{
    const newBlog = new Blog({...req.body})
    if (!newBlog.title || !newBlog.url){
        response.status(400).end()
    }else{
        const savedBlog = await newBlog.save()
        response.status(201).json(savedBlog)
    }
})

blogRouter.delete('/:id', async (request, response) => {
    let id = request.params.id
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const newBlog = request.body
    let id = request.params.id
    const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, {new : true})
    if(updatedBlog){
        response.status(200).json(updatedBlog)
    }else {
        response.status(404).end()
    }
})

module.exports = blogRouter