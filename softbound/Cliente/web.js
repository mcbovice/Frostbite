var fs = require('fs');
var path = require('path');
var constants = require('constants');
var tls = require('tls');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var mysql = require('mysql');
var md5 = require('md5');
var helmet = require('helmet');
var ignoreCase = require('ignore-case');
var Logger = require('./Controller/lib/logger');
var DataBase = require('./Model/index');
var session = require('express-session');

var hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, "/web/views/layouts"),
    partialsDir: [
        '/web/views/partials/'
    ]
});
Logger.Init("web.txt");

var self = this;
var db = new DataBase();
var options = {
    host: db.host,
    port: 3306,
    user: db.user,
    password: db.password,
    database: db.database,
    schema: {
        tableName: 'account_sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires_time',
            data: 'data_acc'
        }
    }
};
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(options);
var https = require('http').createServer({});
this._httpServer = https;
this._app = express();
this._app.engine('handlebars', hbs.engine);
this._app.set('view engine', 'handlebars');
this._app.set('views', path.join(__dirname, "/web/views"));
this._app.set('env', 'production');
this._app.disable('x-powered-by');
this._app.use(helmet());
this._app.set('trust proxy', 1);
this._app.use(session({
    key: 'sessionid',
    secret: 'abc-xgamedev',
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        /*secure: true,*/
		secure: true,
        maxAge: new Date(Date.now() + (60 * 1000 * 10))
    }
}));
this._app.use(cookieParser('xgamedev'));
this._app.use(bodyParser.urlencoded({
    extended: false
}));
this._app.use(function(req, res, next) {
    req.db = db;
    try {
        next();
    } catch (e) {
        Logger.debug("err: " + e.stack);
        res.status(403);
    }
});
this._app.use(bodyParser.json());
this._app.use('/static', express.static(path.join(__dirname + '/web/public_html/data')));
this._app.use('/.well-known/pki-validation/4448F84DE65713CE48F3B839E02FC8F7.txt', express.static(path.join(__dirname + '/ssl/4448F84DE65713CE48F3B839E02FC8F7.txt')));
this._app.use('/favicon.ico', express.static(path.join(__dirname + '/web/public_html/data/favicon.ico')));
this._app.use(require('./web/middlewares/account'));
this._app.use(require('./web/controllers'));

/*https.on('request', this._app);
https.listen(80, function() {
    var st = process.env.vps == '1' ? 'VPS' : 'LOCAL';
    Logger.normal('Server Conectado en ' + st + " " + https.address().port);
});*/

https.on('request', this._app);
https.listen(3000, function() {
    var st = process.env.vps == '1' ? 'VPS' : 'LOCAL';
    Logger.normal('Listening on ' + st + " " + https.address().port);
});

/*https.on('request', this._app);
https.listen(444, function() {
    var st = process.env.vps == '1' ? 'VPS' : 'LOCAL';
    Logger.normal('Listening on ' + st + " " + https.address().port);
});*/