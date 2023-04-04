/*
Author:  Harrison Kuhn
Use:  ECEN 404 Capstone Project
Team: 59 - Motor conveyor for package discribution
*/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;  //Using dynamically assigned port by Heroku
var path = require('path');

app.use(cors({origin: "*"}));
app.use(express.static('serverFiles')); //Specifying folder to look for files in
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Point of Sales system listening on port ${port}`)
})
//Connecting to database
const {Client} = require('pg');     //pg dependency for Postgres
const {query} = require('express'); //express dependency
const { hasSubscribers } = require('diagnostics_channel');
const { start } = require('repl');

//Making client for connecting to database
const client = new Client({
  connectionString: process.env.DATABASE_URL, //Using a set environment variable for connection string
  ssl: {
    rejectUnauthorized: false
  }
})

//Connecting to PostgreSQL database
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
var colorInfo;
var timeFrame;

//Initializing tables and ID trackers
updatePackageInfo();
updateSessionInfo();

function updatePackageInfo() {
  client.query('SELECT * FROM packageinfo ORDER BY packageid ASC',(err, res)=>{
    if(!err) {
      console.log("Query: packageInfo");
      packageInfo = res.rows;
    }
    else {
        console.log("\nERROR: \n");
        console.log(err.message);
    }
  });
}

function updateSessionInfo() {
  client.query('SELECT * FROM sessioninfo ORDER BY sessionid ASC',(err, res)=>{
    if(!err) {
      console.log("Query: sessionInfo");
      sessionInfo = res.rows;
    }
    else {
        console.log("\nERROR: \n");
        console.log(err.message);
    }
  });
}

function countStickerColors() {
  client.query('SELECT stickercolor, COUNT(stickercolor) FROM packageinfo GROUP BY stickercolor',(err, res)=>{
    if(!err) {
      console.log("Query: Sticker Color Count");
      colorInfo = res.rows;
    }
    else {
        console.log("\nERROR: \n");
        console.log(err.message);
    }
  });
}

function getTimes() {
  client.query('SELECT MIN(timesorted), MAX(timesorted) FROM packageinfo',(err, res)=>{
    if(!err) {
      console.log("Query: Start and End Time");
      timeFrame = res.rows;
    }
    else {
        console.log("\nERROR: \n");
        console.log(err.message);
    }
    });
}


function clearPackages() {
  client.query('DELETE FROM packageinfo',(err, res)=> {
    if(!err) {
      console.log("Deleted all packages");
    }
    else {
        console.log("\nERROR: \n");
        console.log(err.message);
    }
  });
}


//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------

//GET FUNCTIONS

app.get('/', function(req, res) {
  res.send("Hello ECEN 404!");
})

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
})

app.get('/colorCount', function(req, res) {
  countStickerColors();

  if(Object.keys(req.query).length === 0) { //If no args
    res.send(colorInfo);
  }
})

app.get('/timeFrame'), function(req, res) {
  getTimes();
  if(Object.keys(req.query).length === 0) { //If no args
    res.send(timeFrame);
  }

}
//GET version is used by ESP32
app.get('/addScannedPackage', function(req, res) {

  const stickercolor = req.query.stickercolor;
  const timesorted = req.query.timesorted;

  //Construction INSERT query
  var command = 'INSERT INTO packageinfo (stickercolor, timesorted) VALUES(\'' + stickercolor + 
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

  //Refreshing tables
  updatePackageInfo();
})

//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------

//POST FUNCTIONS
//POST version used by web server text fields
app.post('/addPackage', function(req, res) {
  console.log("\nReq.body:");
  console.log(req.body);

  var stickercolor = req.body.stickercolor;
  var timesorted = req.body.timesorted;

  //Construction INSERT query
  var command = 'INSERT INTO packageinfo (stickercolor, timesorted) VALUES(\'' + stickercolor + 
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

  var starttime = req.body.starttime;
  var endtime = req.body.endtime;
  var totalsorted = req.body.totalsorted;
  var numredsorted = req.body.numredsorted;
  var numgreensorted = req.body.numgreensorted;
  var numbluesorted = req.body.numbluesorted;
  var numerrors = req.body.numerrors;

  //Constructing INSERT query
  var command = 'INSERT INTO sessioninfo (starttime, endtime, totalsorted, numredsorted, numgreensorted, numbluesorted, numerrors) VALUES(\'' + starttime +
                                                '\', \'' + endtime +
                                                '\', ' + totalsorted +
                                                ', ' + numredsorted +
                                                ', ' + numgreensorted +
                                                ', ' + numbluesorted +
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
  });

  clearPackages();
})
