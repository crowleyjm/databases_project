module.exports = function(){
    var express = require('express');
    var router = express.Router();
    // get all media
    function getMedia(res, mysql, context, done){
        var sql = "SELECT mediaID, mediaType, name, artist, mediaDate, museumID FROM Media";
        mysql.pool.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.media = result;
            console.log(context.media);
            done();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletemedia.js"];
        var mediaName = req.query.mediaName;
        var mysql = req.app.get('mysql');
        if (mediaName == undefined || mediaName == "") {
            getMedia(res, mysql, context, done);
        } else {
            mysql.pool.query("SELECT mediaID, mediaType, name, artist, mediaDate, museumID FROM Media WHERE name LIKE '%" + req.query.mediaName + "%'", function(err, results, fields){
                if(err){
                    res.write(JSON.stringify(err));
                    res.end();
                }
                context.media = results;
                done();
            })
        }
    
        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('add_media', context);
            }
        }
    });

    // add one media
    router.post('/', function(req, res){
        console.log(req.body);
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Media(mediaType, name, artist, mediaDate, museumID) VALUES (?, ?, ?, ?, ?)";
        var inserts = [req.body.mediaType, req.body.name, req.body.artist, req.body.mediaDate, req.body.museumID];
        sql = mysql.pool.query(sql, inserts, function(err, results, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }else{
                res.redirect('/add_media');
            }
        });
    });
    return router;
}();