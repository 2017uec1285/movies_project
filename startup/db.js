const winston =require('winston');
const mongoose = require("mongoose");
const config=require('config');
module.exports=function(){
  const db=config.get('db');
    mongoose.connect(db,{
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .then(() => winston.info(`Connected to ${db}...`));
}

