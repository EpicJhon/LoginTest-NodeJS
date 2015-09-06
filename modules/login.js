var mysql = require('./mysql');
var crypt = require('./crypt');
var deasync = require('deasync');
var session = null;
module.exports = {
    checkUserPwd: function (username, pwd) {
        var ret;
        var done = false;
        mysql.connection.query('SELECT COUNT(*) AS Total FROM users WHERE username = ? AND password = ?', [username, pwd], function (err, results) {
            ret = (results[0].Total === 1);
            done = true;
        });

        // wait result
        deasync.loopWhile(function () {
            return !done;
        });

        return ret;
    },
    isLogged: function (cookies) {
        if (typeof cookies !== 'undefined' && typeof cookies.login !== 'undefined') {
            var cookie = JSON.parse(crypt.decrypt(cookies.login));
            session = cookie;
            return (this.checkUserPwd(cookie.username, cookie.pwd));
        }

        return false;
    },
    loginUserPwd: function (username, pwd, res) {
        pwd = crypt.sha1(username.toLowerCase() + pwd);

        if (this.checkUserPwd(username, pwd)) {
            var cookie = crypt.encrypt(JSON.stringify({username: username, pwd: pwd}));
            res.cookie('login', cookie, {expires: new Date(Date.now() + 900000)});
            return true;
        }

        return false;
    },
    getSession: function () {
        return session;
    }
};