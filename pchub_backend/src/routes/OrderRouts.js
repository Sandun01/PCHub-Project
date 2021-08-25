import express from 'express';
import OrderController from '../controllers/OrderController.js';

const router = express.Router()

router.route('/').get( OrderController.getAllOrders )
router.route('/:id').get( OrderController.getOrderByID )

router.route('/qty/edit/:id').put( OrderController.editQuantity )
router.route('/delivery/edit/:id').put( OrderController.editDeliveryStatus )

router.route('/user/:id').get( OrderController.getOrdersByUserID )
router.route('/addItem/user/:id').put( OrderController.addItemToTheOrder )
router.route('/removeItem/:id').put( OrderController.deleteItemInTheOrder )

export default router;