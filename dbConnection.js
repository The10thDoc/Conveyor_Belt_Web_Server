/*
Author:  Harrison Kuhn
Use:  ECEN 404 Capstone Project
Team: 59: Motor conveyor for package discribution
*/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
var path = require('path');

app.use(cors({origin: "*"}));
app.use(express.static('serverFiles')); //Specifying folder to look for files in
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connecting to database
const {Client} = require('pg');     //pg dependency for Postgres
const {query} = require('express'); //express dependency

//Making client for connecting to database
const client = new Client({
  connectionString: process.env.DATABASE_URL, //Using a set environment variable for connection string
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

//GET FUNCTIONS
app.get('/updatePackageInfo', function(req, res) {
  updatePackageInfo();
  res.send("Complete");
});

app.get('/updateSessionInfo', function(req, res) {
  updateSessionInfo();
  res.send("Complete");
});

