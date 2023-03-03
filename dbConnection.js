//Connecting to database
const { Client } = require('pg')

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
  } else {
    console.log('connected')
  }
})


