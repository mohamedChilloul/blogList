const mongoose = require('mongoose')



const userShema = new mongoose.Schema({
    username : {
        type : String,
        minlength : 3
    },
    name : String,
    passwordHash : String,
    blogs : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Blog'
        }
    ]
})

userShema.set('toJSON', {
     transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
        delete returnedObj.passwordHash
    }
})

const User = mongoose.model('User', userShema)

module.exports = User