import express from 'express';

import wishlistController from '../controllers/WishlistController.js';
const router = express.Router();
router.route('/create').post(wishlistController.createWishlist);
router.route('/:id').get(wishlistController.getWishlistByUserId);
router.route('/delete/:id').delete(wishlistController.deleteWishlistItem);

export default router;