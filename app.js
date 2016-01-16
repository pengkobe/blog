var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

// 支持markdown
var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});
var routes = require('./server/routes/index');
var settings = require('./server/settings');
// 支持flash
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'ejs');
app.use(flash());


app.use(favicon(path.join(__dirname, '/src/img/favicon.ico')));
app.use(logger('dev'));
app.use(logger({stream: accessLog}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '.'), {maxAge : 86400000}));

// session mongodb
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
   /* 这段已过时
   	db: settings.db,
    host: settings.host,
    port: settings.port
    */
    url: settings.dbUrl
  })
}));

// 处理文件后缀为.md页面
app.engine('md', function(path, options, fn){  
  fs.readFile(path, 'utf8', function(err, str){  
    if (err) return fn(err);  
    str = marked(str);  
    fn(null, str);  
  });  
});  

app.use('/', routes);

app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

/// 404
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// 如果为开发环境，则打印错误堆栈
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 生产环境
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
