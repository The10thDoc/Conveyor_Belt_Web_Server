/*
Author:  Harrison Kuhn
Use:  ECEN 404 Capstone Project
Team: 59: Motor conveyor for package discribution
*/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;  //Placeholder port
var path = require('path');

app.use(cors({origin: "*"}));
app.use(express.static('serverFiles')); //Specifying folder to look for files in
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT || port, () => {
  console.log(`Point of Sales system listening on port ${port}`)
})
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
var desiredStickerColor;

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

//TODO: FINISH STICKER COLOR FUNCTION
function countStickerColors() {
  client.query('SELECT * FROM packageinfo WHERE stickercolor = ',(err, res)=>{
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

//GET from database functions

app.get('/packageInfo', function(req, res) {
  if(Object.keys(req.query).length === 0) { //If no args
    res.send(packageInfo);
  }
})

//TODO: If user wants specific sessionID
app.get('/sessionInfo', function(req, res) {
  if(Object.keys(req.query).length === 0) { //If no args
    res.send(sessionInfo);
  }
  else {

  }
})

//POST FUNCTIONS

app.post('/addPackage', function(req, res) {
  console.log("\nReq.body:");
  console.log(req.body);

  var packageid = req.body.packageid;
  var stickercolor = req.body.stickercolor;
  var timesorted = req.body.timesorted;

  //Construction INSERT query
  var command = 'INSERT INTO packageinfo VALUES(' + packageid + 
                                                ', \'' + stickercolor + 
                                                '\', \'' + timesorted + '\')';
  console.log(command);

  //Running query now
  client.query(command, (err, result)=>{
    if(!err) {
      console.log("COMPLETE :) \n\n");
      res.send("Completed");
    }
    else {
      console.log("\nERROR:");
      console.log(err.message);
    }
  })
})

app.post('/finishSession', function(req, res) {
  console.log("\nReq.body:");
  console.log(req.body);

  var sessionid = req.body.sessionid;
  var starttime = req.body.starttime;
  var endtime = req.body.endtime;
  var totalsorted = req.body.totalsorted;
  var numredsorted = req.body.numredsorted;
  var numgreensorted = req.body.numgreensorted;
  var numbluesorted = req.body.numbluesorted;
  var numyellowsorted = req.body.numyellowsorted;
  var nummagentasorted = req.body.nummagentasorted;
  var numcyansorted = req.body.numcyansorted;
  var numerrors = req.body.numerrors;

  //Constructing INSERT query
  var command = 'INSERT INTO sessioninfo VALUES(' + sessionid +
                                                ', \'' + starttime +
                                                '\', \'' + endtime +
                                                '\', ' + totalsorted +
                                                ', ' + numredsorted +
                                                ', ' + numgreensorted +
                                                ', ' + numbluesorted +
                                                ', ' + numyellowsorted +
                                                ', ' + nummagentasorted +
                                                ', ' + numcyansorted +
                                                ', ' + numerrors + ')';
  console.log(command);

  //Running query now
  client.query(command, (err, result)=>{
    if(!err) {
      console.log("COMPLETE :) \n\n");
      res.send("Completed");
    }
    else {
      console.log("\nERROR:");
      console.log(err.message);
    }
  })
})
