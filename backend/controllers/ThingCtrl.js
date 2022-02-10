"use strict";

const fs          = require("fs");
const ThingModel  = require("../models/ThingModel");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.listThing = (req, res, next) => {
  ThingModel
    .find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id;

  const imgUrl  = `${req.protocol}://${req.get("host")}/img/${req.file.filename}`;
  const thing   = new ThingModel({ ...thingObject, imageUrl: imgUrl });

  thing
    .save()
    .then(() => res.status(201).json({ message: "Post saved successfully!" }))
    .catch(error => res.status(400).json({ error }));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.readThing = (req, res, next) => {
  ThingModel
    .findOne({_id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({error}));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.updateThing = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
    }
    : { ...req.body };
    
  ThingModel
    .updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch(error => res.status(400).json({ error }));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteThing = (req, res, next) => {
  ThingModel
    .findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split("/img/")[1];

      fs.unlink(`img/${filename}`, () => {
        ThingModel
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
