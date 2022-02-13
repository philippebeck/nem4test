"use strict";

const fs = require("fs");

const MainModel = require("../model/MainModel");

/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.list = (req, res, next) => {
  MainModel
    .find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
};

/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.create = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id;

  const imgUrl  = `${req.protocol}://${req.get("host")}/img/${req.file.filename}`;
  const thing   = new MainModel({ ...thingObject, imageUrl: imgUrl });

  thing
    .save()
    .then(() => res.status(201).json({ message: "Successful Creation !" }))
    .catch(error => res.status(400).json({ error }));
};

/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.read = (req, res, next) => {
  MainModel
    .findOne({_id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.update = (req, res, next) => {
  const thingObject = req.file ?
    {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
    }
    : { ...req.body };
    
  MainModel
    .updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Successful Update !" }))
    .catch(error => res.status(400).json({ error }));
};

/**
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.delete = (req, res, next) => {
  MainModel
    .findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split("/img/")[1];

      fs.unlink(`img/${filename}`, () => {
        MainModel
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Successful Delete !" }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
