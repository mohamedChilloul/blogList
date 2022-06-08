const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const helper = require('./helper')
const Blog = require('../models/blog')
const api = supertest(app)

//initializing the dataBase 

beforeEach(async ()=>{
    await Blog.deleteMany({})
    console.log('db cleared ')
    for (const blog of helper.blogs) {
        let newBlog = new Blog(blog)
        await newBlog.save()
        console.log('saved')
    }

})

//step 1

test('getting the blog list as json', async () => {

    const blogs = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(blogs.body).toHaveLength(6)
})

//step 2 : 

test('_id is defined as id ', async () => {

    const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    blogs.body.forEach(b => expect(b.id).toBeDefined())
})
//Step 3
test('saving a new blog to the db', async () => {

    const newBlog = {
        title: "New Blog",
        author: "Chilloul mohamed",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const NewBlogs = await api.get('/api/blogs')
    expect(NewBlogs.body).toHaveLength(helper.blogs.length +1)

    const authors = NewBlogs.body.map(b => b.author)

    expect(authors).toContain('Chilloul mohamed')
})

//step 4 : 

test('if likes missed it will get the default value 0', async () => {
    const newBlog = {
        title: "New Blog",
        author: "Chilloul mohamed",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

    const NewBlogs = await api.get('/api/blogs')
    /* console.log({...newBlog,likes:0})
    expect(NewBlogs.body[6]).toEqual({...newBlog,likes:0}) */
    const blogsLikes = NewBlogs.body.map(b => b.likes)
    expect(blogsLikes[blogsLikes.length -1]).toBe(0)
})

//step 5

test('title and url are required !', async () => {
    const newBlog = {
        title: "New Blog",
        author: "Chilloul mohamed",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

    const NewBlogs = await api.get('/api/blogs')

    expect(NewBlogs.body).toHaveLength(helper.blogs.length)

})

afterAll(()=>{
    mongoose.connection.close()
})