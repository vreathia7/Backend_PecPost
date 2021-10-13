const express = require('express');
const app = express();
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.pmdco.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  
  mongoose.connection.on("error", function(error) {
    console.log(error)
  })
  
  mongoose.connection.on("open", function() {
    console.log("Connected to MongoDB database.")
  })

  require('./models/user')
  app.use(express.json())
  app.use(require('./routes/auth'))


app.listen(8000, ()=>{
    console.log("Server is on.");
})