const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title : String,
    author : String,
    url : String ,
    likes : Number
})

blogSchema.set('toJSON',{
    transform : (document, retObject)=>{
        retObject.id = retObject._id.toString()
        delete retObject._id
        delete retObject.__v
    }
})

module.exports = mongoose.model('Blog',blogSchema)