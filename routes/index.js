var express = require('express');
var path = require('path');
var router = express.Router();
var db = require('../db/config');

// index page
router.get('/', function (req, res, next) {
    res.render('Global/index', { title: 'Index Page' });
});
router.get('/check1', function (req, res, next) {
    var sql_query = "SELECT * from dbo_tblfapersonal";
    db.fabos.query(sql_query, function (err, result) {

        if (err) {
            console.log(err);
        }

        else {
            res.send(JSON.stringify(result));
        }

    });
});
router.get('/check2', function (req, res, next) {
    var sql_query = "SELECT * from Transaction_LI_PayoutData";
    db.config.query(sql_query, function (err, result) {

        if (err) {
            console.log(err);
        }

        else {
            res.send(JSON.stringify(result));
        }

    });
});
router.get('/index', function (req, res, next) {
    res.render('Global/index', { title: 'Index Page' });
});
//app.get('/', function (req, res) {
//    res.render('LI/index');
//});

// about page 


//router.get('/Upload/add', function (req, res) {
//    res.render('Includes/LI/Upload_Add');
//});

module.exports = router;