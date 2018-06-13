var express = require('express');
var path = require('path');
var router = express.Router();
var connection = require('../DB/config');

router.get('/', function (req, res) {
    res.render('LI/Received');
});

router.post('/GetReceivedData', function (req, res) {
    console.log(req.body.CommType);
    console.log(req.body.CompanyName);
    console.log(req.body.StatementDate);
    connection.config.query('CALL sp_LI_ImportedData_Get(?,?,?)', [req.body.CompanyName, req.body.CommType, req.body.StatementDate], function (err, results) {
        if (err) {
            res.status(400).send(err);
        }
       
        res.send(JSON.stringify(results[0]));
    });
    
});

router.get('/ReceivedAllData', function (req, res) {
    console.log(req.query.CommType);
    console.log(req.query.InsurerID);
    console.log(req.query.InsurerName);
    console.log(req.query.StatementDate);
    var Username = "ganesh";
    connection.config.query('CALL sp_LI_Payout_All_Data(?,?,?,?,?)', [req.query.StatementDate,req.query.InsurerID,req.query.InsurerName, req.query.CommType,Username ], function (err, results) {
        if (err) {
            res.status(400).send(err);
        }
        
        res.send(JSON.stringify(results[0]));
    });
    
});

module.exports = router;