var express = require('express');
var path = require('path');
var router = express.Router();
var connection = require('../DB/config');

router.get('/', function (req, res) {
    res.render('LI/Payment');
});

router.get('/payoutdate', function (req, res) {
   
    
   connection.config.query(" SELECT Distinct DATE_FORMAT(PayoutDate, '%d-%b-%Y')  As PayoutDate "
        + " FROM Transaction_LI_PayoutData WHERE InsurerName =? "
        + " AND Deleted = 0 AND PayoutStatus = 1 ORDER BY PayoutDate Desc ",
        [req.query.CompanyName], function (err, results) {
            if (err) {
                throw err;
            } else {

                res.send(JSON.stringify(results));
                console.log(JSON.stringify(results));
                // res.render('LI/Manual', { rows: rows });
            }
        });

});

router.get('/TRWithoutGST', function (req, res) {
    
    console.log(req.query.CompanyName);
    console.log(req.query.PayoutDate);
    var GetPayoutDate = req.query.Payout;
     console.log(req.query.CommType);
   connection.config.query(" SELECT IFNULL(SUM(TRWithoutGST),0) As TRWithoutGST FROM Transaction_LI_PayoutData "
        + " WHERE InsurerName =? AND PayoutDate =?"
        + " AND PayoutStatus = 1 AND AdjustmentFlag <> 1 AND Deleted = 0 ",
        [req.query.CompanyName, req.query.Payout], function (err, results) {
            if (err) {
                throw err;
            } else {

                res.send(JSON.stringify(results));
                console.log(JSON.stringify(results));
                // res.render('LI/Manual', { rows: rows });
            }
        });

});

router.get('/FARBI', function (req, res) {
    
    console.log(req.query.CompanyName);
        console.log(req.query.Payout);
   connection.config.query(" SELECT IFNULL(SUM(FARBI),0) As FARBI FROM Transaction_LI_PayoutData "
        + " WHERE InsurerName =? AND PayoutDate =? "
        + " AND PayoutStatus = 1 AND AdjustmentFlag <> 1 AND  Deleted = 0 ",
        [req.query.CompanyName, req.query.Payout], function (err, results) {
            if (err) {
                throw err;
            } else {

                res.send(JSON.stringify(results));
                console.log(JSON.stringify(results));
                // res.render('LI/Manual', { rows: rows });
            }
        });

});

router.get('/Adjustment', function (req, res) {

    console.log(req.query.CompanyName);
        console.log(req.query.Payout);
       connection.config.query("SELECT IFNULL(SUM(FARBI),0) As Adjustment FROM Transaction_LI_PayoutData "
            + " WHERE InsurerName =? AND PayoutDate =? "
            + " AND PayoutStatus = 1 AND (AdjustmentFlag = 1 AND AdjustmentType <> '') AND  Deleted = 0 ",
        [req.query.CompanyName, req.query.Payout], function (err, results) {
            if (err) {
                throw err;
            } else {

                res.send(JSON.stringify(results));
                console.log(JSON.stringify(results));
                // res.render('LI/Manual', { rows: rows });
            }
        });

});


router.get('/TotalFARTR', function (req, res) {

    console.log(req.query.CompanyName);
    console.log(req.query.Payout);
   connection.config.query("SELECT IFNULL(SUM(FARBI),0) As TotalFARTR FROM Transaction_LI_PayoutData "
        + " WHERE InsurerName =? AND PayoutDate =?"
        + " AND PayoutStatus = 1 AND  Deleted = 0 ",
        [req.query.CompanyName, req.query.Payout], function (err, results) {
            if (err) {
                throw err;
            } else {

                res.send(JSON.stringify(results));
                //console.log(JSON.stringify(results));
                // res.render('LI/Manual', { rows: rows });
            }
        });

});

router.post('/GetPaymentData', function (req, res) {
    
    console.log(req.body.CompanyName);
    console.log(req.body.Payout);
   connection.config.query('CALL sp_LI_PaymentData_Get(?,?)', [req.body.CompanyName,req.body.Payout], function (err, results) {
        if (err) {
            res.status(400).send(err);
        }
        //res.locals.pictures = results;
        //console.log(results[0]);
        ////res.render('../Upload', { pictures: results });
        //console.log(JSON.stringify(results));
        res.send(JSON.stringify(results[0]));
    });
    //sp_LI_ImportedData_Get
    //res.render('LI/Received');
});

module.exports = router;
