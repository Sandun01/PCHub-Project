import express from 'express';

// Controllers
import userController from '../controllers/UserController.js';

// const express = require('express');
const auth = express.Router();

auth.route('/register').post(userController.register);

auth.route('/login').post(userController.login);

auth.route('/forgotpassword').post(userController.forgotPassword);

auth.route('/resetpassword/:resetToken').put(userController.resetPassword);

// module.exports = auth;
export default auth;
