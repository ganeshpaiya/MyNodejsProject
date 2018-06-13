var express = require('express');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: '/uploads' });
var flash = require('connect-flash');
var uuid = require('uuid');
var bodyParser = require('body-parser');
var multipart = require("multipart");
var upload = multer();
var debug = require('debug');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var dateFormat = require('dateformat');
var Request = require('request');
var router = express.Router();

var uuid = require("uuid");
var UploadUniqueID = uuid.v4();
console.log(UploadUniqueID);
var StatementDate = "";
var CompanyName = "";
var CommType = "";
router.get('/', function (req, res) {
    res.render('Includes/LI/Upload_Add');
});

//var app = express();
//app.use(express.bodyParser());
var connection = require('../DB/config');
var filename = "";

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {

        var datetimestamp = dateFormat(new Date(), "yyyy~mm~dd h~MM~ss");
        // var datetimestamp = Date.now("yyyy-MM-dd HHmmtt");
        cb(null, 'Commtrack_LI_Biz_class_templete' + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
        filename = file.fieldname;


    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');


router.post('/', function (req, res) {
    
    if (req.body.ddlCompanyName == undefined) {
       
        Createexceltemptable();
       
        
    }
    
    else {
       
        console.log(req.body.txtGST);
        CompanyName = req.body.ddlCompanyName;
        StatementDate = req.body.txtStatementDate;
        CommType = req.body.CommType;
      
        var sql =connection.config.query('call sp_LI_UploadData_Add(?, ?, ?,?,?,?,?,?,?,?,?,?,?,?)',
            [UploadUniqueID, req.body.ddlCompanyName, CommType, req.body.txtStatementDate, req.body.txtTotalRevenue, 0.00, 0.00, req.body.txtTotalRevenue, req.body.txtGST, req.body.txtTrWithGST, 'Commtrack_LI_Biz_class_templete.xls', 'ganesh', req.body.txtExchangeRate, 0], function (err, result) {
                if (err ) {
                    res.send('Error');
                    console.log(err.message);
                }
                else {
                    console.log("successful UploadData");
                   // Callvalidateexcelsheet();
                }
            });

    }
    // if connection is successful
    var exceltojson;
    upload(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            // req.flash('error', 'Could not update your name, please contact our support team');
            //res.json({ error_code: 1, err_desc: "No file passed" });
            // res.send('<script>alert("No file passed");</script>');
            return;
        }
        /** Check the extension of the incoming file and 
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                //lowerCaseHeaders: true

            }, function (err, result) {
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                    //res.send('<script>alert("Excel Sheet Error");</script>');
                }
                //res.json({data: result });
                //res.send('<script>alert("Excel File Updload Successful");</script>');
                var values = [];

                //console.log(JSON.stringify({ data: result }, { header: 1, raw: true }));

                for (var i = 0; i < result.length; i++) {
                    var keyss = [];
                    keyss.push(UploadUniqueID);
                    Object.keys(result[i]).forEach(function (key) {


                        if (key != '') {
                            keyss.push(result[i]['' + key]);

                        }
                    });

                    values.push(keyss);
                }


                var sql1 =connection.config.query('INSERT INTO li_tempcommissiondata'
                    + '(UploadUniqueID,TRWithGST, FARName, FARcode, Repcode, PolicyNumber, ClientName,PlanName, CommencementDate, PremiumMode, PremiumPaid, TotalRevenue, GSTAmount,Bonus,Others) VALUES ? ',
                    [values], function (err, result) {
                        if (err) {
                            console.log(err.message);
                        }
                        else {
                            
                            console.log("successful tempcommissiondata");
                         // res.redirect("/api/fabosDB/Get_AgentCode/"+UploadUniqueID);
                            Callvalidateexcelsheet();
                         // router.get('/', function (req, res, next) {
                            Request.post({
                                "headers": { "content-type": "application/json" },
                                "url":'http://localhost:1337/Api/fabosDB/Get_AgentCode',
                                "body": JSON.stringify({
                                    "UploadUniqueID": UploadUniqueID,
                                    "StatementDate": StatementDate,
                                    "CommType": CommType
                                })
                            }, (error, response, body) => {
                                if (error) {
                                    return console.dir(error);
                                }
                                console.log(body);
                                
                                call();
                                });

                            //VestingData
                            //Request.post({
                            //    "headers": { "content-type": "application/json" },
                            //    "url": 'http://localhost:1337/Api/fabosDB/VestingData',
                            //    "body": JSON.stringify({
                            //        "UploadUniqueID": UploadUniqueID,
                            //        "StatementDate": StatementDate,
                            //        "CommType": CommType
                            //    })
                            //}, (error, response, body) => {
                            //    if (error) {
                            //        return console.dir(error);
                            //    }
                            //    console.dir(JSON.parse(body));
                               
                            //});
                        }
                    });

            });
        } catch (e) {
            //res.json({ error_code: 1, err_desc: "Error" });
            //res.send('<script>alert("Excel Sheet Error");</script>');
        }

       // res.json({ error_code: 1, err_desc: "SUCCESS" });
       // res.send(""));
    })
    function call() {
        console.log("test");
    }
    function Callvalidateexcelsheet() {
        console.log(UploadUniqueID);
        console.log(StatementDate);
        console.log(CompanyName);
        console.log(CommType);

        var sql2 = connection.config.query('call sp_LI_validate_excelsheet(?, ?, ?,?)',
            [UploadUniqueID, CompanyName, CommType, StatementDate], function (err, result) {
                if (err) {
                    console.log(err.message);
                    // next();
                    //res.send('Error');
                }
                else {
                    console.log("successful sp_LI_validate_excelsheet");
                    //CallLIVerifingProcess();

                    res.send(JSON.stringify(result[0]));


                }
            });
    }
    
    function CallLIVerifingProcess() {
        console.log("sp_LI_VerifingProcess");
        console.log(UploadUniqueID);
        console.log(StatementDate);
        console.log(CompanyName);
        console.log(CommType);
        var sql2 =connection.config.query('call sp_LI_VerifingProcess(?, ?,?)',
            [CompanyName, UploadUniqueID, StatementDate], function (err, result) {
                if (err ) {
                    console.log(err.message);
                    // next();

                    //res.send('Error');
                }
                else {
                    //res.json({ error_code: 1, err_desc: "SUCCESS" });
                    console.log(result);
                    console.log("successful sp_LI_VerifingProcess");

                }
            });

    }
   // res.redirect("/Api/FaibosDB/Get_AgentCode");
   // res.json({ error_code: 1, err_desc: "SUCCESS" })
   
   // res.redirect("/LI/Upload");
   // res.send(200, 'Success');
    //res.send('<script>window.close()</script>');
    //res.render('LI/Upload');
});
router.get('/validateexcelshee', function (req, res) {
    
    //console.log(UploadUniqueID);
    //console.log(StatementDate);
    //console.log(CompanyName);
    //console.log(CommType);
    
    //var sql2 =connection.config.query('call sp_LI_validate_excelsheet(?, ?, ?,?)',
    //    [UploadUniqueID, CompanyName, CommType, StatementDate], function (err, result) {
    //        if (err) {
    //            console.log(err.message);
    //            // next();
    //            //res.send('Error');
    //        }
    //        else {
    //            console.log("successful sp_LI_validate_excelsheet");
    //            //CallLIVerifingProcess();

    //            res.send(JSON.stringify(result[0]));
               

    //        }
    //    });


});
router.get('/VerifingProcess', function (req, res) {
console.log("sp_LI_VerifingProcess");
console.log(UploadUniqueID);
console.log(StatementDate);
console.log(CompanyName);
console.log(CommType);
var sql2 =connection.config.query('call sp_LI_VerifingProcess(?, ?,?)',
    [CompanyName, UploadUniqueID, StatementDate], function (err, result) {
        if (err) {
            console.log(err.message);
            // next();

            //res.send('Error');
        }
        else {
            //res.json({ error_code: 1, err_desc: "SUCCESS" });
            console.log(result);
            res.send(JSON.stringify(result[0]));

        }
    });
});

router.get('/api/fabosDB/Get_AgentCode/:id', function (req, res) {

    console.log("sp_LI_validate_excelsheet");
    console.log(UploadUniqueID);
    //console.log(StatementDate);
    //console.log(CompanyName);
    //console.log(CommType);

    //var sql2 =connection.config.query('call sp_LI_validate_excelsheet(?, ?, ?,?)',
    //    [UploadUniqueID, CompanyName, CommType, StatementDate], function (err, result) {
    //        if (err) {
    //            console.log(err.message);
    //            // next();
    //            //res.send('Error');
    //        }
    //        else {
    //            console.log("successful sp_LI_validate_excelsheet");



    //        }
    //    });
});




function openRequestedPopup() {
   
}
router.get('/', function (req, res) {
    res.render('LI/Upload');
});
//#region Create Temp table

function Createexceltemptable() {
    //connection.connect(function (err) {
    //    if (err) throw err;
    var sql = "DROP TABLE IF EXISTS  li_tempcommissiondata";
   connection.config.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table deleted");
        //});
    });

    //connection.connect(function (err) {
    //    if (err) throw err;


    //var sql = "CREATE TABLE IF NOT EXISTS LI_TempCommissionData ("
    //    + "id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))";
    //connection.query(sql, function (err, result) {
    //    if (err) throw err;
       
    //});

    let createTodos = `CREATE TABLE IF NOT EXISTS li_tempcommissiondata(
                              Id int primary key auto_increment,
                              UploadUniqueID varchar(255)not null,
                              FARName varchar (100) NULL,
                              FARcode varchar (100) NULL,
                              Repcode varchar (100) NULL,
                              PolicyNumber varchar (100) NULL,
                              ClientName varchar (100) NULL,
                              PlanName varchar (100) NULL,
                              CommencementDate varchar (100) NULL,
                              PremiumMode varchar (100) NULL,
                              PremiumPaid varchar (100) NULL,
                              TotalRevenue varchar (100) NULL,
                              GSTAmount varchar (100) NULL,
                              Bonus varchar (100) NULL,
                              Others varchar (100) NULL,
                              TRWithGST varchar (100) NULL,
                              Status varchar (100) NULL,
                              ErrorField varchar (100) NULL
                          
                      )`;

   connection.config.query(createTodos, function (err, results, fields) {
        if (err) {
            console.log(err.message);

        }
        else {
            console.log("Table created");
        }

    });


}
//#endregion

module.exports = router;