import express from 'express';
import ProductController from '../controllers/ProductController.js';

const router = express.Router()

// Home page - Sandun
router.route('/latest').get( ProductController.getLatestProducts )
router.route('/filter').post( ProductController.filterProducts )
router.route('/search').post( ProductController.searchProductByName )

router.route('/').post( ProductController.createProduct)
                 .get( ProductController.getAllProducts)

router.route('/:id').get( ProductController.getProductByID)
                    .put( ProductController.updateProductDetails)
                    .delete( ProductController.deleteProductDetails)

//reports
router.route('/fetchallproductsReport').get( ProductController.getAllProductsReport)
router.route('/generateallproductsReport').post( ProductController.generateAllProductsReport)

export default router;