"use strict";

const express = require("express");
const router  = express.Router();

const auth    = require("../middleware/auth");
const multer  = require("../middleware/multer");

const ThingCtrl = require("../controllers/ThingCtrl");

router.get("/", ThingCtrl.listThing);
router.post("/", multer, ThingCtrl.createThing);
router.get("/:id", ThingCtrl.readThing);
router.put("/:id", multer, ThingCtrl.updateThing);
router.delete("/:id", ThingCtrl.deleteThing);

module.exports = router;
