const Blog = require('../models/blog')
const User = require('../models/user')
const blogRouter = require('express').Router()
require('express-async-errors')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogRouter.get('/',async (req, response)=>{
    const blogs = await Blog.find({}).populate('user', {username : 1, name:1})
    response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (req,response)=>{

    //getting token and verifiying it 
    const userId = req.user
    //console.log('userId : => ', userId)
    if(!userId){
        response.status(401).json({
            error : 'missing or invalid token'
        })
    }
    const user = await User.findById(userId)
    //console.log('user : => ', user)
    const newBlog = new Blog({...req.body, user : user._id})
    if (!newBlog.title || !newBlog.url){
        response.status(400).end()
    }else{
        const savedBlog = await newBlog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    }
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    let id = request.params.id
    const blogToDelete = await Blog.findById(id)
    console.log('blog to delet : => ',blogToDelete)
    const userId = request.user
    console.log(userId)
    if (userId === blogToDelete.user.toString()){
        await Blog.findByIdAndDelete(id)
        response.status(204).end()
    }else{
        response.status(401).json({
            error : 'you are not allowed to delete this blog'
        })
    }
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