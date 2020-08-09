const { request } = require('https');

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
                res.render('add_media', context);
            }
        }
    });

    // add one media
    router.post('/', function (req, res) {
        console.log(req.body);
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Media(mediaType, name, artist, mediaDate, museumID) VALUES (?, ?, ?, ?, ?)";
        var artist = req.body.artist;
        if (artist === '' || artist.toUpperCase() === 'NULL') {
            artist = null;
        }
        var date = req.body.mediaDate;
        if (date === '' || date.toUpperCase() === 'NULL') {
            date = null;
        }
        var inserts = [req.body.mediaType, req.body.name, artist, date, req.body.museumID];
        sql = mysql.pool.query(sql, inserts, function (err, results, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.redirect('/add_media');
            }
        });
    });
    return router;
}();