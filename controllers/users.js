const User = require('../models/user')
const userRouter = require('express').Router()
const bcrypt = require('bcrypt')

userRouter.post('/', async (req, res) => {
    const {username, name, password} = req.body

    if(!username || !password){
        return res.status(400).json({
            error : 'missing password or username '
        })
    }

    const existed = await User.findOne({username})
    if(existed){
        return res.status(400).json({
            error : 'username must be unique'
        })
    }
    if(password.length < 3){
        return res.status(400).json({
            error : 'password length must be > 3 '
        })
    }
    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = new User({username, name, passwordHash})

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
})

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', {title : 1, author : 1, url:1})
    res.status(200).json(users)
})

module.exports = userRouter