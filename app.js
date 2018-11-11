const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const passport = require('passport')
const SteamStrategy = require('passport-steam')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const mysql = require('mysql')
const MySQLStore = require('express-mysql-session')(session)

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const chatRouter = require('./routes/chat')
const logoutRouter = require('./routes/logout')
const profileRouter = require('./routes/profile')


// create pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'test',
  password: 'test',
  database: 'registration'
})


// create session store
const options = {
  host: 'localhost',
  port: 3306,
  user: 'test',
  password: 'test',
  database: 'registration'
}
const sessionStore = new MySQLStore(options)


passport.serializeUser(function(user, done){
  // console.log('serializeUser = ', user)
  done(null, user)
})

passport.deserializeUser(function(obj, done){
  console.log('deserializeUser = ', obj)
  done(null, obj)
})

// steam
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/login/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: 'your api'
  }, function(identifier, profile, done){
    process.nextTick(function(){
      profile.indentifier = identifier
      return done(null, profile)
    })
  }
))

// local
passport.use(new LocalStrategy(
  function(username, password, done){
    // make search in database
    console.log('here we are');
    let sql = 'SELECT * FROM `users` WHERE name = \'' + username + '\' AND pass = \'' + password +'\'';
    console.log('sql = ', sql);
    pool.query(sql, function(error, results, fields){
      if(error) throw error
      console.log('The results is: ', results)
      if(results.length > 0) {
        let user = {
          provider: 'local',
          username: username,
          password: password
        }
        return done(null, user)
      }else{
        return done(null, false)
      }
    })
  }
))

// facebook
passport.use(new FacebookStrategy({
    clientID: 'your id',
    clientSecret: 'your secret key',
    callbackURL: 'https://hacker-chat.ru/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, done){
    return done(null, profile)
  }
))

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// session
app.use(session({
  secret: 'keyboard cat',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/login', loginRouter)
app.use('/chat', chatRouter)
app.use('/logout', logoutRouter)
app.use('/profile', profileRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
