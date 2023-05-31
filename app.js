const express = require('express')
const app = express()
const mongoose  = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
    res.send('this is rest api for our GoPlanner project')
  })
  
  mongoose.connect(process.env.DB_CONNECTION,{
      useNewUrlParser: true,
      useUnifiedTopology: true
  })
  let db = mongoose.connection
  
  //hanlde error
  db.on('error', console.error.bind(console,'Error Establishing a database Connection?'))
  
  //handle success
  db.once('open', () => {
      console.log('Database is Connected')
  })
  
  app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`)
  })