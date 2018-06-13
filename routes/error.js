var express = require('express');
var path = require('path');
var router = express.Router();

// index page
router.get('/', function (req, res, next) {
    res.render('error', { title: 'Index Page' });
});

//app.get('/', function (req, res) {
//    res.render('LI/index');
//});

// about page 


//router.get('/Upload/add', function (req, res) {
//    res.render('Includes/LI/Upload_Add');
//});

module.exports = router;