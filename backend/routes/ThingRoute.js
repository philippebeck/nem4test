"use strict";

const express = require('express');
const router = express.Router();

const ThingCtrl = require('../controllers/ThingCtrl');

router.get('/', ThingCtrl.listThing);
router.post('/', ThingCtrl.createThing);
router.get('/:id', ThingCtrl.readThing);
router.put('/:id', ThingCtrl.updateThing);
router.delete('/:id', ThingCtrl.deleteThing);

module.exports = router;
