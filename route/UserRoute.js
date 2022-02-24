"use strict";

const express = require("express");
const router  = express.Router();

const jwt     = require("../middleware/jwt");
const multer  = require("../middleware/multer");

const UserCtrl = require("../controller/UserCtrl");

router.post("/signup", UserCtrl.signup);
router.post("/login", UserCtrl.login);
router.get("/list", jwt, UserCtrl.list);
router.post("/create", jwt, multer, UserCtrl.create);
router.get("/read:id", jwt, UserCtrl.read);
router.put("/update:id", jwt, multer, UserCtrl.update);
router.delete("/delete:id", jwt, UserCtrl.delete);

module.exports = router;
