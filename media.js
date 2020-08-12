module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // get all media
    function getMedia(res, mysql, context, done) {
        var sql = "SELECT med.mediaID, med.mediaType, med.name, med.artist, DATE_FORMAT(med.mediaDate, '%Y') AS Date, mus.name as Museum FROM Media AS med LEFT JOIN Museums AS mus USING (museumID)";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.media = result;
            done();
        });
    }

    // get searched media
    function searchMedia(res, mysql, context, done, searchedMedia) {
        var sql = "SELECT med.mediaID, med.mediaType, med.name, med.artist, DATE_FORMAT(med.mediaDate, '%Y') AS Date, mus.name as Museum FROM Media AS med LEFT JOIN Museums AS mus USING (museumID) WHERE med.name LIKE ?"; //LIKE %name=?%
        searchedMedia = '%' + searchedMedia + '%';
        var inserts = [searchedMedia];
        mysql.pool.query(sql, inserts, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.media = result;
            done();
        });
    }

    // get one medium
    function getMedium(res, mysql, context, mediaID, done) {
        var sql = "SELECT museumID, name FROM Museums";
        mysql.pool.query(sql, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.museums = result;
        });
        sql = "SELECT mediaID, mediaType, name, artist, DATE_FORMAT(mediaDate, '%Y-%m-%d') as mediaDate, museumID FROM Media WHERE mediaID=?";
        var inserts = [mediaID];
        mysql.pool.query(sql, inserts, function (err, result, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            }
            context.media = result[0];
            console.log(context);
            done();
        });
    }

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletemedia.js"];
        var mediaName = req.query.mediaName;
        var mysql = req.app.get('mysql');
        if (mediaName == undefined || mediaName == "") {
            getMedia(res, mysql, context, done);
        } else {
            searchMedia(res, mysql, context, done, mediaName);
        }
        function done() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('view_media', context);
            }
        }
    });

    // update one medium
    router.get('/:mediaID', function (req, res) {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatemedia.js"];
        var mysql = req.app.get('mysql');
        getMedium(res, mysql, context, req.params.mediaID, done);
        function done() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('update_media', context);
            }
        }
    });

    router.put('/:mediaID', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Media SET mediaType=?, name=?, artist=?, mediaDate=?, museumID=? WHERE mediaID=?";
        var artist = req.body.artist;
        if (artist === '' || artist.toUpperCase() === 'NULL') {
            artist = null;
        }
        var date = req.body.mediaDate;
        if (date === '' || date.toUpperCase() === 'NULL') {
            date = null;
        }
        var museum = req.body.museumID;
        if (museum === 'NULL') {
            museum = null;
        }
        var inserts = [req.body.mediaType, req.body.name, artist, date, museum, req.params.mediaID];
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

    router.delete('/:mediaID', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Media WHERE mediaID = ?";
        var inserts = [req.params.mediaID];
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