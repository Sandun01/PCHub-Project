import Order from "../models/OrderModel.js"

// @desc  Create Order
// @route POST /api/orders/
// @access User 
const createOrder = async(req, res) => {
    
    if(req.body){
        const order = new Order(req.body);

        await order.save()
            .then(data => {
                res.status(201).send({ success: true, 'message': 'Order Placed Successfully!'})
            })
            .catch(error => {
                console.log(error)
                res.status(500).send({ success: false, 'message': 'Error'})
            })
    }
    else{
        res.status(200).send({ success: false, 'message': "No Data Found" })
    }

}

// @desc get all orders
// @route GET /api/orders/
// @access Admin 
const getAllOrders = async(req, res) => {
    
    // {
    //     path: "orderItems", 
    //     populate: {
    //         path: "product"
    //     }
    // }

    await Order.find({}).populate('user')
        .then(data => {
            res.status(200).send({ success: true, 'data': data })
        })
        .catch(error => {
            console.log(error)
            res.status(500).send({ success: false, 'message': 'Error'})
        })
}

export default{
    createOrder,
    getAllOrders,
}
