import express from 'express';

//const express = require('express');

//const { getPrivateRoute } = require('../controllers/private');
//const { protect } = require('../middleware/auth');

import getPrivateData from '../controllers/privateController.js';
import protectUser from '../middleware/AuthMiddleware.js';

const privateRoutes = express.Router();

privateRoutes.route('/').get(protectUser, getPrivateData);

export default privateRoutes;