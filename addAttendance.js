const { request } = require('https');

module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // get all tours and visitors
    function getToursAndVisitors(res, mysql, context, done) {
        var sql = "SELECT tourID FROM Tours";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.tours = result;
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
        getToursAndVisitors(res, mysql, context, done);

        function done() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('add_attendance', context);
            }
        }
    });

    // add one attendance
    router.post('/', function (req, res) {
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Tours_Visitors(tourID, visitorID) VALUES (?, ?)";
        var inserts = [req.body.tourID, req.body.visitorID];
        sql = mysql.pool.query(sql, inserts, function (err, results, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.redirect('/add_attendance');
            }
        });
    });
    return router;
}();