const express = require('express')
const router = express.Router()
const functions = require('../functions/functions.js')

router.get('/', functions.checkAuth, function(req, res){
  res.render('chat', {
    title: 'chat'
  })
})

module.exports = router