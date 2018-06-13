var mysql = require('mysql');
var express = require('express');
var path = require('path');
var defered = require('deferred');
var router = express.Router();
var connection = require('../DB/config');

router.get('/', function (req, res) {
    res.render('LI/Upload');
});




//config.connect(function (err) {
//    if (err) throw err;
//    console.log("Connected!");
//});

router.post('/VestingData', function (req, res, next) {

    var test = req.body.UploadUniqueID;
    var test1 = req.body.StatementDate;
    var test2 = req.body.CommType;
});

router.post('/Get_AgentCode', function (req, res, next) {
    var UploadUniqueID = req.body.UploadUniqueID;
    var test1 = req.body.StatementDate;
    var test2 = req.body.CommType;
    var InsAgentCode = [];
    var FARCodeVerified = [];
    var PolicyVerified = [];
    var PolicyNum = [];
    var TRWithoutGST;
    var TRWithGST;


    

    var sql_InsAgentCode = "SELECT InsAgentCode FROM transaction_li_importeddata"
        + " WHERE UploadUniqueID='" + UploadUniqueID + "'"
    connection.config.query(sql_InsAgentCode, function (err, result, fields) {
        if (err) {
            console.log(err);
        } else {
            // var j = 0;
            InsAgentCode = JSON.stringify(result);
            var json = JSON.parse(InsAgentCode);
                var RepCode = json.map(function (x) { return x.InsAgentCode });
                connection.fabos.query("SELECT Name as FARName, FACode as FARCode, LI_AIA As AuthorCode,LI_AIA As InsAgentCode, A.FAStatus as FARStatus FROM dbo_tblfapersonal A "
                    + "INNER JOIN dbo_tblauthorcode B ON A.FACode = B.FARCode"
                    + " WHERE B.LI_AIA IN (?)", [RepCode], function (err, results, fields) {
                if (err) {
                    console.log(err);
                } else {

                    

                    /*var values = [
  { users: "tom", id: 101 },
  { users: "george", id: 102 }
];
var queries = '';

values.forEach(function (item) {
  queries += mysql.format("UPDATE tabletest SET users = ? WHERE id = ?; ", item);
});

connection.query(queries, defered.makeNodeResolver());*/

                    var values = JSON.stringify(results);
                    console.log(values);
                    var queries = '';

                    results.forEach(function (item) {
                        //console.log(item.AuthorCode);
                        queries += mysql.format("UPDATE Transaction_LI_Importeddata SET ?"
                            + ",FARVerification ='Verified'"
                            + " WHERE InsAgentCode ='" + item.InsAgentCode+"'  AND UploadUniqueID ='" + UploadUniqueID + "' ;", item);

                        console.log(queries);
                        
                    });
                   // connection.config.query(queries, defered.resolve());

                    connection.config.query(queries, function (err, results) {
                            if (err) {
                                console.log(err);
                                return next("Mysql error, check your query");
                            } else {
                                res.send({ msg: "success" });
                                // j++;
                                //callback(null, j);

                                // console.log("Verified");
                            }
                        });

                    //connection.config.query("UPDATE Transaction_LI_Importeddata SET "
                    //    + "AuthorCode =?,"
                    //    + "FARCode = ?,"
                    //    + "FARName = ?,"
                    //    + "FARStatus = ?,"
                    //    + "FARVerification ='Verified'"
                    //    + "WHERE InsAgentCode =?  AND UploadUniqueID =?",
                    //    [results[0].AuthorCode, results[0].FACode, results[0].Name, results[0].FAStatus
                    //        , results[0].AuthorCode, req.body.UploadUniqueID],
                    //    function (err, results) {
                    //        if (err) {
                    //            console.log(err);
                    //            return next("Mysql error, check your query");
                    //        } else {

                    //            // j++;
                    //            callback(null, j);

                    //            // console.log("Verified");
                    //        }
                    //    });
                   // callback(null, results, k, RepCode);
                    // console.log(json.length + ',' + i);

                }
            });
            InsAgentCode = JSON.stringify(result);
            var json = JSON.parse(InsAgentCode);

            //for (var i = 0; i < json.length; i++) {
            //    var RepCode = json[i].InsAgentCode;
            //    geAgentCode(RepCode, i, function (err, results, j, RepCode) {
            //        if (err) {
            //            console.log("ERROR : ", err);
            //        } else {


            //            dataCode(results, j, RepCode, function (err, resultdata) {
            //                if (err) {
            //                    console.log("ERROR : ", err);
            //                } else {
            //                    //console.log(results); console.log(j); 
            //                    console.log(resultdata);

            //                    if ((json.length - 1) == resultdata) {
            //                       console.log('success');
            //                        res.send({ msg: "success" });
            //                        req.end();
            //                    }

            //                }
            //            });

            //        }
            //    });
            //    // console.log(j);
            //}


        }
    });


    var geAgentCode = function (RepCode, k, callback) {
        // console.log(InsAgentCode);
        //InsAgentCode = JSON.stringify(results);
        /// var json = JSON.parse(InsAgentCode);

        //  for (var i = 0; i < json.length; i++) {
        //  var RepCode = json[i].InsAgentCode;
        var sql_FARCodeVerified = "SELECT Name, FACode, LI_AIA As AuthorCode, FAStatus FROM dbo_tblfapersonal A"
            + "INNER JOIN dbo_tblauthorcode B ON FACode = B.FARCode"
            + " WHERE LTRIM(RTRIM(B.LI_AIA)) like '%" + RepCode + "%'"
        connection.fabos.query(sql_FARCodeVerified, function (err, results, fields) {
            if (err) {
                console.log(err);
            } else {
                //console.log(k);
                callback(null, results, k, RepCode);
                // console.log(json.length + ',' + i);

            }
        });
        // }
        // console.log(json.length +','+ i);



    }


    var dataCode = function (results, j, RepCode, callback) {


        if (results.length > 0) {
            connection.config.query("UPDATE Transaction_LI_Importeddata SET "
                + "AuthorCode =?,"
                + "FARCode = ?,"
                + "FARName = ?,"
                + "FARStatus = ?,"
                + "FARVerification ='Verified'"
                + "WHERE InsAgentCode =?  AND UploadUniqueID =?",
                [results[0].AuthorCode, results[0].FACode, results[0].Name, results[0].FAStatus
                    , results[0].AuthorCode, req.body.UploadUniqueID],
                function (err, results) {
                    if (err) {
                        console.log(err);
                        return next("Mysql error, check your query");
                    } else {

                        // j++;
                        callback(null, j);

                        // console.log("Verified");
                    }
                });
        }

        else {
           
            connection.config.query("UPDATE Transaction_LI_Importeddata SET "

                + "FARVerification ='Not Matched'"
                + "WHERE InsAgentCode =?  AND UploadUniqueID =?",
                [RepCode, req.body.UploadUniqueID],
                function (err, results) {
                    if (err) {
                        console.log(err);
                        return next("Mysql error, check your query");
                    } else {
                        callback(null, j);
                    }
                });

           

            
        }

    }




    
    //#region FARVerification
    //connection.config.query("SELECT InsAgentCode FROM transaction_li_importeddata"
    //    + " WHERE UploadUniqueID=?", [req.body.UploadUniqueID], function (err, results) {
    //        if (err) {
    //            console.log(err);
    //            return next("Mysql error, check your query");
    //        }
    //        else {
    //            res.json({ error_code: 1, err_desc: "SUCCESS" });
    //            InsAgentCode = JSON.stringify(results);
    //            var json = JSON.parse(InsAgentCode);
    //            for (var i = 0; i < json.length; i++) {
    //                var RepCode = json[i].InsAgentCode;
    //                connection.fabos.query("SELECT Name, FACode, LI_AIA As AuthorCode, A.FAStatus FROM dbo_tblfapersonal A "
    //                    + "INNER JOIN dbo_tblauthorcode B ON A.FACode = B.FARCode"
    //                    + " WHERE LTRIM(RTRIM(B.LI_AIA)) like ?", '%' + RepCode + '%', function (err, results) {
    //                        if (err) {
    //                            console.log(err);
    //                            return next("Mysql error, check your query");
    //                        } else {
    //                            // console.log(results);

    //                            if (results.length > 0) {

    //                                FARCodeVerified = JSON.stringify(results);
    //                                var json = JSON.parse(FARCodeVerified);
    //                                //console.log(json.length);
    //                                connection.config.query("UPDATE Transaction_LI_Importeddata SET "
    //                                    + "AuthorCode =?,"
    //                                    + "FARCode = ?,"
    //                                    + "FARName = ?,"
    //                                    + "FARStatus = ?,"
    //                                    + "FARVerification ='Verified'"
    //                                    + "WHERE InsAgentCode =?  AND UploadUniqueID =?",
    //                                    [results[0].AuthorCode, results[0].FACode, results[0].Name, results[0].FAStatus
    //                                        , results[0].AuthorCode, req.body.UploadUniqueID],
    //                                    function (err, results) {
    //                                        if (err) {
    //                                            console.log(err);
    //                                            return next("Mysql error, check your query");
    //                                        } else {

    //                                            //console.log(results);

    //                                            console.log("Verified");
    //                                        }
    //                                    });
    //                            }
    //                            else {
    //                                //console.log(RepCode);
    //                                connection.config.query("UPDATE Transaction_LI_Importeddata SET "

    //                                    + "FARVerification ='Not Matched'"
    //                                    + "WHERE InsAgentCode =?  AND UploadUniqueID =?",
    //                                    [RepCode, req.body.UploadUniqueID],
    //                                    function (err, results) {
    //                                        if (err) {
    //                                            console.log(err);
    //                                            return next("Mysql error, check your query");
    //                                        } else {

    //                                            //console.log(results);

    //                                            console.log("Not Matched");
    //                                        }
    //                                    });

    //                            }

    //                        }

    //                       // res.sendStatus(200);
    //                    });

    //            }

    //        }




    //    });

    //connection.config.query("SELECT InsAgentCode FROM transaction_li_importeddata"
    //    + " WHERE UploadUniqueID=?", [req.body.UploadUniqueID], function (err, results) {
    //        if (err) {
    //            throw err;
    //        } else {
    //           // console.log(results);
    //            InsAgentCode = JSON.stringify(results);
    //          //  console.log(InsAgentCode);
    //            var json = JSON.parse(InsAgentCode);
    //            var RepCode = json.map(function (x) { return x.InsAgentCode });
    //            connection.fabos.query("SELECT Name, FACode, LI_AIA As AuthorCode, A.FAStatus FROM dbo_tblfapersonal A "
    //                + "INNER JOIN dbo_tblauthorcode B ON A.FACode = B.FARCode"
    //                + " WHERE B.LI_AIA IN (?)", [RepCode], function (err, results) {
    //                    if (err) {
    //                        throw err;
    //                    } else {

    //                        FARCodeVerified = JSON.stringify(results);
    //                        var json = JSON.parse(FARCodeVerified);
    //                        console.log(results[0].length);
    //                        for (var i = 0; i < json.length; i++) {

    //                            //if (json.length > 0) {
    //                                connection.config.query("UPDATE Transaction_LI_Importeddata SET "
    //                                    + "AuthorCode =?,"
    //                                    + "FARCode = ?,"
    //                                    + "FARName = ?,"
    //                                    + "FARStatus = ?,"
    //                                    + "FARVerification ='Verified'"
    //                                    + "WHERE InsAgentCode =?  AND UploadUniqueID =?",
    //                                    [json[i].AuthorCode, json[i].FACode, json[i].Name, json[i].FAStatus
    //                                        , json[i].AuthorCode, req.body.UploadUniqueID],
    //                                    function (err, results) {
    //                                        if (err) {
    //                                            throw err;
    //                                        } else {

    //                                            //console.log(results);

    //                                            //console.log("Verified");
    //                                        }
    //                                    });
    //                            //}
    //                            //else {
    //                            //    connection.config.query("UPDATE Transaction_LI_Importeddata SET "
    //                            //         + "FARVerification ='Not Matched'"
    //                            //        + "WHERE InsAgentCode =?  AND UploadUniqueID =?",
    //                            //        [json[i].AuthorCode, req.body.UploadUniqueID],
    //                            //        function (err, results) {
    //                            //            if (err) {
    //                            //                throw err;
    //                            //            } else {

    //                            //                console.log(results);

    //                            //                // console.log("Not Matched");
    //                            //            }
    //                            //        });
    //                            //}

    //                        }
    //                        connection.config.query("SELECT CASE WHEN  FARCode='' THEN 'NULL'  ELSE  FARCode END As FARCode,"
    //                            + " PolicyNumber FROM transaction_li_importeddata"
    //                            + " WHERE UploadUniqueID=? ", [req.body.UploadUniqueID], function (err, results) {
    //                                if (err) {
    //                                    throw err;
    //                                } else {

    //                                    console.log("policyVerified");
    //                                    PolicyNum = JSON.stringify(results);
    //                                    var json = JSON.parse(PolicyNum);
    //                                    var PolicyNumber = json.map(function (x) { return x.PolicyNumber });
    //                                    var i = 0;

    //                                    for (i = 0; i < json.length; i++) {
    //                                        var PolicyNumbertest = json[i].PolicyNumber;
    //                                        var FARCode = json[i].FARCode;
    //                                        if (FARCode !== 'NULL') {

    //                                            connection.fabos.query("Select A.InsurancePolicyID,A.PolicyNumber,'" + FARCode + "' as FARCode,"
    //                                                + "CASE WHEN  ISNULL(A.CommencementDate) THEN '0000-00-00'  ELSE  DATE_FORMAT(A.CommencementDate, '%Y-%m-%d') END As CommencementDate ,"
    //                                                + "B.ProductName, A.DateInforced, A.Frequency, A.WritingFARCode, A.ServicingFARCode,"
    //                                                + "CASE WHEN B.ProductType IN ('H&S - IP Main Plan', 'H&S - IP Rider') THEN 'S' ELSE '' END As RevenueStatus"
    //                                                + " From fabos.tblinsurancepolicy A "
    //                                                + " Inner Join fabos.dbo_tblinsuranceproduct B On A.InsuranceProductID = B.InsuranceProductID AND InsuranceBrokerID = 1"
    //                                                + "  Where  LTRIM(RTRIM(A.PolicyNumber)) like ?", '%' + PolicyNumbertest + '%', function (err, result) {


    //                                                    if (err) {
    //                                                        throw err;
    //                                                    } else {
    //                                                        if (result.length > 0) {
    //                                                            PolicyVerified = JSON.stringify(result);
    //                                                            // console.log(result);
    //                                                            var json = JSON.parse(PolicyVerified);
    //                                                           // console.log(result[0].FARCode);
    //                                                            if (result[0].FARCode == result[0].ServicingFARCode) {

    //                                                                connection.config.query("UPDATE Transaction_LI_Importeddata SET "
    //                                                                    + "ibossPolicyID =?,"
    //                                                                    + "iBOSSPlanname = ?,"
    //                                                                    + "iBOSSFrequency = ?,"
    //                                                                    + "Frequency = ?,"
    //                                                                    + " PolicyVerification ='Verified',"
    //                                                                    + "PolicyYear =1,"
    //                                                                    + "RevenueStatus ='SNTR'"
    //                                                                    + "WHERE PolicyNumber =?  AND UploadUniqueID =?",
    //                                                                    [result[0].InsurancePolicyID, result[0].ProductName,
    //                                                                    result[0].Frequency, result[0].Frequency, result[0].PolicyNumber, req.body.UploadUniqueID],
    //                                                                    function (err, results) {
    //                                                                        if (err) {
    //                                                                            throw err;
    //                                                                        } else {

    //                                                                            //console.log(results);
    //                                                                            // 5475487A01
    //                                                                            //console.log("Verified");
    //                                                                        }
    //                                                                    });
    //                                                            }
    //                                                            else {

    //                                                                connection.config.query("UPDATE Transaction_LI_Importeddata SET "
    //                                                                    + "ibossPolicyID =?,"
    //                                                                    + "iBOSSPlanname = ?,"
    //                                                                    + "iBOSSFrequency = ?,"
    //                                                                    + "Frequency = ?,"
    //                                                                    + " PolicyVerification ='FAR Mismatch',"
    //                                                                    + "PolicyYear =1,"
    //                                                                    + "RevenueStatus ='SNTR'"
    //                                                                    + "WHERE PolicyNumber =?  AND UploadUniqueID =?",
    //                                                                    [result[0].InsurancePolicyID, result[0].ProductName,
    //                                                                    result[0].Frequency, result[0].Frequency, result[0].PolicyNumber, req.body.UploadUniqueID],
    //                                                                    function (err, results) {
    //                                                                        if (err) {
    //                                                                            throw err;
    //                                                                        } else {

    //                                                                           // console.log("FAR Mismatch");
    //                                                                        }
    //                                                                    });

    //                                                            }

    //                                                        }
    //                                                        else {
    //                                                            //console.log(result[0].InsurancePolicyID);
    //                                                            ////console.log(result[0].InsurancePolicyID);
    //                                                            //var PolicyNumbertest1 = json[i].PolicyNumber;
    //                                                            //console.log(PolicyNumbertest1);
    //                                                            console.log(PolicyNumbertest);
    //                                                            connection.config.query("UPDATE Transaction_LI_Importeddata SET "
    //                                                                  + " PolicyVerification ='No Such P/ No'"
    //                                                                 + "WHERE PolicyVerification =''  AND UploadUniqueID =?",
    //                                                                [PolicyNumbertest, req.body.UploadUniqueID],
    //                                                                function (err, results) {
    //                                                                    if (err) {
    //                                                                        throw err;
    //                                                                    } else {

    //                                                                        console.log("No Such P/ No");
    //                                                                    }
    //                                                                });

    //                                                        }

    //                                                    }
    //                                                });
    //                                        }
    //                                    }
    //                                }
    //                            });
    //                    } res.json({ error_code: 1, err_desc: "SUCCESS" });
    //                });


    //        }

    //    });
    //if (res.successStatus = 202) {

    //}


    // res.json(json)
    //#endregion 


});


router.get('/tblfapersonal', function (req, res) {
    connection.fabos.query("SELECT * FROM dbo_tblfapersonal "
        , function (err, results) {
            if (err) {
                throw err;
            } else {



                res.send(JSON.stringify(results));
            }
        });
});


router.post('/tblfapersonal', function (req, res) {
    connection.fabos.query("SELECT * FROM dbo_tblfapersonal "
        , function (err, results) {
            if (err) {
                throw err;
            } else {



                res.send(JSON.stringify(results));
            }
        });
});

module.exports = router;

