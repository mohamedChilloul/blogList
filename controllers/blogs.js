const Blog = require('../models/blog')
const blogRouter = require('express').Router()

blogRouter.get('/', (req, response)=>{
    Blog.find({}).then(res=>{
        response.json(res)
    })
})

blogRouter.post('/', (req,response)=>{
    newBlog = new Blog({...req.body})
    newBlog.save().then(res=>{
        response.json(res)
    }).catch(err =>console.log(err.message))
})

module.exports = blogRouter