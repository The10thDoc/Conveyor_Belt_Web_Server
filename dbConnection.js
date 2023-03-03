const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
var path = require('path');

app.use(cors({origin: "*"}));
app.use(express.static('serverFiles'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

























//Connecting to database
const {Client} = require('pg');
const {query} = require('express');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})
/*
const client = new Client({
  host: '',
  database: '',
  user: '',
  port: ,
  password: '',
})
*/
client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  }
  else {
    console.log('connected')
  }
});

var packageInfo;
var sessionInfo;

updatePackageInfo();
updateSessionInfo();

function updatePackageInfo() {
  client.query('SELECT * FROM packageinfo ORDER BY packageid ASC',(err, res)=>{
    if(!err) {
      console.log("Query: packageInfo");
      packageInfo = res.rows
    }
    else {
        console.log("\nERROR: ");
        console.log(err.message);
    }
  });
}

function updateSessionInfo() {
  client.query('SELECT * FROM sessioninfo ORDER BY sessionid ASC',(err, res)=>{
    if(!err) {
      console.log("Query: sessionInfo");
      sessionInfo = res.rows
    }
    else {
        console.log("\nERROR: ");
        console.log(err.message);
    }
  });
}