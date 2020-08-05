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

    // get searched museums
    function searchMuseums(res, mysql, context, done, searchedMuseum){
        var sql = "SELECT museumID, name, city, country, museumType FROM Museums WHERE name = " + "'" + searchedMuseum + "'"; //LIKE %name=?%
        mysql.pool.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.searchedMuseums = result;
            console.log(context.museums);
            done();
        });
    } 


    // get one museum
    function getMuseum(res, mysql, context, museumID, done){
        var sql = "SELECT museumID, name, city, country, museumType FROM Museums WHERE museumID=?";
        var inserts = [museumID];
        mysql.pool.query(sql, inserts, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.museums = result[0];
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
                res.render('view_museums', context);
            }
        }
    });


    // update one museum
    router.get('/:museumID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatemuseum.js"];
        var mysql = req.app.get('mysql');
        getMuseum(res, mysql, context, req.params.museumID, done);
        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('update_museum', context);
            }
        }
    });

    // add one museum
    router.post('/add_museum', function(req, res){
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

    router.put('/:museumID', function(req, res){
        console.log(req.params);
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Museums SET name=?, city=?, country=?, museumType=? WHERE museumID=?";
        var inserts = [req.body.name, req.body.city, req.body.country, req.body.museumType, req.params.museumID];
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

    router.delete('/:museumID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Museums WHERE museumID = ?";
        var inserts = [req.params.museumID];
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