module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // get all museums
    function getMuseums(res, mysql, context, done){
        var sql = "SELECT museumID, name, city, country, museumType FROM Museums";
        mysql.pool.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.museums = result;
            console.log(context.museums);
            done();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletemuseum.js"];
        var museumName = req.query.museumName;
        var mysql = req.app.get('mysql');
        if (museumName == undefined || museumName == "") {
            getMuseums(res, mysql, context, done);
        } else {
            mysql.pool.query("SELECT museumID, name, city, country, museumType FROM Museums WHERE name LIKE '%" + req.query.museumName + "%'", function(err, results, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                context.museums = results;
                done();
            })
        }
    
        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('add_museum', context);
            }
        }
    });

    // add museum
    router.post('/', function(req, res){
        console.log("ADDING MUSEUM");
        console.log(req.body);
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Museums(name, city, country, museumType) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.name, req.body.city, req.body.country, req.body.museumType];
        sql = mysql.pool.query(sql, inserts, function(err, results, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{
                res.redirect('/add_museum');
            }
        });
    });
    return router;
}();