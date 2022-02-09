"use strict";

const express = require("express");
const router  = express.Router();

const auth      = require("../middleware/auth");
const ThingCtrl = require("../controllers/ThingCtrl");

router.get("/", auth, ThingCtrl.listThing);
router.post("/", auth, ThingCtrl.createThing);
router.get("/:id", auth, ThingCtrl.readThing);
router.put("/:id", auth, ThingCtrl.updateThing);
router.delete("/:id", auth, ThingCtrl.deleteThing);

module.exports = router;
