import express from 'express';

import ProductController from '../controllers/ProductController.js';
const router = express.Router();
router.route('/create').post(ProductController.createProduct);
// router.route('/:id').get(wishlistController.getWishlistByUserId);

export default router;