import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
  item_name: {
    type: String,
    required: true,
  },
  item_image: {
    type: String,
    required: false,
  },
  item_description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: false,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
})

const Product = mongoose.model('products', productSchema)
export default Product
