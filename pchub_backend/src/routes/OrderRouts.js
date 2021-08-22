import express from 'express';
import OrderController from '../controllers/OrderController.js';

const router = express.Router()

router.route('/').post( OrderController.createOrder )
router.route('/').get( OrderController.getAllOrders )


export default router;