import express from 'express';
import OrderController from '../controllers/OrderController.js';

const router = express.Router();

//reports
router.route('/fetchFinalBill').get(OrderController.getFinalOrderBill);
router.route('/generateFinalBill').post(OrderController.generateFinalOrderBill);

router.route('/generateQuotation').post(OrderController.generateQuotation);
router.route('/getQuotation').get(OrderController.getPrintedQuotation);

router.route('/').get(OrderController.getAllOrders);
router.route('/').post(OrderController.createNewOrder);
router.route('/:id').get(OrderController.getOrderByID);
router.route('/:id').delete(OrderController.deleteOrderByID);
router.route('/local').post(OrderController.addLocalItemsToTheCart);

router.route('/qty/edit/:id').put(OrderController.editQuantity);
router.route('/delivery/edit/:id').put(OrderController.editDeliveryStatus);
router.route('/payment/:id').put(OrderController.updatePaymentDetails);
router.route('/payment/method/:id').put(OrderController.changePaymentMethod);

router.route('/checkout/:id').post(OrderController.checkoutOrder);
router.route('/user/:id').post(OrderController.getOrdersByUserID);
router.route('/qty/user/:id').get(OrderController.getNoOfItemsInActiveOrder);
router.route('/addItem/user/:id').put(OrderController.addItemToTheOrder);
router.route('/removeItem/:id').put(OrderController.deleteItemInTheOrder);

router.route('/check').put(OrderController.checkFunction);

export default router;
