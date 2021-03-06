"use strict";

const express   = require("express");
const mongoose  = require("mongoose");

const helmet    = require("helmet");
const sanitize  = require("express-mongo-sanitize");
const path      = require("path");

const UserRoute = require("./route/UserRoute");

require("dotenv").config();

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connection to MongoDB successful !"))
  .catch(() => console.log("Connection to MongoDB failed !"));

const app = express();
app.use(express.json());

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(sanitize());

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin", 
    "*"
    );
  res.setHeader(
    "Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
  res.setHeader(
    "Access-Control-Allow-Methods", 
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
  next();
});

app.use("/img", express.static(path.join(__dirname, "img")));

app.use(process.env.USER_ROUTE, UserRoute);

module.exports = app;
