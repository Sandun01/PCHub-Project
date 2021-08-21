import express from 'express';
import ProductController from '../controllers/ProductController.js';

const router = express.Router()



router.route('/').post( ProductController.createProduct)
                 .get( ProductController.getAllProducts)

router.route('/:id').get( ProductController.getProductByID)
                    .put( ProductController.updateProductDetails)
                    .delete( ProductController.deleteProductDetails)


export default router;