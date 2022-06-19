


const errHandler = (err, req, res, next) => {
    if(err.name === 'ValidationError'){
        return res.status(400).json({
            error : err.message
        })
    }else if(err.name === 'JsonWebTokenError'){
        return res.status(401).json({
            error : err.message
        })
    }else if(err.name === 'TokenExpiredError'){
        return res.status(401).json({
            error : err.message
        })
    }
    next(err)
}

module.exports = errHandler