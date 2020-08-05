module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // get all tours
    function getTours(res, mysql, context, done){
        var sql = "SELECT tourID, startTime, endTime, price, capacity, numberEnrolled, museumID FROM Tours";
        mysql.pool.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.tours = result;
            console.log(context.tours);
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
            mysql.pool.query("SELECT tourID, startTime, endTime, price, capacity, numberEnrolled, museumID FROM Tours WHERE price LIKE '%" + req.query.tourPrice + "%'", function(err, results, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                context.tours = results;
                done();
            })
        }
    
        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('add_tour', context);
            }
        }
    });

    // add tour
    router.post('/', function(req, res){
        console.log("ADDING TOUR");
        console.log(req.body);
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Tours(tourID, startTime, endTime, price, capacity, numberEnrolled, museumID) VALUES (?, ?, ?, ?, ?, ?, ?)";
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
    return router;
}();