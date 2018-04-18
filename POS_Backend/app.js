var https = require('https');
var http = require('http');
var mongoose = require('mongoose');
var credentials = require('./lib/credentials.js');
var path = require('path');

//setup express
var express = require('express');
var app = express();

//setup handlebars
var handlebars = require('express3-handlebars').create({
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//setup port
app.set('port', process.env.PORT || 3000);

//setup body-parsers
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//setup statics
app.use(express.static(__dirname + '/public'));

//setup session
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var sessConfig = {
  secret: credentials.session.secret,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessConfig.cookie.secure = true // serve secure cookies
}
app.use(session(sessConfig));

//setup flash messages
app.use(function (req, res, next) {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

//setup express validator
var expressValidator = require('express-validator');
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}));


//setup mongoose
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});
switch (app.get('env')) {
  case 'production':
    mongoose.connect(credentials.mongo.production.connectionString);
    break;
  case 'development':
    mongoose.connect(credentials.mongo.development.connectionString);
    break;

}
////////////////////////////////////////////

//routes for rest api
var apiRoutes = require('./apiRoutes.js')(app);

//setup csurf
app.use(require('csurf')());

//app routes
var routes = require('./routes.js')(app);

//start express server
http.createServer(app).listen(app.get('port'), function () {
  console.log("Express started on http://localhost:" + app.get('port') + " Environment: "
    + app.get('env') + " press Ctrl-c to terminate");
});
