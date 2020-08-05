var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_crowleji',
  password        : '',
  database        : 'cs340_crowleji'
});

module.exports.pool = pool;
