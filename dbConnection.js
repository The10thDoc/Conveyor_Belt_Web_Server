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
  host: 'ec2-44-194-4-127.compute-1.amazonaws.com',
  database: 'd6bhuh5niesvn6',
  user: 'wsogoxkbuvqwoq',
  port: 5432,
  password: '3a630e55c6d938ba0864800ab91afc899b222b44ea91eef819e8cf96a7913e9d',
})

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