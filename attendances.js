module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // get all attendances
    function getAttendances(res, mysql, context, done) {
        var sql = "SELECT mus.name as museum, DATE_FORMAT(tour.date, '%m/%d/%Y') as date, TIME_FORMAT(tour.startTime, '%h:%i %p') as startTime, tourID, CONCAT_WS(', ', vis.lastName, vis.firstName) as visitor, visitorID FROM Tours_Visitors INNER JOIN Visitors AS vis USING (visitorID) INNER JOIN Tours AS tour USING (tourID) INNER JOIN Museums AS mus ON mus.museumID = tour.museumID ORDER BY tourID ASC";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.attendances = result;
            done();
        });
    }

    // get one attendance
    function getAttendance(res, mysql, context, params, done) {
        var sql = "SELECT mus.name as museum, DATE_FORMAT(tour.date, '%m/%d/%Y') as date, TIME_FORMAT(tour.startTime, '%h:%i %p') as startTime, tourID FROM Tours AS tour INNER JOIN Museums AS mus USING (museumID)";
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
        });
        sql = "SELECT tourID, visitorID FROM Tours_Visitors WHERE tourID=? AND visitorID=?";
        var inserts = [params.tourID, params.visitorID];
        mysql.pool.query(sql, inserts, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.attendances = result[0];
            done();
        });
    }

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteattendance.js"];
        var mysql = req.app.get('mysql');
        getAttendances(res, mysql, context, done);

        function done() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('view_attendances', context);
            }
        }
    });

    // update one attendance
    router.get('/tourID=:tourID&visitorID=:visitorID', function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateattendance.js"];
        var mysql = req.app.get('mysql');
        getAttendance(res, mysql, context, req.params, done);
        function done() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('update_attendance', context);
            }
        }
    });


    router.put('/tourID=:tourID&visitorID=:visitorID', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Tours_Visitors SET tourID=?, visitorID=? WHERE tourID=? AND visitorID=?";
        var inserts = [req.body.tourID, req.body.visitorID, req.body.curTourID, req.body.curVisitorID];
        sql = mysql.pool.query(sql, inserts, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        });
    });

    router.delete('/tourID=:tourID&visitorID=:visitorID', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Tours_Visitors WHERE tourID=? AND visitorID=?";
        var inserts = [req.params.tourID, req.params.visitorID];
        sql = mysql.pool.query(sql, inserts, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.status(400);
                res.end();
            } else {
                res.status(202);
                res.end();
            }
        });
    });

    return router;
}();