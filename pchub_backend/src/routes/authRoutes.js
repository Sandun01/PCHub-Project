import express from 'express';

// Controllers
import userController from '../controllers/UserController.js';

// const express = require('express');
const auth = express.Router();

auth.route('/register').post(userController.register);

auth.route('/login').post(userController.login);

auth.route('/forgotpassword').post(userController.forgotPassword);

auth.route('/resetpassword/:resetToken').put(userController.resetPassword);

auth.route('/').get(userController.getAllusers);
auth.route('/:id').put(userController.updateUserData);

auth.route('/updateUserAddress/:id').put(userController.updateUserAddress);
auth.route('/delete/:id').delete(userController.deleteUser);

auth.route('/fetchUserData').get(userController.getUserDetails);
auth.route('/generateUserData').post(userController.generateUserDetails);

// module.exports = auth;
export default auth;
