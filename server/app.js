const express = require('express')
const mysql = require('mysql')
const config = require('config')
const nodeMailer = require("nodemailer")
const bodyParser = require('body-parser')
const signup = require('./routes/signup.js')
const login = require('./routes/login.js')
const forgot = require('./routes/forgot.js')
const profile = require('./routes/profile.js')
const settings = require('./routes/settings.js')
const video = require('./routes/video.js')
const GitHubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GitHubStrategy({
	clientID: "27a9974ecf7cb9a53415",
	clientSecret: "bbcb8d88ad81aaf0b4a70b7c03a32c9f8c89f1f2",
	callbackURL: "http://localhost:8080/login/github",
  	scope: [ 'user:email' ]
	}, (accessToken, refreshToken, profile, done) => {
		return done(null, profile);
	}
));

passport.use(new FacebookStrategy({
    clientID: "443712349578194",
    clientSecret: "c6aa51289642f56b18885ac5c8c1331d",
    callbackURL: "http://localhost:8080/login/facebook"
  },
  function(accessToken, refreshToken, profile, done) {
		return done(null, profile);
  }
));

passport.use(new GoogleStrategy({
    clientID: "720391957482-1jhj256krm792l7l8qb3at7jf5qv5ep4.apps.googleusercontent.com",
    clientSecret: "VHUrIDb6zlyv7zM-En2Y5D4E",
	callbackURL: "http://localhost:8080/login/google",
	scope: ['profile', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
	return done(null, profile);
  }
));

const db = mysql.createConnection(config.get('Database'))

db.connect((err) => {
	if (err)
		console.log(err)
	else
		console.log('Connected to database');
});
global.db = db;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-auth-token, Credentials-Header');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
    res.sendStatus(200);
	} 
	else {
	next();
	}
};
app.use(allowCrossDomain);

let smtpTransport = nodeMailer.createTransport(config.get("Mail"));
global.smtpTransport = smtpTransport;


/*    teeeeeaaammmmmm */

var cors = require('cors');
app.use(cors())

/*  teammmmmmmmmmmmmm */

app.use('/video', video)
app.use('/signup', signup);
app.use('/login', login);
app.use('/forgot', forgot);
app.use('/settings', settings);
app.use('/profile', profile);

app.listen(port, function() {
	console.log('Example app listening on port ' + port);
})