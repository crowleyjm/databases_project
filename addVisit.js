const { request } = require('https');

module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // get all museums and visitors
    function getMuseuemsAndVisitors(res, mysql, context, done) {
        var sql = "SELECT museumID, name FROM Museums";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.museums = result;
        })
        sql = "SELECT visitorID, CONCAT_WS(', ', lastName, firstName) AS visitor FROM Visitors";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.visitors = result;
            done();
        });
    }

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getMuseuemsAndVisitors(res, mysql, context, done);

        function done() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('add_visit', context);
            }
        }
    });

    // add one visit
    router.post('/', function (req, res) {
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Museums_Visitors(museumID, visitorID, visitDate) VALUES (?, ?, ?)";
        var inserts = [req.body.museumID, req.body.visitorID, req.body.visitDate];
        sql = mysql.pool.query(sql, inserts, function (err, results, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.redirect('/add_visit');
            }
        });
    });
    return router;
}();