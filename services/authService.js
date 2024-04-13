import bcrypt from "bcrypt";
import { secret } from "../config.js";
import logger from "./logger.js";

import jwt from "jsonwebtoken";

const saltRounds = 10;

// var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const comparePassword = (plaintextPassword, hashedPassword) => {
  return bcrypt.compare(plaintextPassword, hashedPassword);
};

const hashPassword = (password) => {
  return bcrypt.hash(password, saltRounds);
};

const getToken = (userId, userEmail) => {
  if (!userId || !userEmail) {
    throw new Error(
      `GetToken: missing userId: ${userId}, or userEmail: ${userEmail}`
    );
  }

  var payload = {
    userId: userId,
    email: userEmail,
  };
  var token = jwt.sign(payload, secret, {
    expiresIn: "30d",
  });

  return token;
};

const verify = (token, callbackFn) => {
  jwt.verify(token, secret, callbackFn);
};

export default { comparePassword, hashPassword, getToken, verify };
