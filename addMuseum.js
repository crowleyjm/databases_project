module.exports = function () {
    var express = require('express');
    var router = express.Router();

    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        callbackCount++;
        if (callbackCount >= 1) {
            res.render('add_museum', context);
        }
    });

    // add museum
    router.post('/', function (req, res) {
        console.log("ADDING MUSEUM");
        console.log(req.body);
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Museums(name, city, country, museumType) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.name, req.body.city, req.body.country, req.body.museumType];
        sql = mysql.pool.query(sql, inserts, function (err, results, fields) {
            if (err) {
                console.log(err);
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.redirect('/add_museum');
            }
        });
    });
    return router;
}();