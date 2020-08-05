module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // get all visitors
    function getVisitors(res, mysql, context, done){
        var sql = "SELECT visitorID, email, firstName, lastName, isMember FROM Visitors";
        mysql.pool.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.visitors = result;
            console.log(context.visitors);
            done();
        });
    }

    // get searched visitors
    function searchVisitors(res, mysql, context, done, searchedVisitor){
        var sql = "SELECT visitorID, email, firstName, lastName, isMember FROM Visitors WHERE lastName = " + "'" + searchedVisitor + "'"; //LIKE %name=?%
        mysql.pool.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.searchedVisitors = result;
            console.log(context.visitors);
            done();
        });
    } 


    // get one visitor
    function getVisitor(res, mysql, context, visitorID, done){
        var sql = "SELECT visitorID, email, firstName, lastName, isMember FROM Visitors WHERE visitorID=?";
        var inserts = [visitorID];
        mysql.pool.query(sql, inserts, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.visitors = result[0];
            done();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletevisitor.js"];
        var visitorName = req.query.visitorName;
        var mysql = req.app.get('mysql');
        if (visitorName == undefined || visitorName == "") {
            getVisitors(res, mysql, context, done);
        } else {
            mysql.pool.query("SELECT visitorID, email, firstName, lastName, isMember FROM Visitors WHERE lastName LIKE '%" + req.query.visitorName + "%'", function(err, results, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                console.log("This gets searched visitor");
                context.visitors = results;
                done();
            })
            console.log("Searched visitor");
        }
    
        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('view_visitors', context);
            }
        }
    });


    // update one visitor
    router.get('/:visitorID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatevisitor.js"];
        var mysql = req.app.get('mysql');
        getVisitor(res, mysql, context, req.params.visitorID, done);
        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('update_visitor', context);
            }
        }
    });

    // add visitor
    router.post('/add_visitor', function(req, res){
        console.log(req.body);
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Visitors(email, firstName, lastName, isMember) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.email, req.body.firstName, req.body.lastName, req.body.isMember];
        sql = mysql.pool.query(sql, inserts, function(err, results, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{
                res.redirect('/add_visitor');
            }
        });
    });

    router.put('/:visitorID', function(req, res){
        console.log(req.params);
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Visitors SET email=?, firstName=?, lastName=?, isMember=? WHERE visitorID=?";
        var inserts = [req.body.email, req.body.firstName, req.body.lastName, req.body.isMember, req.params.visitorID];
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

    router.delete('/:visitorID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Visitors WHERE visitorID = ?";
        var inserts = [req.params.visitorID];
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