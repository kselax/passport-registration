var express = require('express');
var router = express.Router();
const functions = require('../functions/functions')

/* GET home page. */
router.get('/', functions.checkAuth, function(req, res, next) {
  res.render('index', { 
    title: 'Main',
    user: req.user
  });
});

module.exports = router;
