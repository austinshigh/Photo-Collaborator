var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();
var indexRouter = require('./routes/index');
var apiphotos = require('./routes/api/api-photos');
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.f7krc.mongodb.net/test?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .catch((err) => {
        console.error(`database connection error:${err}`);
    })

app.use(cookieParser('cscie31-secret'));
app.use(session({
    secret: "cscie31",
    resave: "true",
    saveUninitialized: "true"
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

// app.use('/', indexRouter);

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/api/photos', apiphotos);

// we want the root route
app.use('/', (req, res) => {
   // filter for actual files we want to deliver from disk
   var pattern = new RegExp('(.css|.html|.js|.ico|.jpg|.png)+\/?$', 'gi'); 
   if (pattern.test(req.url)) {
      // in cases where the Angular app is mounted at the root url, we may need to strip a trailing slash from the redirected request 
      let url = req.url.replace(/\/$/, "");
      // deliver the requested file
      res.sendFile(path.resolve(__dirname, `../client/dist/myNewApp/${url}`));
   } else {
      // in this case, the request should be handled by Angular, which is index.html
      res.sendFile(path.resolve(__dirname, '../client/dist/myNewApp/index.html'));
   }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;