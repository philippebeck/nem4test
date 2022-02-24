"use strict";

const express = require("express");
const router  = express.Router();

const UserCtrl = require("../controller/UserCtrl");

router.post("/signup", UserCtrl.signup);
router.post("/login", UserCtrl.login);
router.get("/list", UserCtrl.list);
router.post("/create", UserCtrl.create);
router.get("/read:id", UserCtrl.read);
router.put("/update:id", UserCtrl.update);
router.delete("/delete:id", UserCtrl.delete);

module.exports = router;
