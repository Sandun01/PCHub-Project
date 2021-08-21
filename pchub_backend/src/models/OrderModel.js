import mongoose from "mongoose";

const orderSchema = mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User',
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            qyt:{
                type: Number,
                required: true,
            },
            image:{
                type: Number,
                required: false,
            },
            price:{
                type: Number,
                required: true,
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: product,
            },
        },
    ],

    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },

})

const Order = mongoose.model('Order', orderSchema);

export default Order;
