var express = require('express');
var path = require('path');
var router = express.Router();
var connection = require('../DB/config');
router.get('/', function (req, res) {
    res.render('Includes/LI/Upload_Edit');
});
var id="";
router.get('/(:id)', function (req, res) {
     id = req.params.id;
    console.log(id);
    //res.render('Includes/LI/Upload_Edit');
    var id = req.params.id;
    var personList = [];
    var query =connection.config.query('SELECT * FROM master_li_uploaddata WHERE UploadID = ?', [id],
        function (err, result) {
            if (err) {
                res.send(err);
            }
            console.log(JSON.stringify(result[0]));
            for (var i = 0; i < result.length; i++) {

                // Create an object to save current row's data
                var person = {

                    'id': result[i].UploadID
                }
                // Add object into array
                personList.push(person);
                console.log(personList);
            }
          // res.render('Includes/LI/Upload_Edit', { title: 'RESTful Crud Example', personList });
            // res.render(JSON.stringify(result));
           res.send(JSON.stringify(personList));
        })
});


router.get('/', function (req, res) {
    var person="ddd"
    res.send(JSON.stringify(person));
});
//router.get('/getIOT', function (req, res, err) { // <-- response is 'res'
//    request({
//        'auth': {
//            'user': 'masnad',
//            'pass': 'whatstodaysrate',
//            'sendImmediately': true
//        },
//        url: 'Includes/LI/Upload_Edit',
//        method: 'GET',
//    }, function (error, request, body) {
//        console.log(body);
//        return res.end(JSON.stringify(body)); // <-- res
//    })
//});
//app.put('/edit/(:id)', function (req, res, next) {
//    req.assert('name', 'Name is required').notEmpty()           //Validate name
//    req.assert('age', 'Age is required').notEmpty()             //Validate age
//    req.assert('email', 'A valid email is required').isEmail()  //Validate email

//    var errors = req.validationErrors()

//    if (!errors) {   //No errors were found.  Passed Validation!

//        /********************************************
//         * Express-validator module
         
//        req.body.comment = 'a <span>comment</span>';
//        req.body.username = '   a user    ';
 
//        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
//        req.sanitize('username').trim(); // returns 'a user'
//        ********************************************/
//        var user = {
//            name: req.sanitize('name').escape().trim(),
//            age: req.sanitize('age').escape().trim(),
//            email: req.sanitize('email').escape().trim()
//        }

//        req.getConnection(function (error, conn) {
//            conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function (err, result) {
//                //if(err) throw err
//                if (err) {
//                    req.flash('error', err)

//                    // render to views/user/add.ejs
//                    res.render('user/edit', {
//                        title: 'Edit User',
//                        id: req.params.id,
//                        name: req.body.name,
//                        age: req.body.age,
//                        email: req.body.email
//                    })
//                } else {
//                    req.flash('success', 'Data updated successfully!')

//                    // render to views/user/add.ejs
//                    res.render('user/edit', {
//                        title: 'Edit User',
//                        id: req.params.id,
//                        name: req.body.name,
//                        age: req.body.age,
//                        email: req.body.email
//                    })
//                }
//            })
//        })
//    }
//    else {   //Display errors to user
//        var error_msg = ''
//        errors.forEach(function (error) {
//            error_msg += error.msg + '<br>'
//        })
//        req.flash('error', error_msg)

//        /**
//         * Using req.body.name 
//         * because req.param('name') is deprecated
//         */
//        res.render('user/edit', {
//            title: 'Edit User',
//            id: req.params.id,
//            name: req.body.name,
//            age: req.body.age,
//            email: req.body.email
//        })
//    }
//})

module.exports = router;