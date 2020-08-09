module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // get all visits
    function getVisits(res, mysql, context, done) {
        var sql = "SELECT mus.name AS museum, CONCAT_WS(', ', vis.lastName, vis.firstName) AS visitor, DATE_FORMAT(visitDate, '%Y-%m-%d') AS visitDate, mus.museumID AS museumID, vis.visitorID AS visitorID FROM Museums_Visitors INNER JOIN Museums AS mus USING (museumID) INNER JOIN Visitors AS vis USING (visitorID) ORDER BY visitDate ASC";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.visits = result;
            done();
        });
    }


    // get one visit
    function getVisit(res, mysql, context, params, done) {
        var sql = "SELECT museumID, name FROM Museums";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.museums = result;
        });
        sql = "SELECT visitorID, CONCAT_WS(', ', lastName, firstName) AS visitor FROM Visitors";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.visitors = result;
        });
        sql = "SELECT mus.name AS museum, CONCAT_WS(', ', vis.lastName, vis.firstName) AS visitor, DATE_FORMAT(visitDate, '%Y-%m-%d') AS visitDate, mus.museumID AS museumID, vis.visitorID AS visitorID FROM Museums_Visitors INNER JOIN Museums AS mus USING (museumID) INNER JOIN Visitors AS vis USING (visitorID) WHERE museumID=? AND visitorID=? AND visitDate=?";
        var inserts = [params.museumID, params.visitorID, params.visitDate];
        mysql.pool.query(sql, inserts, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.visits = result[0];
            done();
        });
    }

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletevisit.js"];
        var mysql = req.app.get('mysql');
        getVisits(res, mysql, context, done);

        function done() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('view_visits', context);
            }
        }
    });


    // update one visit
    router.get('/museumID=:museumID&visitorID=:visitorID&visitDate=:visitDate', function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatevisit.js"];
        var mysql = req.app.get('mysql');
        getVisit(res, mysql, context, req.params, done);
        function done() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('update_visit', context);
            }
        }
    });


    router.put('/museumID=:museumID&visitorID=:visitorID&visitDate=:visitDate', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Museums_Visitors SET museumID=?, visitorID=?, visitDate=? WHERE museumID=? AND visitorID=? AND visitDate=?";
        var inserts = [req.body.museumID, req.body.visitorID, req.body.visitDate, req.body.curMuseumID, req.body.curVisitorID, req.body.curVisitDate];
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

    router.delete('/museumID=:museumID&visitorID=:visitorID&visitDate=:visitDate', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Museums_Visitors WHERE museumID=? AND visitorID=? AND visitDate=?";
        var inserts = [req.params.museumID, req.params.visitorID, req.params.visitDate];
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