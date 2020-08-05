module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // get all media
    function getMedia(res, mysql, context, done){
        var sql = "SELECT med.mediaID, med.mediaType, med.name, med.artist, DATE_FORMAT(med.mediaDate, '%Y') AS Date, mus.name as Museum FROM Media AS med INNER JOIN Museums AS mus USING (museumID)";
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

    // get searched media
    function searchMedia(res, mysql, context, done, searchedMedia){
        var sql = "SELECT med.mediaID, med.mediaType, med.name, med.artist, DATE_FORMAT(med.mediaDate, '%Y') AS Date, mus.name as Museum FROM Media AS med INNER JOIN Museums AS mus USING (museumID) WHERE name = " + "'" + searchedMedia + "'"; //LIKE %name=?%
        mysql.pool.query(sql, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.searchedMedia = result;
            console.log(context.media);
            done();
        });
    } 

    // get one medium
    function getMedium(res, mysql, context, mediaID, done){
        var sql = "SELECT med.mediaID, med.mediaType, med.name, med.artist, DATE_FORMAT(med.mediaDate, '%Y') AS Date, mus.name as Museum FROM Media AS med INNER JOIN Museums AS mus USING (museumID) WHERE mediaID=?";
        var inserts = [mediaID];
        mysql.pool.query(sql, inserts, function(err, result, fields){
            if(err){
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.media = result[0];
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
            mysql.pool.query("SELECT med.mediaID, med.mediaType, med.name, med.artist, DATE_FORMAT(med.mediaDate, '%Y') AS Date, mus.name as Museum FROM Media AS med INNER JOIN Museums AS mus USING (museumID) WHERE name LIKE '%" + req.query.mediaName + "%'", function(err, results, fields){
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
                res.render('view_media', context);
            }
        }
    });

    // update one medium
    router.get('/:mediaID', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatemedia.js"];
        var mysql = req.app.get('mysql');
        getMedium(res, mysql, context, req.params.mediaID, done);
        function done(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('update_media', context);
            }
        }
    });

    // add one media
    router.post('/add_media', function(req, res){
        console.log(req.body);
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Media(mediaID, mediaType, name, artist, mediaDate, museumID) VALUES (?, ?, ?, ?, ?, ?)";
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

    router.put('/:mediaID', function(req, res){
        console.log(req.params);
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Media SET mediaType=?, name=?, artist=?, mediaDate=? museumID=? WHERE mediaID=?";
        var inserts = [req.body.mediaType, req.body.name, req.body.artist, req.body.mediaDate, req.body.museumID, req.params.mediaID];
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

    router.delete('/:mediaID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Media WHERE mediaID = ?";
        var inserts = [req.params.mediaID];
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