/*
 * Includes
 */
var Twig = require('twig');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// custom modules
var config = require('./config');
var login = require('./modules/login');
var crypt = require('./modules/crypt');

/*
 * HTTP Server
 */
var app = express();

/*
 * Bind plugins
 */

// cookies
app.use(cookieParser());
// body-parser
app.use(bodyParser.urlencoded({extended: false})) // arse application/x-www-form-urlencoded 
app.use(bodyParser.json()); // parse application/json 

/*
 * Twig options
 */
// This section is optional and used to configure twig. 
app.set("twig options", {
    strict_variables: false
});

Twig.extendFunction('asset', function (url) {
    return config.url + '/assets/' + url;
});

Twig.extendFunction('path', function (name) {
    return config.url + '/' + name;
});


/*
 * Web Pages (Routing)
 */
app.get('/', function (req, res) {

    if (login.isLogged(req.cookies)) {
        res.render('main.html.twig', {username: login.getSession().username});
        return;
    }
    res.redirect('login');

});

app.get('/login', function (req, res) {

    if (login.isLogged(req.cookies)) {
        res.redirect('/');
    } else {
        res.render('login.html.twig');
    }
});

app.get('/logout', function (req, res) {
    res.clearCookie('login');
    res.redirect('/');
});

app.post('/login', function (req, res) {

    if (login.loginUserPwd(req.body.username, req.body.pwd, res)) {
        console.log('logged');
        res.redirect('/');
    } else {
        res.redirect('login');
    }

});

// static files
app.use('/assets', express.static('public'));

/*
 * Start the http server
 */

var server = app.listen(4000, function () {
    // Put a friendly message on the terminal of the server.
    console.log("Web Server running at port 4000\n");
});