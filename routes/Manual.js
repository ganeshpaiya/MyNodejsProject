var express = require('express');
var path = require('path');
var router = express.Router();
var connection = require('../DB/config');
var uuid = require("uuid");
var UploadUniqueID = uuid.v4();
var id = "";
var UploadID = "";
var InsurerName = "";
var StatementDate = "";
var TotalRevenue = "";
router.use(express.static(path.join(__dirname, 'public')));

//console.log(UploadUniqueID);
// router.get('/:UniqueID& InsurerName=:id', function (req, res) {
router.get('/', function (req, res) {
    id = req.param('UniqueID');
    UploadID = req.param('UploadID');
    InsurerName = req.param('InsurerName');
    StatementDate = req.param('StatementDate');
    TotalRevenue = req.param('TotalRevenue');
    res.render('LI/Manual');
});

router.get('/Getname', function (req, res) {

   connection.config.query("SELECT FACode,  CONCAT(Name, '_[', FACode, ']_(',FAStatus ,')') As FARName FROM fabos.dbo_tblfapersonal ORDER By Name", function (err, rows) {
        if (err) {
            throw err;
        } else {

            res.send(JSON.stringify(rows));
            //console.log(JSON.stringify(rows));
            // res.render('LI/Manual', { rows: rows });
        }
    });


});

router.get('/GetHeader', function (req, res) {


    var feed = { UploadUniqueID: id, UploadID: UploadID, InsurerName: InsurerName, StatementDate: StatementDate, TotalRevenue: TotalRevenue };

    var data = [];
    data.push(feed);

    res.send(JSON.stringify(data));
    //console.log(JSON.stringify(data));
    // res.render('LI/Manual', { rows: rows });



});
router.post('/Manualadd', function (req, res) {
    console.log(req.body.FARCode);
    console.log(req.body.FARStatus);
    console.log(req.body.FARName);
    console.log(req.body.UploadUniqueID);
    console.log(req.body.txtCompanyName);
    console.log(req.body.ddlFARName);
    console.log(req.body.txtClientName);
    console.log(req.body.txtPlanName);
    console.log(req.body.txtPolicyNumber);
    console.log(req.body.txtCommencementDate);
    console.log(req.body.txtPremiumPaid);
    console.log(req.body.ddlFARType);
    console.log(req.body.ddlPremiumMode);
    console.log(req.body.txtFARPercentage);
    console.log(req.body.txtTotalRevenue);
    console.log(req.body.txtBonus);
    console.log(req.body.txtOthers);
    console.log(req.body.txtTRWithoutGST);
    console.log(req.body.txtGST);
    console.log(req.body.txtTRwithGST);
    console.log(req.body.txtFARBI);
    console.log(req.body.txtPremiumYear);
    console.log(req.body.ddlRevenueStatus);
    console.log(req.body.txtAdminRemarks);

    var sql =connection.config.query('call sp_LI_ManualData_Add(?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [req.body.UploadUniqueID, '', req.body.txtCompanyName, req.body.FARCode, req.body.FARName, req.body.FARStatus, req.body.txtPolicyNumber,
         req.body.txtClientName, req.body.txtPlanName, req.body.txtCommencementDate, req.body.ddlPremiumMode, req.body.txtPremiumPaid, req.body.txtBonus,
         req.body.txtOthers, req.body.txtTotalRevenue, req.body.txtFARPercentage, req.body.txtFARBI, req.body.txtPremiumYear, '', req.body.txtAdminRemarks,
         'Verified', '', '', '', req.body.ddlRevenueStatus, '0', req.body.ddlFARType, '0', 'ganesh', req.body.txtGST, req.body.txtTRwithGST],
        function (err, result) {
            if (err) {
                res.send('Error');
            }
            else {

            }
        });

    res.render('LI/Manual', { data: 'Success' });


    });
router.post('/GetManualData', function (req, res) {
   connection.config.query('CALL sp_LI_ManualData_Get(?)', [req.body.UploadUniqueID], function (err, results) {
        if (err) {
            res.status(400).send(err);
        }
        //res.locals.pictures = results;
        //console.log(results[0]);
        ////res.render('../Upload', { pictures: results });
        console.log(JSON.stringify(results[0]));
        res.send(JSON.stringify(results[0]));
    });

    //res.render('LI/Manual', { data: 'Success' });


});

module.exports = router;