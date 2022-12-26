const { Router } = require('express')
const router = Router()
const authController = require('../controller/authController')

router.get('/signup', authController.signupGet)
router.post('/signup', authController.signupPost)

router.get('/login',authController.loginGet)

router.post('/login', authController.loginPost)
router.get('/logout', authController.logoutGet)

 

module.exports = router