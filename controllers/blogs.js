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

module.exports = blogRouter