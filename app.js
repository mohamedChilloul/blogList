const express = require('express')
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const config = require('./utils/config')
const {info, error} = require('./utils/logger')
const userRouter = require('./controllers/users')
const errorHandler = require('./utils/errorHandler')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const app = express()

info('connecting to :  ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).then(()=>{
    info('connected to MongoDB ')
}).catch(err => error('error connecting to MongoDB', err.message))

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
require('dotenv').config()

if(process.env.NODE_ENV === 'test'){
    const testRouter = require('./controllers/tests')
    app.use('/api/testing', testRouter)
}
app.use(errorHandler)

module.exports = app