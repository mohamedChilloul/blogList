const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const helper = require('./helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
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
    await User.deleteMany({})
        const passwordHash = await bcrypt.hash('root', 10)
        const newUser = {
            username : 'root',
            name : 'mohamed',
            passwordHash : passwordHash
        }
        const user = new User(newUser)
        await user.save()

        
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

    // login and getting the token 
    const login = await api
    .post('/api/login')
    .send({
        username : 'root',
        password : 'root'
    })
    console.log(login.body.token)
    await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${login.body.token}`)
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

    // login and getting the token 
    const login = await api
    .post('/api/login')
    .send({
        username : 'root',
        password : 'root'
    })

    await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${login.body.token}`)
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
        author: "Chilloul mohamed",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }

    // login and getting the token 
    const login = await api
    .post('/api/login')
    .send({
        username : 'root',
        password : 'root'
    })

    await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${login.body.token}`)
    .send(newBlog)
    .expect(400)

    const NewBlogs = await api.get('/api/blogs')

    expect(NewBlogs.body).toHaveLength(helper.blogs.length)

})

//test delete functionality 

test('delete a blog with valid id', async () => {

    const initBlogs = await api.get('/api/blogs')
    let idToDelete = initBlogs.body[0].id

    // login and getting the token 
    const login = await api
    .post('/api/login')
    .send({
        username : 'root',
        password : 'root'
    })
    console.log(login.body.token)
    await api
    .delete(`/api/blogs/${idToDelete}`)
    .set('Authorization', `bearer ${login.body.token}`)
    .expect(204)

    const lastBlogs = await api.get('/api/blogs')
    expect(lastBlogs.body.length).toBe(helper.blogs.length -1)
})

/* test('delete a blog with not valid id', async () => {

    let idToDelete ='jhjkhJHbhjBjhbè_y78'

    await api
    .delete(`/api/blogs/${idToDelete}`)
    .expect(404)

    const lastBlogs = await api.get('/api/blogs')
    expect(lastBlogs.body.length).toBe(helper.blogs.length)
}) */

//update test :

test('update existing Blog ', async () =>{
    const blogsBefore = await api.get('/api/blogs')
    const idToUpdate = blogsBefore.body[0].id
    console.log(blogsBefore.body[0])
    const newBlog = {
        title: 'new Blog ..',
        author: 'chilloul',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 7,
    } 
    await api
    .put(`/api/blogs/${idToUpdate}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsAfter = await api.get('/api/blogs')
    console.log(blogsAfter.body[0])
    expect(blogsAfter.body[0]).not.toEqual(blogsBefore.body[0])
})

afterAll(()=>{
    mongoose.connection.close()
})