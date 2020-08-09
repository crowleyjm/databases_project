module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // get all visitors
    function getVisitors(res, mysql, context, done) {
        var sql = "SELECT visitorID, email, firstName, lastName, isMember FROM Visitors";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.visitors = result;
            console.log(context.visitors);
            done();
        });
    }

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('add_visitor', context);
        }
    });

    // add visitor
    router.post('/', function (req, res) {
        console.log("ADDING VISITOR");
        console.log(req.body);
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Visitors(email, firstName, lastName, isMember) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.email, req.body.firstName, req.body.lastName, req.body.isMember];
        sql = mysql.pool.query(sql, inserts, function (err, results, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.redirect('/add_visitor');
            }
        });
    });
    return router;
}();