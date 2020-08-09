const express = require('express');
const mysql = require('./dbcon.js');
const bP = require('body-parser');
const path = require('path');
const handleBars = require('express-handlebars').create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
});

var app = express();
app.set('port', 8486);
var server = app.listen(process.env.PORT || 8486 || app.get('port'), function () {
    console.log('Listening on port ' + server.address().port);
});
app.set('mysql', mysql);
app.use(bP.urlencoded({ extended: true }));

app.use('/static', express.static('public'));

app.engine('handlebars', handleBars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "views"));

app.use('/view_museums', require('./museums.js'));
app.use('/add_museum', require('./addMuseum.js'));
app.use('/update_museum', require('./museums.js'));
app.use('/delete_museum', require('./museums.js'));

app.use('/view_visitors', require('./visitors.js'));
app.use('/add_visitor', require('./addVisitor.js'));
app.use('/update_visitor', require('./visitors.js'));
app.use('/delete_visitor', require('./visitors.js'));

app.use('/view_media', require('./media.js'));
app.use('/add_media', require('./addMedia.js'));
app.use('/update_media', require('./media.js'));
app.use('/delete_media', require('./media.js'));

app.use('/view_tours', require('./tours.js'));
app.use('/add_tour', require('./addTour.js'));
app.use('/update_tour', require('./tours.js'));
app.use('/delete_tour', require('./tours.js'));

app.use('/view_visits', require('./visits.js'));
app.use('/add_visit', require('./addVisit.js'));
app.use('/update_visit', require('./visits.js'));
app.use('/delete_visit', require('./visits.js'));

app.use('/view_attendances', require('./attendances.js'));
app.use('/add_attendance', require('./addAttendance.js'));
app.use('/update_attendance', require('./attendances.js'));
app.use('/delete_attendance', require('./attendances.js'));

app.get('/', function (req, res) {
    res.render('index');
});
