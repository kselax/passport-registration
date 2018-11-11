const express = require('express')
const router = express.Router()
const passport = require('passport')


// login page

/*
Local
*/
router.get('/', function(req, res){
  res.render('login', {
    title: 'log in'
  })
})

router.post('/',
  passport.authenticate('local', { failureRedirect: '/login'}),
  function(req, res){
    res.redirect('/')
  }
)



/*
Steam
*/
router.get('/steam', 
  passport.authenticate('steam', { failureRedirect: '/login'}),
  function(req, res){
    res.redirect('/')
  }
)

router.get('/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res){
    res.redirect('/')
  }
)


/*
Facebook
*/
router.get('/facebook',
  passport.authenticate('facebook')
)

router.get('/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res){
    res.redirect('/')
  }
)


module.exports = router;