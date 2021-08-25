import mongoose from "mongoose";

const orderSchema = mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    isDelivered: {
        type: Boolean,
        required: false,
        default: false,
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true,
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            category: {
                type: String,
                required: true,
            },
            qty:{
                type: Number,
                required: true,
            },
            image:{
                type: String,
                required: false,
            },
            price:{
                type: Number,
                required: true,
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'products',
            },
        },
    ],

})

const Order = mongoose.model('Order', orderSchema);

export default Order;
