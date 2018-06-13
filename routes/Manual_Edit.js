var express = require('express');
var path = require('path');
var router = express.Router();
var connection = require('../DB/config');
var id = "";
var UploadID = "";
var InsurerName = "";
var StatementDate = "";
var TotalRevenue = "";
router.get('/', function (req, res) {
    id = req.param('ImportedID');
    UploadID = req.param('UniqueID');
    InsurerName = req.param('InsurerName');
    StatementDate = req.param('StatementDate');
    TotalRevenue = req.param('TotalRevenue');

    res.render('Includes/LI/Manual_Edit');
});
router.get('/GetManualData', function (req, res) {
    console.log(id);
    console.log(UploadID);
    console.log(InsurerName);
    var query =connection.config.query('SELECT * FROM Transaction_LI_ImportedData WHERE ImportedID = ? AND UploadUniqueID=?', [id, UploadID],
        function (err, result) {
            if (err) {
                res.send(err);
            }
            console.log(JSON.stringify(result));
            res.send(JSON.stringify(result));
    
    });
   
    //res.render('Includes/LI/Manual_Edit');
});

module.exports = router;

