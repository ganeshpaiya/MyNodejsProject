var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug');
var mysql = require('mysql')
var multer = require('multer');
var upload = multer({ dest: '/uploads' });
var myConnection = require('express-myconnection');
var formidable = require('formidable');
var fs = require('fs');
var mime = require('mime');
var flash = require('connect-flash');
var multipart = require("multipart");
var busboy = require('connect-busboy');
var session = require('express-session');




var index = require("./routes/index");
var Upload = require("./routes/Upload");
var Upload_Add = require("./routes/Upload_Add");
var Upload_Edit = require("./routes/Upload_Edit");
var Upload_Manual = require("./routes/Upload_Manual");
var Manual_Edit = require("./routes/Manual_Edit");
var Manual = require("./routes/Manual");
var CommonScript = require("./routes/CommonScript");
var Payment_Add = require("./routes/Payment_Add");
var Summary = require("./routes/Summary");
var Received = require("./routes/Received");
var Payout = require("./routes/Payout");
var Payment = require("./routes/Payment");
var error = require("./routes/error");
var fabosDB = require("./api/fabosDB");
var fabosDB1 = require("./api/fabosDB1");
var VestingData = require("./api/VestingData");

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, '/views'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(multer());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb' }));
app.use(busboy());
//app.use(bodyParser.urlencoded());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.bodyParser({ uploadDir: './uploads' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.set('views', __dirname + '/views');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
    next();
});

app.use("/", index);
app.use("/CommonScript", CommonScript);
app.use("/LI/Upload", Upload);
app.use("/error", error);
app.use("/Upload/add", Upload_Add);
app.use("/Includes/LI/Upload_Edit", Upload_Edit);
app.use("/Includes/LI/Manual_Edit", Manual_Edit);
app.use("/Includes/LI/Upload_Manual", Upload_Manual);
app.use("/Includes/LI/Payment_Add", Payment_Add);
app.use("/LI/Manual", Manual);
app.use("/LI/Summary", Summary);
app.use("/LI/Received", Received);
app.use("/LI/Payout", Payout);
app.use("/LI/Payment", Payment);
app.use("/index", index);
app.use("/api/fabosDB",fabosDB);
app.use("/api/fabosDB1", fabosDB1);
app.use("/api/VestingData", VestingData );


var config = require("./DB/config");
//var connection1 = require("./DB/fabos");
//var dbOptions = {
//    host: config.host,
//    user: config.user,
//    password: config.password,
//    port: config.port,
//    database: config.database
//}
//app.use(myConnection(mysql, dbOptions, 'pool'));


 //catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false
}));

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
