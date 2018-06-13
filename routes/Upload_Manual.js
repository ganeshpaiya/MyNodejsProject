var express = require('express');
var path = require('path');
var router = express.Router();
var connection = require('../DB/config');
var uuid = require("uuid");
var UploadUniqueID = uuid.v4();

router.get('/', function (req, res) {
    res.render('Includes/LI/Upload_Manual');
});

router.post('/', function (req, res) {
    
    if (req.body.ddlCompanyName == undefined) {
        console.log(req.body.ddlCompanyName);
    }
    else {
        console.log(req.body.txtGST);
        console.log(req.body.txtTotalRevenue);
        console.log(req.body.ddlCompanyName);
        console.log(req.body.txtStatementDate);
        console.log(req.body.txtExchangeRate);
        console.log(req.body.txtTrWithGST);
        CompanyName = req.body.ddlCompanyName;
        StatementDate = req.body.txtStatementDate;
        CommType = req.body.CommType;
        var sql =connection.config.query('call sp_LI_UploadData_Add(?, ?, ?,?,?,?,?,?,?,?,?,?,?,?)',
            [UploadUniqueID, req.body.ddlCompanyName, req.body.CommType, req.body.txtStatementDate, req.body.txtTotalRevenue, 0.00, 0.00, req.body.txtTotalRevenue, req.body.txtGST, req.body.txtTrWithGST, 'Commtrack_LI_Biz_class_templete.xls', 'ganesh', req.body.txtExchangeRate, 1], function (err, result) {
                if (err) {
                    res.send('Error');
                }
                else {
                   
                }
            });

    }
});

module.exports = router;