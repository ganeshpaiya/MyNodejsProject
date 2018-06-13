var mysql = require('mysql');
var express = require('express');
var path = require('path');
var defered = require('deferred');
var router = express.Router();
var connection = require('../DB/config');
var uuid = require("uuid");
var UUID = uuid.v4();
console.log(UUID);
var ResultDatd = [];
//router.get('/', function (req, res) {
//    res.render('LI/Upload');
//});



router.post('/VestingData', function (req, res, next) {

    var UploadUniqueID = req.body.UploadUniqueID;
    var StatementDate = req.body.StatementDate;
    var test2 = req.body.CommType;
    var sql_Vestingdata = "SELECT ('" + UUID + "') AS UniqueID"
    // (T1.UniqueID) AS ImportedUniqueID, T1.UploadUniqueID,"
    //    + " T1.InsurerName, T1.AuthorCode, (T5.FACode)AS FARCode, (T5.Name)AS FARName, T5.FAStatus, (T1.InsAgentCode) AS InsAgentNo, T1.InsAgentCode,"
    //    + "  T1.InsFARName, T1.ibossPolicyID, T1.PolicyNumber, T1.ClientName,"
    //    + "  (T1.iBOSSPlanname) AS PlanName, T1.iBOSSPlanname, T1.CommencementDate, T1.Frequency, (T1.Frequency) AS iBOSSFrequency, T1.PremiumPaid, T1.Bonus, "
    //    + "  T1.Others, T1.TotalRevenue, T1.PolicyYear, T1.GSTAmount, T1.TRWithGST, (T1.TRWithoutGST * ((VestingRate / 100))) As TRWithoutGST,"
    //    + "  T1.FARVerification, T1.PolicyVerification, T1.RevenueStatus, 1 As VestingFlag, 'Vesting Case' As VestingStatus, T3.VestingRate,"
    //    + " ((VestingRate / 100) * T4.Percentage) As FARPrecentage,"
    //    + "  T1.Received, T1.ReceivedDate, T1.InsPlanCode, T1.InsCurrencyCode,"
    //    + "  T1.Deleted, T1.DeletedOn, T1.DeletedBy, T1.UpdatedOn, T1.UpdatedBy, T1.CreatedOn, T1.CreatedBy FROM dbcommtrackv2.Transaction_LI_ImportedData T1"
        +" FROM dbcommtrackv2.Transaction_LI_ImportedData T1 "
        + " INNER JOIN fabos.tblinsurancepolicy T2 ON T1.ibossPolicyID = T2.InsurancePolicyID "
        + " INNER JOIN fabos.dbo_tblVestingFAR T3 ON T2.WritingFARCode = T3.FARCode AND '" + StatementDate + "' BETWEEN T3.StartDate AND T3.EndDate "
        + " INNER JOIN fabos.dbo_tblJointFARInsurance T4 ON T2.InsurancePolicyID = T4.InsurancePolicyID AND T2.ServicingFARCode = T4.FARCode AND T2.WritingFARCode = T4.WritingFARCode "
        + " INNER JOIN fabos.dbo_tblFAPersonal T5 ON T3.FARCode = T5.FACode "
        + " WHERE UploadUniqueID IN ('" + UploadUniqueID + "') "
        + " AND UniqueID NOT IN (SELECT ImportedUniqueID FROM dbcommtrackv2.Transaction_LI_ReceivedData WHERE UploadUniqueID IN ('" + UploadUniqueID + "')) "
        //+ " AND ReceivedDate IS NOT NULL"

        //+ " UNION "

        //+ " SELECT ('" + UUID + "') AS UniqueID, (T1.UniqueID) AS ImportedUniqueID, T1.UploadUniqueID, T1.InsurerName,(T1.InsAgentCode) AS AuthorCode,T5.FACode,T5.Name,"
        //+ " T5.FAStatus, (T1.InsAgentCode) AS InsAgentNo, T1.InsAgentCode, (T5.Name) AS FARName, T1.ibossPolicyID, T1.PolicyNumber, T1.ClientName, "
        //+ " T1.PlanName, T1.iBOSSPlanname, T1.CommencementDate, T1.Frequency, T1.iBOSSFrequency, T1.PremiumPaid, T1.Bonus, T1.Others,"

        //+ " T1.TotalRevenue, T1.PolicyYear, T1.GSTAmount, T1.TRWithGST, "
        //+ "(T1.TRWithoutGST * ((CASE "
        //+ " WHEN T3.VestingRate > 100 THEN 0 "
        //+ " WHEN T3.VestingRate = 100 THEN 0   "
        //+ " WHEN T3.VestingRate < 100 THEN 100  "
        //+ " END) / 100))  AS TRWithoutGST, "
        //+ " T1.FARVerification, T1.PolicyVerification, T1.RevenueStatus, 2 As VestingFlag, 'Vesting Case' As VestingStatus, "
        //+ " CASE"
        //+ " WHEN T3.VestingRate > 100 THEN 0 "
        //+ " WHEN T3.VestingRate = 100 THEN 0  "
        //+ " WHEN T3.VestingRate < 100 THEN 100 - T3.VestingRate "
        //+ " END As VestingRate,"
        //+ " CASE"
        //+ " WHEN T3.VestingRate > 100 THEN 0 "
        //+ " WHEN T3.VestingRate = 100 THEN 0  "
        //+ " WHEN T3.VestingRate < 100 THEN (((100 - T3.VestingRate) / 100) * T4.Percentage) "
        //+ " END As FARPercentage,"
        //+ " T1.Received, T1.ReceivedDate, T1.InsPlanCode, T1.InsCurrencyCode,"
        //+ " T1.Deleted, T1.DeletedOn, T1.DeletedBy, T1.UpdatedOn, T1.UpdatedBy, T1.CreatedOn, T1.CreatedBy "
        //+ " FROM Transaction_LI_ImportedData T1 "
        //+ " INNER JOIN fabos.tblinsurancepolicy T2 ON T1.ibossPolicyID = T2.InsurancePolicyID "
        //+ " INNER JOIN fabos.dbo_tblVestingFAR T3 ON T2.WritingFARCode = T3.FARCode AND '" + StatementDate + "' BETWEEN T3.StartDate AND T3.EndDate "
        //+ " INNER JOIN fabos.dbo_tblJointFARInsurance T4 ON T2.InsurancePolicyID = T4.InsurancePolicyID AND T2.ServicingFARCode = T4.FARCode AND T2.WritingFARCode = T4.WritingFARCode "
        //+ " INNER JOIN fabos.dbo_tblFAPersonal T5 ON T2.ServicingFARCode = T5.FACode "
        //+ " WHERE UploadUniqueID IN ('" + UploadUniqueID + "')"
        //+ " AND UniqueID NOT IN (SELECT ImportedUniqueID FROM Transaction_LI_ReceivedData WHERE UploadUniqueID IN ('" + UploadUniqueID + "'))"
    //  + " AND ReceivedDate IS NOT NULL"


    connection.config.query(sql_Vestingdata, function (err, results, fields) {
        if (err) {
            console.log(err);
        } else {
            console.log(results[0].UniqueID);
            ResultDatd = results;
            ResultDatd = JSON.stringify(results[0].UniqueID);
          //  var json = JSON.parse(ResultDatd).data;

          //  var finalData = JSON.parse(json);

            //console.log(json);
            //var data = JSON.parse(results[0].UniqueID);
            //var responseJson = JSON.stringify(data);

            //var parsed = JSON.parse(ResultDatd);

            //var arr = [];

            //for (var x in parsed) {
            //    arr.push(parsed[x]);
            //}
            var sql = "INSERT INTO Transaction_LI_ReceivedData (UniqueID) VALUES ?";
            var values = [[results[0].UniqueID]

            ];
            connection.config.query(sql, [values], function (err, result) {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log(result);
                }

                // conn.end();
            });
            //var sql1 = connection.config.query('INSERT INTO Transaction_LI_ReceivedData'
            //    + '(UniqueID) VALUES ? ',
            //    [ResultDatd], function (err, result) {
            //        if (err) {
            //            console.log(err.message);
            //        }
            //        else {
            //            console.log(result);
            //        }


            //        });
        }




    });
});

//SELECT  a.*,         
//b.`Message`
//FROM  dba.`UserName` a  
//INNER JOIN dbB.`PrivateMessage` b    
//ON a.`username` = b.`username`

module.exports = router;