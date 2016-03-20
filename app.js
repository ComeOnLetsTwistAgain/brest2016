var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();

var mongoose = require('mongoose');
var passport = require('passport');

var db_url = "mongodb://localhost/brest";
//var db_url = "mongodb://sam:sam@ds054128.mongolab.com:54128/brest2016";

// connect MongoDB
mongoose.connect(db_url, function(err,db){
    if (!err){
        console.log('Connected to database > ' + db_url );
    } else {
        console.dir(err); 
    }
});

// import des models
require('./models/Options');
require('./models/Animations');
require('./models/Billets');
require('./models/Users');
require('./models/Reservations');


require('./config/passport');




//SOCKETS
var server = require('http').createServer(app); 
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
    console.log('[SOCKET] Client - ');
    socket.emit('connect', 'Connected to socket');

    
});

io.sockets.on('devOrient', function(msg){
    console.log('yo');
});

server.listen(3000);

var routes = require('./routes/index')(io);
var users = require('./routes/users');


/*########################################*/
/* CONFIG NODE                            */
/*########################################*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


