"use strict";

const bcrypt            = require("bcrypt");
const emailValidator    = require("email-validator"); 
const fs                = require("fs");
const jwt               = require("jsonwebtoken");
const passwordValidator = require("password-validator");

const UserModel = require("../model/UserModel");

require("dotenv").config();

const schema = new passwordValidator();

schema
  .is().min(process.env.PASSWORD_MIN)
  .is().max(process.env.PASSWORD_MAX)
  .has().uppercase()
  .has().lowercase()
  .has().digits(process.env.PASSWORD_DIGITS)
  .has().not().spaces();

/**
 * SIGNUP USER
 * @param {object} req 
 * @param {object} res 
 */
exports.signup = (req, res) => {

  if (!emailValidator.validate(req.body.email)) {
    return res.status(401).json({ message: "Please enter a valid email address" });
  }

  if (!schema.validate(req.body.password)) {
    return res.status(401).json({ message: "Invalid password !" });
  };

  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      const user = new UserModel({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(() => res.status(201).json({ message: "User Created !" }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ user }));
};

/**
 * LOGIN USER
 * @param {object} req 
 * @param {object} res 
 */
exports.login = (req, res) => {
  UserModel
    .findOne({ email: req.body.email })
    .then(user => {

      if (!user) {
        return res.status(401).json({ error: "User Not Found !" });
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then(valid => {

          if (!valid) {
            return res.status(401).json({ error: "Incorrect Password !" });
          }

          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT,
              { expiresIn: "24h" }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

/**
 * LIST USERS
 * @param {object} req 
 * @param {object} res 
 */
 exports.list = (req, res) => {
  UserModel
    .find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({ error }));
};

/**
 * CREATE USER
 * @param {object} req 
 * @param {object} res 
 */
exports.create = (req, res) => {
  const userObject = JSON.parse(req.body.user);
  delete userObject._id;

  const imgUrl = `${req.protocol}://${req.get("host")}/${process.env.IMG}/${req.file.filename}`;
  const user = new UserModel({ ...userObject, image: imgUrl });

  user
    .save()
    .then(() => res.status(201).json({ message: "Successful Creation !" }))
    .catch(error => res.status(400).json({ error }));
};

/**
 * READ USER
 * @param {object} req 
 * @param {object} res 
 */
exports.read = (req, res) => {
  UserModel
    .findOne({_id: req.params.id })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
};

/**
 * UPDATE USER
 * @param {object} req 
 * @param {object} res 
 */
exports.update = (req, res) => {
  const userObject = req.file ?
    {
      ...JSON.parse(req.body.user),
      image: `${req.protocol}://${req.get("host")}/${process.env.IMG}/${req.file.filename}`
    }
    : { ...req.body };
    
  UserModel
    .updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Successful Update !" }))
    .catch(error => res.status(400).json({ error }));
};

/**
 * DELETE USER
 * @param {object} req 
 * @param {object} res 
 */
exports.delete = (req, res) => {
  UserModel
    .findOne({ _id: req.params.id })
    .then(user => {
      const filename = user.image.split(`/${process.env.IMG}/`)[1];

      fs.unlink(`${process.env.IMG}/${filename}`, () => {
        UserModel
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Successful Delete !" }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
