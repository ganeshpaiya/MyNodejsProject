var express = require('express');
var path = require('path');
var router = express.Router();
var connection = require('../DB/config');

router.get('/', function (req, res) {
    res.render('LI/Payout');
});


router.get('/TRWithoutGST', function (req, res) {
    console.log(req.query.CommType);
    console.log(req.query.CompanyName);
    console.log(req.query.StatementDate);

   connection.config.query(" SELECT IFNULL(SUM(TRWithoutGST),0) As TRWithoutGST FROM Transaction_LI_PayoutData "
        + "WHERE UploadUniqueID IN ( "
        + " SELECT UniqueID FROM master_li_uploaddata "
        + " WHERE InsurerName =? "
        + " AND CommType = ? "
        + " AND StatementDate = ? AND Deleted = 0)"
        + " AND PayoutStatus = 0 AND Deleted = 0 ", [req.query.CompanyName, req.query.CommType, req.query.StatementDate], function (err, results) {
            if (err) {
                throw err;
            } else {

                res.send(JSON.stringify(results));
                console.log(JSON.stringify(results));
                // res.render('LI/Manual', { rows: rows });
            }
        });

});

router.get('/GetFARBI', function (req, res) {
    console.log(req.query.CommType);
    console.log(req.query.CompanyName);
    console.log(req.query.StatementDate);

   connection.config.query(" SELECT IFNULL(SUM(FARBI),0) As FARBI FROM Transaction_LI_PayoutData "
        + " WHERE UploadUniqueID IN "
        + " (SELECT UniqueID FROM Master_LI_UploadData WHERE "
        + " InsurerName =? "
        + " AND CommType =? "
        + " AND StatementDate =? AND Deleted = 0)"
        + " AND PayoutStatus = 0 AND  Deleted = 0 ", [req.query.CompanyName, req.query.CommType, req.query.StatementDate], function (err, results) {
            if (err) {
                throw err;
            } else {

                res.send(JSON.stringify(results));
                console.log(JSON.stringify(results));
                // res.render('LI/Manual', { rows: rows });
            }
        });

});


router.post('/GetPayoutData', function (req, res) {
    console.log(req.body.CommType);
    console.log(req.body.CompanyName);
    console.log(req.body.StatementDate);
   connection.config.query('CALL sp_LI_PayoutData_Get(?,?,?)', [req.body.CompanyName, req.body.CommType, req.body.StatementDate], function (err, results) {
        if (err) {
            res.status(400).send(err);
        }
        //res.locals.pictures = results;
        //console.log(results[0]);
        ////res.render('../Upload', { pictures: results });
        console.log(JSON.stringify(results));
        res.send(JSON.stringify(results[0]));
    });
    //sp_LI_ImportedData_Get
    //res.render('LI/Received');
});

router.put('/PayoutAllData', function (req, res) {
    console.log(req.body.PayoutDate);
    console.log(req.body.CommType);
    console.log(req.body.InsurerName);
    console.log(req.body.StatementDate);
    var Username = "ganesh";
   connection.config.query("UPDATE Transaction_LI_PayoutData SET PayoutStatus = 1, PayoutDate =?,"
        + " UpdatedBy=?"
        + " WHERE UploadUniqueID IN (SELECT UniqueID FROM Master_LI_UploadData WHERE"
        + " InsurerName =?"
        + " AND CommType =?"
        + " AND StatementDate =? AND Deleted = 0)"
        + " AND Deleted = 0 AND PayoutStatus = 0", [req.body.PayoutDate, Username, req.body.InsurerName, req.body.CommType, req.body.StatementDate], function (err, results) {
        if (err) {
            res.status(400).send(err);
        }
        //res.locals.pictures = results;
        //console.log(results[0]);
        ////res.render('../Upload', { pictures: results });
        console.log(JSON.stringify(results));
        res.send(JSON.stringify(results[0]));
    });
    //sp_LI_ImportedData_Get
    //res.render('LI/Received');
});


module.exports = router;