const express = require('express')
const router = express.Router()
const functions = require('../functions/functions.js')

router.get('/', functions.checkAuth, function(req, res){
  res.render('profile', {
    title: 'Profile'
  })
})

module.exports = router