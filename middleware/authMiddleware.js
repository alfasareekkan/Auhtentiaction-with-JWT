const jwt = require('jsonwebtoken');
const User=require('../model/User')


const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt
    //check json web token is valid or exists

    if (token) {
        jwt.verify(token, 'qwertyuiopasdfghjkl', (err,decodedToken) => {
            if (err) {
                res.redirect('/login')
            }
            else {
                console.log(decodedToken)
                next()
            }
        })
    }
    else {
        res.redirect('/login')
    
    }
}
 
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, 'qwertyuiopasdfghjkl', async(err,decodedToken) => {
            if (err) {
                res.locals.user=null

                next()
            }
            else {
                let user = await User.findOne(decodedToken.id)
                res.locals.user=user
                next()
            }
        })
    }
    else {
        res.locals.user = null
        next()
        
    }
}
module.exports = { requireAuth,checkUser }