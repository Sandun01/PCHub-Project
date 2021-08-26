import Order from "../models/OrderModel.js"
import Product from "../models/ProductModel.js"
import UtilFunctions from "../utils/UtilFunctions.js";

//get item details
async function checkItemQuantity(itemId, qty){

    const query = { 
        "_id": itemId
    };

    const data = await Product.findById(query);
    const stock = data.countInStock;

    if(stock > qty){
        return true;
    }
    else{
        return false; //out of stock
    }
    
};

//check active order for User
async function getActiveOrder(userID){

    const query = { 
        "user": userID,
        "isActive": true,
    };

    const data = await Order.find(query).limit(1);
    //check data is not found
    const noData = UtilFunctions.isEmpty(data);

    if(!noData){
        const id = data[0]._id;
        return id;
    }
    else{
        return null; //data not found
    }
    
};


//Create Order
async function createOrder(data){

    let emptyData = UtilFunctions.isEmpty(data);

    if(!emptyData){
        try
        {
            const order = new Order(data);
            await order.save();
            return true;
        }
        catch(error)
        {
            console.log(error);
            return false;
        }

    }
    else{
        return null; //data not found
    }

}

// @desc Create New Order
// @route POST /api/orders/
// @access Registered User 
const createNewOrder = async(req, res) => {

    const order = new Order(req.body);
    await order.save()
    .then(data => {
        res.status(201).send({ success: true, 'data': data })
    })
    .catch(error => {
        console.log(error)
        res.status(400).send({ success: false, 'message': 'Error'})
    })
    
}


// @desc get all orders
// @route GET /api/orders/
// @access Admin 
const getAllOrders = async(req, res) => {
    
    const query = { "isActive": false };

    await Order.find(query).populate('user')
        .then(data => {
            res.status(200).send({ success: true, 'data': data })
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ success: false, 'message': 'Error'})
        })
}


// @desc get order by order id
// @route GET /api/orders/:id
// @access User(Registered) 
const getOrderByID = async(req, res) => {

    const id = req.params.id;
    console.log(id);
        
    if(id){
        await Order.findById(id)
            .populate('user')
            .populate( {
                path: "orderItems", 
                populate: {
                    path: "product"
                }
            })
            .then(data => {
                res.status(200).send({ success: true, 'data': data })
            })
            .catch(error => {
                console.log(error)
                res.status(400).send({ success: false, 'message': 'Error'})
            })
    }
    else{
        res.status(200).send({ success: false, 'message': 'Not Found'}) //data not found
    }

}


// @desc edit quantity by id
// @route POST /api/orders/qty/edit/:id
// @access User(Registered) 
const editQuantity = async(req, res) => {

    const orderId = req.params.id;
    const qty = req.body.qty;
    const orderItemDbId = req.body.orderItemDbID;
    const itemID = req.body.itemID;
    // console.log(qty, orderItemDbId, orderId, itemID);

    //check item max quantity
    const checkQty = await checkItemQuantity(itemID, qty);
    // console.log(checkQty);

    if(checkQty){
        const queryOrderID = { "_id": orderId , "orderItems._id": orderItemDbId };
        const queryUpdateQty = {
            $set: { "orderItems.$.qty": qty }
        };
    
        await Order.updateOne( queryOrderID, queryUpdateQty )
        .then( response => {
            // console.log(response)
            res.status(200).send({ success: true, 'count': response.nModified })
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ success: false, 'message': 'Error'})
        })
    }
    else{
        res.status(200).send({ success: true, 'message': 'Exceeded!' })
    }

}


// @desc edit delivery status by id
// @route PUT /api/orders/delivery/edit/:id
// @access User(Registered) 
const editDeliveryStatus = async(req, res) => {

    const id = req.params.id;
    const deliveryStatus = req.body.delivered;
    // console.log(id, deliveryStatus);e

    if(deliveryStatus != null && id != null){

        const queryID = { "_id": id };
        const queryUpdate = {
            $set: { "isDelivered": deliveryStatus }
        };

        await Order.updateOne( queryID, queryUpdate )
        .then( response => {
            console.log(response)
            res.status(200).send({ success: true, 'count': response.nModified })
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ success: false, 'message': 'Error'})
        })

    }
    else{
        res.status(200).send({ success: false, 'message': 'Not Found'}) //data not found
    }

}


// @desc get order by user id
// @route GET /api/orders/user/:id
// @access User(Registered) 
const getOrdersByUserID = async(req, res) => {

    const userId = req.params.id;
    let orderType = true;
    orderType = req.body.active;
    
    // console.log(orderType)

    let query = { user: userId };
    
    //check current order or previous order
    if(orderType == true){
        query = { user: userId, isActive: true };
    }
    else{
        query = { user: userId , isActive: false };
    }
    // console.log(id);
        
    if(userId){
        await Order.find(query)
            .populate('user')
            .populate( {
                path: "orderItems", 
                populate: {
                    path: "product"
                }
            })
            .then(data => {
                res.status(200).send({ success: true, 'orders': data })
            })
            .catch(error => {
                console.log(error)
                res.status(400).send({ success: false, 'message': 'Error'})
            })
    }
    else{
        res.status(200).send({ success: false, 'message': 'Not Found'}) //data not found
    }

}


