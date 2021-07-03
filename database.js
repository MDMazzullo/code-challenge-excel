require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const connect = () => connection.connect();

const query = (query, parameters) => {
  return new Promise((resolve,reject) => connection.query(query, parameters,
    (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    })
  );
}

const end = () => connection.end();

exports.connect = connect;
exports.query = query;
exports.end = end;