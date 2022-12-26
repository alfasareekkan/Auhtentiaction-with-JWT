const { application } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./routes/authRouts');
const cookieParser = require('cookie-parser')
const authMiddleware =require('./middleware/authMiddleware')
 
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

dotenv.config()
// database connection
const dbURI = process.env.DATABASE;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    app.listen(3000)
    console.log('server listening on port 3000')
  })
  .catch((err) => console.log(err));

// routes
app.get('*',authMiddleware.checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',authMiddleware.requireAuth, (req, res) => res.render('smoothies'));
app.use(authRouter) 

// app.get('/set-cookies', (req, res) =>{
//   res.cookie('newUser', false, {
//     maxAge: 1000 * 60 * 60 * 24,
//     //only access through http request we can't access cookies from document.cookies
//     httpOnly:true
//   })
//   res.cookie('dsfgdsfg', true)

//   res.send('you got the cookies')
// }) 

// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies
//   console.log(cookies)
//   res.json(cookies)  
// })
