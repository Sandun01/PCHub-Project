import mongoose from 'mongoose';

const WishlistSchema = mongoose.Schema({
    userID: { type: String, required: true, trim: true },
    product: { type: mongoose.Schema.Types.ObjectId , requred: true,ref: 'Product'  }
})

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
export default Wishlist;