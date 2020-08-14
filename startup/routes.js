const express = require('express');
const error =require('../middleware/error');
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const customers = require("../routes/customers");
const rental = require("../routes/rentals");
const users = require("../routes/users");
const auth=require('../routes/auth');
const returns=require('../routes/returns');
const cors=require('cors');



module.exports=function(app){
    app.use(cors());
    app.use(express.json());
    app.use("/api/genres", genres);
    app.use("/api/movies", movies);
    app.use("/api/customers", customers);
    app.use("/api/rentals", rental);
    app.use("/api/users", users);
    app.use("/api/auth",auth);
    app.use("/api/returns",returns);
    app.use(error);
}