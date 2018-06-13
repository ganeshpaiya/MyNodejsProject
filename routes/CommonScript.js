var express = require('express');
var path = require('path');
var router = express.Router();
var connection = require('../DB/config');

router.get('/', function (req, res) {
    
    //StatementDate = req.param('StatementDate');
    //TotalRevenue = req.param('TotalRevenue');
    //res.render('LI/Manual');
});
router.get('/GetLICommpanyName', function (req, res) {

   
    connection.config.query("SELECT  InsuranceBrokerID, BrokerName FROM fabos.dbo_tblinsurancebroker Order By BrokerName ", function (err, results) {
        if (err) {
            throw err;
        } else {

           res.send(JSON.stringify(results));
           // console.log(JSON.stringify(results));
            // res.render('LI/Manual', { rows: rows });
        }
    });
    
    //StatementDate = req.param('StatementDate');
    //TotalRevenue = req.param('TotalRevenue');
    //res.render('LI/Manual');
});

router.get('/GetLICommType', function (req, res) {
    //if (req.body.CompanyName == undefined) {
    //    console.log(req.body.ddlCompanyName);
    //}
    //else {
    //console.log(req.query.CommType);
    

    connection.config.query("SELECT Distinct CommType FROM master_li_uploaddata WHERE Deleted=0 AND InsurerName=?  ORDER BY CommType ASC ", [req.query.CommType], function (err, results) {
            if (err) {
                throw err;
            } else {

                res.send(JSON.stringify(results));
                //console.log(JSON.stringify(results));
                // res.render('LI/Manual', { rows: rows });
            }
        });
    //}

    //StatementDate = req.param('StatementDate');
    //TotalRevenue = req.param('TotalRevenue');
    //res.render('LI/Manual');
});

router.get('/GetLIStatementDate', function (req, res) {
    //if (req.body.CompanyName == undefined) {
    //    console.log(req.body.ddlCompanyName);
    //}
    //else {
    console.log(req.query.CommType);
    console.log(req.query.CompanyName);

    connection.config.query("SELECT Distinct DATE_FORMAT(StatementDate,\'%Y-%m-%d\') AS StatementDate FROM master_li_uploaddata WHERE Deleted=0 AND InsurerName=? AND CommType=? ORDER BY CommType ASC ", [req.query.CompanyName,req.query.CommType], function (err, results) {
        if (err) {
            throw err;
        } else {

            res.send(JSON.stringify(results));
            console.log(JSON.stringify(results));
            // res.render('LI/Manual', { rows: rows });
        }
    });
    
});
router.get('/GetKeyinTotalRevenue', function (req, res) {
    console.log(req.query.CommType);
    console.log(req.query.CompanyName);
    console.log(req.query.StatementDate);

    connection.config.query(" SELECT IFNULL(SUM(TRWithGST),0) As KeyinTotalRevenue FROM  master_li_uploaddata"
        + " WHERE UniqueID IN ( "
        + " SELECT UniqueID FROM master_li_uploaddata "
        + " WHERE InsurerName =? "
        + " AND CommType =?"
        + " AND StatementDate =? AND Deleted = 0)"
        + " AND Deleted = 0 ",
        [req.query.CompanyName, req.query.CommType, req.query.StatementDate], function (err, results) {
        if (err) {
            throw err;
        } else {

            res.send(JSON.stringify(results));
            console.log(JSON.stringify(results));
            // res.render('LI/Manual', { rows: rows });
        }
    });

});
router.get('/GetTotalRevenue', function (req, res) {
    console.log(req.query.CommType);
    console.log(req.query.CompanyName);
    console.log(req.query.StatementDate);

    connection.config.query(" SELECT SUM(((IFNULL(Bonus,0))+(IFNULL(Others,0))+(IFNULL(TotalRevenue,0))+(IFNULL(GSTAmount,0))))  As TotalRevenue FROM dbcommtrackv2.transaction_li_importeddata "
        + " WHERE UploadUniqueID IN ( "
        + " SELECT UniqueID FROM master_li_uploaddata "
        + " WHERE InsurerName =? "
        + " AND CommType = ? "
        + " AND StatementDate = ? AND Deleted = 0)"
        + " AND Deleted = 0 ", [req.query.CompanyName, req.query.CommType, req.query.StatementDate], function (err, results) {
        if (err) {
            throw err;
        } else {

            res.send(JSON.stringify(results));
            console.log(JSON.stringify(results));
            // res.render('LI/Manual', { rows: rows });
        }
    });

});
router.get('/GetReceivedTR', function (req, res) {
    //if (req.body.CompanyName == undefined) {
    //    console.log(req.body.ddlCompanyName);
    //}
    //else {
    console.log(req.query.CommType);
    console.log(req.query.CompanyName);

    connection.config.query("SELECT Distinct DATE_FORMAT(StatementDate,\'%Y-%m-%d\') AS StatementDate FROM master_li_uploaddata WHERE Deleted=0 AND InsurerName=? AND CommType=? ORDER BY CommType ASC ",
        [req.query.CompanyName, req.query.CommType], function (err, results) {
        if (err) {
            throw err;
        } else {

            res.send(JSON.stringify(results));
            console.log(JSON.stringify(results));
            // res.render('LI/Manual', { rows: rows });
        }
    });

});



module.exports = router;