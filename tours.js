module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // get all tours
    function getTours(res, mysql, context, done){
        var sql = "SELECT tour.tourID, DATE_FORMAT(tour.date, '%m/%d/%Y') as date, TIME_FORMAT(tour.startTime, '%h:%i %p') as startTime, TIME_FORMAT(tour.endTime, '%h:%i %p') as endTime, tour.price, tour.capacity, tour.numberEnrolled, mus.name as museum FROM Tours AS tour INNER JOIN Museums AS mus USING (museumID)";
        mysql.pool.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.tours = result;
            for (const tour of context.tours) {
                tour.price = '$' + tour.price.toFixed(2);
            }
            console.log(context.tours);
            done();
        });
    }

    // get searched tours
    function searchTours(res, mysql, context, done, searchedTour){
        var sql = "SELECT tour.tourID, DATE_FORMAT(tour.date, '%m/%d/%Y') as date, TIME_FORMAT(tour.startTime, '%h:%i %p') as startTime, TIME_FORMAT(tour.endTime, '%h:%i %p') as endTime, tour.price, tour.capacity, tour.numberEnrolled, mus.name as museum FROM Tours AS tour INNER JOIN Museums AS mus USING (museumID) WHERE price = " + "'" + searchedTour + "'"; //LIKE %name=?%
        mysql.pool.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.searchedTours = result;
            console.log(context.tours);
            done();
        });
    } 


    // get one tour
    function getOneTour(res, mysql, context, tourID, done){
        var sql = "SELECT tour.tourID, DATE_FORMAT(tour.date, '%m/%d/%Y') as date, TIME_FORMAT(tour.startTime, '%h:%i %p') as startTime, TIME_FORMAT(tour.endTime, '%h:%i %p') as endTime, tour.price, tour.capacity, tour.numberEnrolled, mus.name as museum FROM Tours AS tour INNER JOIN Museums AS mus USING (museumID) WHERE tourID=?";
        var inserts = [tourID];
        mysql.pool.query(sql, inserts, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.tours = result[0];
            done();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletetour.js"];
        var tourPrice = req.query.tourPrice;
        var mysql = req.app.get('mysql');
        if (tourPrice == undefined || tourPrice == "") {
            getTours(res, mysql, context, done);
        } else {
            mysql.pool.query("SELECT tour.tourID, DATE_FORMAT(tour.date, '%m/%d/%Y') as date, TIME_FORMAT(tour.startTime, '%h:%i %p') as startTime, TIME_FORMAT(tour.endTime, '%h:%i %p') as endTime, tour.price, tour.capacity, tour.numberEnrolled, mus.name as museum FROM Tours AS tour INNER JOIN Museums AS mus USING (museumID) WHERE price LIKE '%" + req.query.tourPrice + "%'", function(err, results, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                context.tours = results;
                for (const tour of context.tours) {
                    tour.price = '$' + tour.price.toFixed(2);
                }
                done();
            })
        }
    
        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('view_tours', context);
            }
        }
    });

    // update one tour
    router.get('/:tourID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatetour.js"];
        var mysql = req.app.get('mysql');
        getOneTour(res, mysql, context, req.params.tourID, done);
        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('update_tour', context);
            }
        }
    });

    // add tour
    router.post('/add_tour', function(req, res){
        console.log(req.body);
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Tours(startTime, endTime, price, capacity, numberEnrolled, museumID) VALUES (?, ?, ?, ?, ?, ?)";
        var inserts = [req.body.startTime, req.body.endTime, req.body.price, req.body.capacity, req.body.numberEnrolled, req.body.museumID];
        sql = mysql.pool.query(sql, inserts, function(err, results, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{
                res.redirect('/add_tour');
            }
        });
    });

    router.put('/:tourID', function(req, res){
        console.log(req.params);
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Tours SET startTime=?, endTime=?, price=?, capacity=?, numberEnrolled=?, museumID=? WHERE tourID=?";
        var inserts = [req.body.startTime, req.body.endTime, req.body.price, req.body.capacity, req.body.numberEnrolled, req.body.museumID, req.params.tourID];
        sql = mysql.pool.query(sql, inserts, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    router.delete('/:tourID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Tours WHERE tourID = ?";
        var inserts = [req.params.tourID];
        sql = mysql.pool.query(sql, inserts, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.status(400);
                res.end();
            }else{
                res.status(202);
                res.end();
            }
        });
    });
    return router;
}();