// @desc add product item to order
// @route POST /api/orders/addItem/user/:id
// @access User(Registered) 
const addItemToTheOrder = async(req, res) => {

    const userID = req.params.id;
    const data = req.body;

    //check item already in the active order ----------------------------------------------------------------
    const activeOrderID = await getActiveOrder(userID);
    // console.log(activeOrderID, data, userID);
    
    //create new order
    if(activeOrderID === null){
        console.log('new creating order...');

        const orderData = {
            "user": userID,
            "isDelivered": false,
            "orderItems": [ data ]
        }

        const createResponse = await createOrder(orderData);
        console.log(createResponse);
        
        if(createResponse === true){
            console.log('Order Created');
            res.status(201).send({ success: true, 'message': 'Order Placed Successfully!'});
        }
        else if(createResponse === false){
            console.log('Error');
            res.status(400).send({ success: false, 'message': 'Error'});
        }
        else if(createResponse === null){
            console.log('Not Found'); //data not found
            res.status(200).send({ success: false, 'message': "No Data Found" });
        }

    }
    else{ //add items to existing order ----------------------------------------------------------------
        console.log('added to existing active order...');
        
        const findQuery = { "_id": activeOrderID };
        const updateQuery = { $push: { "orderItems": data } };

        const haveEmptyData = UtilFunctions.isEmpty(data);

        if(activeOrderID !== null && haveEmptyData === false){
            await Order.updateOne(findQuery, updateQuery)
            .then(response => {
                // console.log(res);
                res.status(200).send({ success: true, 'count': response.nModified });
            })
            .catch(error => {
                console.log(error);
                res.status(400).send({ success: false, 'message': 'Error'});
            })
        }
        else{
            res.status(200).send({ success: false, 'message': 'Not Found'}); //data not found
        }

    }

}


// @desc delete product item to order
// @route PUT /api/orders/removeItem/:id
// @access User(Registered) 
const deleteItemInTheOrder = async(req, res) => {

    const orderID = req.params.id;
    const orderItemId = req.body.orderItemId;
    
    // console.log(orderID, orderItemId);
    
    //check no of items in order
    const searchQuery = { _id: orderID }; //for both search and delete

    try{
        const orderDetails = await Order.findById(searchQuery);
        const len = orderDetails.orderItems.length;
        // console.log(len);
        
        if(len > 1){ //delete item order
    
            const findQuery = { "_id": orderID };
            const updateQuery = { $pull: { "orderItems": { "_id": orderItemId } } };
    
            if(orderID != null && orderItemId != null){
                
                await Order.updateOne(findQuery, updateQuery)
                .then(response => {
                    // console.log(response);
                    console.log('Item Deleted from order');
                    res.status(200).send({ success: true, 'count': response.nModified })
                })
                .catch(error => {
                    console.log(error);
                    res.status(400).send({ success: false, 'message': 'Error'})
                })
            }
            else{
                res.status(200).send({ success: false, 'message': 'Not Found'}) //data not found
            }
        }
        else{ //delete entire order
    
            await Order.deleteOne(searchQuery)
            .then(response => {
                // console.log(response);
                console.log('Order Deleted');
                res.status(200).send({ success: true, 'count': response.deletedCount })
            })
            .catch(error => {
                console.log(error);
                res.status(400).send({ success: false, 'message': 'Error'})
            });
    
        }
    }
    catch(error){
        console.log(error);
        res.status(400).send({ success: false, 'message': 'Error'})
    }
    

}


// @desc get user cart - no of items
// @route GET /api/orders/qty/user/:id
// @access User(Registered) 
const getNoOfItemsInActiveOrder = async(req, res) => {
    var qty = 0;
    var uId = req.params.id;

    try
    {
        var orderID = await getActiveOrder(uId);
    
        // console.log(orderID)
        if(orderID == null){
            res.status(200).send({ success: true, 'count': qty }); //no active orders
        }
        else{
            var order = await Order.findById({"_id": orderID});
            var items = order.orderItems;
            
            if(items != null){
                qty = items.length;
                res.status(200).send({ success: true, 'count': qty }) //items = 0
            }
            else{
                res.status(200).send({ success: true, 'count': qty }) //items = 0
            }
        }
    }
    catch(error){
        res.status(400).send({ success: false, 'message': 'Error' }) //error

    }
}

export default{
    createNewOrder,
    getAllOrders,
    getOrderByID,
    editQuantity,
    editDeliveryStatus,
    getOrdersByUserID,
    addItemToTheOrder,
    deleteItemInTheOrder,
    getNoOfItemsInActiveOrder,
}
