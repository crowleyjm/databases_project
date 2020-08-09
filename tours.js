module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // get all tours
    function getTours(res, mysql, context, done) {
        var sql = "SELECT tour.tourID, DATE_FORMAT(tour.date, '%m/%d/%Y') as date, TIME_FORMAT(tour.startTime, '%h:%i %p') as startTime, TIME_FORMAT(tour.endTime, '%h:%i %p') as endTime, tour.price, tour.capacity, tour.numberEnrolled, mus.name as museum FROM Tours AS tour INNER JOIN Museums AS mus USING (museumID)";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.tours = result;
            for (const tour of context.tours) {
                tour.price = '$' + tour.price.toFixed(2);
            }
            done();
        });
    }

    // get searched tours
    function searchTours(res, mysql, context, done, searchedTour) {
        var sql = "SELECT tour.tourID, DATE_FORMAT(tour.date, '%m/%d/%Y') as date, TIME_FORMAT(tour.startTime, '%h:%i %p') as startTime, TIME_FORMAT(tour.endTime, '%h:%i %p') as endTime, tour.price, tour.capacity, tour.numberEnrolled, mus.name as museum FROM Tours AS tour INNER JOIN Museums AS mus USING (museumID) WHERE price = ?"; //LIKE %name=?%
        var inserts = [searchedTour];
        mysql.pool.query(sql, searchedTour, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.tours = result;
            for (const tour of context.tours) {
                tour.price = '$' + tour.price.toFixed(2);
            }
            done();
        });
    }


    // get one tour
    function getOneTour(res, mysql, context, tourID, done) {
        var sql = "SELECT museumID, name FROM Museums";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.museums = result;
        });
        sql = "SELECT tourID, DATE_FORMAT(date, '%Y-%m-%d') as date, TIME_FORMAT(startTime, '%H:%i') as startTime, TIME_FORMAT(endTime, '%H:%i') as endTime, price, capacity, numberEnrolled FROM Tours WHERE tourID=?";
        var inserts = [tourID];
        mysql.pool.query(sql, inserts, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.tours = result[0];
            done();
        });
    }

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletetour.js"];
        var tourPrice = req.query.tourPrice;
        var mysql = req.app.get('mysql');
        if (tourPrice == undefined || tourPrice == "") {
            getTours(res, mysql, context, done);
        } else {
            searchTours(res, mysql, context, done, tourPrice);
        }

        function done() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('view_tours', context);
            }
        }
    });

    // update one tour
    router.get('/:tourID', function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatetour.js"];
        var mysql = req.app.get('mysql');
        getOneTour(res, mysql, context, req.params.tourID, done);
        function done() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('update_tour', context);
            }
        }
    });

    router.put('/:tourID', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Tours SET date=?, startTime=?, endTime=?, price=?, capacity=?, numberEnrolled=?, museumID=? WHERE tourID=?";
        var inserts = [req.body.date, req.body.startTime, req.body.endTime, req.body.price, req.body.capacity, req.body.numberEnrolled, req.body.museumID, req.params.tourID];
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

    router.delete('/:tourID', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Tours WHERE tourID = ?";
        var inserts = [req.params.tourID];
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