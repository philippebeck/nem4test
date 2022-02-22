"use strict";

const express = require("express");
const router  = express.Router();

const BaseCtrl = require("../controller/BaseCtrl");

router.get("/", BaseCtrl.list);
router.post("/", BaseCtrl.create);
router.get("/:id", BaseCtrl.read);
router.put("/:id", BaseCtrl.update);
router.delete("/:id", BaseCtrl.delete);

module.exports = router;
