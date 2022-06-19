const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')


loginRouter.post('/', async (req, res) => {
    const {username, password} = req.body 

    const user = await User.findOne({username})
    const passCorrect = bcrypt.compare(password, user.passwordHash)

    if(!user || !passCorrect){
        return res.json(401).json({
            error : 'invalid user name or password'
        })
    }

    const userForToken = {
        username : user.username,
        id : user._id
    }

    const token = jwt.sign(userForToken, config.SECRET, { expiresIn : 60*60 })
    res.status(200).send({ token, username: user.username, name : user.name })
})

module.exports = loginRouter