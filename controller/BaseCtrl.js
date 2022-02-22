"use strict";

const BaseModel = require("../model/BaseModel");

/**
 * @param {object} req 
 * @param {object} res 
 */
exports.list = async (req, res) => {
  try {
    const data = await BaseModel.find();
    res.json(data);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
};

/**
 * @param {object} req 
 * @param {object} res 
 */
exports.create = async (req, res) => {
  const data = new BaseModel({
    name: req.body.name,
    age: req.body.age
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  }
  catch(error) {
    res.status(400).json({message: error.message});
  }
};

/**
 * @param {object} req 
 * @param {object} res 
 */
exports.read = async (req, res) => {
  try {
    const data = await BaseModel.findById(req.params.id);
    res.json(data);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
};

/**
 * @param {object} req 
 * @param {object} res 
 */
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await BaseModel.findByIdAndUpdate(
      id, updatedData, options
      );

    res.send(result);
  }
  catch(error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @param {object} req 
 * @param {object} res 
 */
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await BaseModel.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  }
  catch(error) {
    res.status(400).json({ message: error.message });
  }
};
