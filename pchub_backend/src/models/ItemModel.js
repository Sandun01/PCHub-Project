import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide username'],
  },
});

const Item = mongoose.model('Item', ItemSchema);

export default Item;