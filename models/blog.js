const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title : String,
    author : String,
    url : String ,
    likes : {
        type : Number,
        required : true,
        default :0
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})

blogSchema.set('toJSON',{
    transform : (document, retObject)=>{
        retObject.id = retObject._id.toString()
        delete retObject._id
        delete retObject.__v
    }
})

module.exports = mongoose.model('Blog',blogSchema)