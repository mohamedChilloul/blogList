const express = require('express')
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const config = require('./utils/config')
const {info, error} = require('./utils/logger')

const app = express()

info('connecting to :  ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).then(()=>{
    info('connected to MongoDB ')
}).catch(err => error('error connecting to MongoDB', err.message))

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)


module.exports = app