"use strict";

const express = require("express");
const router  = express.Router();

const jwt     = require("../middleware/jwt");
const multer  = require("../middleware/multer");

const MainCtrl = require("../controller/MainCtrl");

router.get("/", jwt, MainCtrl.list);
router.post("/", jwt, multer, MainCtrl.create);
router.get("/:id", jwt, MainCtrl.read);
router.put("/:id", jwt, multer, MainCtrl.update);
router.delete("/:id", jwt, MainCtrl.delete);

module.exports = router;
