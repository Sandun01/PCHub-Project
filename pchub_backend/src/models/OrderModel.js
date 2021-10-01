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
    isPaid: {
        type: Boolean,
        required: false,
        default: false,
    },
    detailsByPaypal:{
        type: String,
        required: false,
        default: null,
    },
    deliveryDetails:{
        
        paymentMethod:{
            type: String,
            required: false,
            default: null,
        },
        totalAmount:{
            type: Number,
            required: false,
            default: 0,
        },
        addressLine1:{
            type: String,
            required: false,
            default: null,
        },
        addressLine2:{
            type: String,
            required: false,
            default: null,
        },
        contactNumber:{
            type: String,
            required: false,
            default: null,
        },
        city:{
            type: String,
            required: false,
            default: null,
        },
        zipCode:{
            type: Number,
            required: false,
            default: 0,
        },

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
            inStock:{
                type: Boolean,
                default: true,
                required: false,
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
