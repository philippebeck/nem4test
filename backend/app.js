"use strict";

const express     = require("express");
const app         = express();
const mongoose    = require("mongoose");
const thingRoute  = require("./routes/ThingRoute");
const userRoute   = require("./routes/UserRoute")

require("dotenv").config();

mongoose.connect(process.env.DB_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

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

app.use("/api/stuff", thingRoute);
app.use("/api/auth", userRoute);

module.exports = app;
