"use strict";

const bcrypt            = require("bcrypt");
const emailValidator    = require("email-validator"); 
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
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.signup = (req, res, next) => {
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
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.login = (req, res, next) => {
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
