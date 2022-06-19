const config = require('../utils/config')
const jwt = require('jsonwebtoken')


const tokenExtractor = (req, res, next) =>{
    const authorization = req.get('Authorization')
    if(authorization && authorization.toLocaleLowerCase().startsWith('bearer')){
        req.token =  authorization.substring(7)
        next() 
    }else{
        req.token = null
        next()
    }
}
const userExtractor = (req, res, next) =>{
    const token = req.token
    console.log('token : => ', token)
    const decodedToken = jwt.verify(token, config.SECRET)
    req.user = decodedToken.id
    next()
}
module.exports = {
    tokenExtractor,
    userExtractor
}