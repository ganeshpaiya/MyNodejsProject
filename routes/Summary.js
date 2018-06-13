var express = require('express');
var path = require('path');
var router = express.Router();
var connection = require('../DB/config');

router.get('/', function (req, res) {
    res.render('LI/Summary');
});




/* GET Summary page. */
router.get('/GetSummaryData', function (req, res, next) {
    console.log(req.body.CompanyName);
   connection.config.query("SELECT * FROM master_li_importeddatasummary WHERE Deleted =?  ORDER BY StatementDate DESC", [0], function (err, rows) {
        if (err) {
            throw err;
        } else {

            res.send(JSON.stringify(rows));
            //console.log(JSON.stringify(rows));
            // res.render('LI/Manual', { rows: rows });
        }
    });

   connection.config.query('CALL sp_LI_UploadData_Get(?)', [''], function (err, results, fields) {
        if (err) {
            res.status(400).send(err);
        }
        //res.locals.pictures = results;
        //console.log(results[0]);
        ////res.render('../Upload', { pictures: results });
        //console.log(JSON.stringify(results[0]));
        res.send(JSON.stringify(results[0]));
    });

    //connection.end();

    //function executeStoredProc() {

    //        //var dbConn = new sql.Connection(config);
    //        connection.connect.then(function () {
    //            var request = new sql.Request(connection);
    //            request.input('P_CompanyName', '');

    //            request.execute('sp_LI_UploadData_Get', function (err, recordsets, returnValue) {
    //                // ... error checks 
    //                res.send(JSON.stringify(recordsets));

    //            });
    //        });

    //    var request = new sql.Request(connection);
    //    request.input('P_CompanyName', '')
    //            .execute("sp_LI_UploadData_Get").then(function (err, results, fields) {
    //                res.send(JSON.stringify(results));
    //                console.log(results);
    //                connection.close();
    //            }).catch(function (err) {

    //                    console.log(err);
    //                    connection.close();
    //            });
    //}).catch(function (err) {

    //        console.log(err);
    //});
    //}

    //executeStoredProc();

    //connection.connect();


    //connection.query('SELECT InsurerName,ifnull(CommType,0) AS CommType,DATE_FORMAT(StatementDate, "%Y/%m/%d") AS StatementDate,ManualFlag AS Action,'
    //    +' ifnull(BasicAmount, 0) AS BasicAmount, GST, TRWithGST, ifnull(TotalTransNo, 0) AS TotalTransNo, '
    //    +' ("Completed")AS Status, TotalTransNo, CreatedBy, DATE_FORMAT(CreatedOn, "%Y/%m/%d  %h:%i %p") AS CreatedOn '
    //    + 'FROM master_li_uploaddata WHERE Deleted= 0', function (err, results, fields) {

    //        if (err) {
    //            res.status(400).send(err);
    //                 }
    //         else{ console.log(results);
    //        res.send(JSON.stringify(results));
    //             }

    //});

    //connection.end();
});



module.exports = router;