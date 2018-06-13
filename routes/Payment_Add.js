var express = require('express');
var path = require('path');
var router = express.Router();
var db = require('../DB/config');
var id = "";
var UploadID = "";
var InsurerName = "";
var StatementDate = "";
var TotalRevenue = "";
router.get('/Api/FaibosDB/tblfapersonal', function (req, res) {

    //console.log(db);
    console.log(db.fabos);
    //console.log(db.config);

   

            
        
    
    //db.fabos.query("SELECT * FROM dbo_tblfapersonal"
    // , function (err, results) {
    //        if (err) {
    //            throw err;
    //        } else {

    //            res.send(JSON.stringify(results));
    //            console.log(JSON.stringify(results));
    //            // res.render('LI/Manual', { rows: rows });
    //        }
    //    });
    TotalRevenue = req.param('TotalRevenue');

    res.render('Includes/LI/Payment_Add');
});


module.exports = router;