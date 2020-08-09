module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // get all museums
    function getMuseuems(res, mysql, context, done) {
        var sql = "SELECT museumID, name FROM Museums";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.museums = result;
            console.log(context.museums);
            done();
        });
    }

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getMuseuems(res, mysql, context, done);

        function done() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('add_tour', context);
            }
        }
    });

    // add tour
    router.post('/', function (req, res) {
        console.log("ADDING TOUR");
        console.log(req.body);
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Tours(date, startTime, endTime, price, capacity, numberEnrolled, museumID) VALUES (?, ?, ?, ?, ?, ?, ?)";
        var inserts = [req.body.date, req.body.startTime, req.body.endTime, req.body.price, req.body.capacity, req.body.numberEnrolled, req.body.museumID];
        sql = mysql.pool.query(sql, inserts, function (err, results, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.redirect('/add_tour');
            }
        });
    });
    return router;
}();