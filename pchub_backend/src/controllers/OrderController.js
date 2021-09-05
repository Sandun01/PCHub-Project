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

    const data = await Order.find(query)
    .limit(1)
    .populate( {
        path: "orderItems", 
        populate: {
            path: "product"
        }
    })
    
    //check data is not found
    const noData = UtilFunctions.isEmpty(data);

    if(!noData){
        // const id = data[0]._id;
        var orderData = data[0];
        return orderData;
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

//Check Order Items
async function checkItemAlreadyInCart(itemID, orderId){

    var orderData = await Order.findById({"_id": orderId});
    var products = orderData.orderItems;
    var haveProduct = false;
    // console.log("products -",products);
    
    //check item exists in list
    products.forEach(item => {
        if(item.product == itemID){
            haveProduct = true;
        }
    })

    return haveProduct;

}

// @desc Add local items to the Order when user login to the system
// @route POST /api/orders/local
// @access Registered User 
const addLocalItemsToTheCart = async(req, res) => {

    var isDataEmpty = UtilFunctions.isEmpty(req.body);

    if(!isDataEmpty){
        
        var userID = req.body.userID;
        var items = req.body.orderItems;

        //check user has already ordered
        var actOrderData = await getActiveOrder(userID);
        var isEmptyActOrderData = UtilFunctions.isEmpty(actOrderData); //check object is null
        // console.log(actOrderData, isEmptyActOrderData, items, userID)

        //add items to existing order
        if(isEmptyActOrderData == false){
            var ordID = actOrderData._id;
            
            var findQuery = { "_id": ordID };
            
            var newItmsArr = [];
            
            for(var i = 0; i < items.length; i++){
                
                //check item already in the cart
                var itemExists = await checkItemAlreadyInCart(items[i].product, ordID); 
                // console.log('=========',items[i].product, itemExists)
                
                if(itemExists == false){ //add new item to cart
                    newItmsArr.push(items[i]);
                }
            }
            
            var updateQuery = { $push: { "orderItems": newItmsArr } };

            Order.updateOne(findQuery, updateQuery)
            .then(response => {
                // console.log(res);
                console.log('Added new item to order.');
            })
            .catch(error => {
                console.log(error)
            })
               
            res.status(200).send({ success: true, 'message': 'Order Updated Successfully!' })

        }
        //create new order
        else{

            const orderData = {
                "user": userID,
                "isDelivered": false,
                "orderItems": items,
            }

            var resNewOrder = await createOrder(orderData);

            if(resNewOrder === true){
                res.status(201).send({ success: true, 'message': 'Order Created Successfully!' })
            }
            else{
                res.status(200).send({ success: false, 'message': 'Error'})
            }

        }

    }
    else{
        res.status(200).send({ success: false, 'message': 'Not Found'}) //data not found
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
                res.status(200).send({ success: true, 'order': data })
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

    //get active order id----------------------------------------------------------------
    var actOrderData = await getActiveOrder(userID);
    // console.log(actOrderData, data, userID);

    var isEmptyActOrderData = UtilFunctions.isEmpty(actOrderData); //check object is null
    var activeOrderID = null;

    if(isEmptyActOrderData == false){
        activeOrderID = actOrderData._id;
    }

    //create new order
    if(activeOrderID == null){

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

        //check item already in the active order --------------------------------------------------------
        var itemID = req.body.product;
        var checkItem = await checkItemAlreadyInCart(itemID, activeOrderID); //check item already in the order
        // console.log('a',checkItem)

        if(checkItem){//item already exist in the cart(ordered items list)
            console.log('item already existing in the active order...');
            
            res.status(200).send({ success: true, 'message': 'Already_Exists' });

        }
        else{ //item not exist in the cart(ordered items list)
            console.log('added to existing active order...');
            
            const findQuery = { "_id": activeOrderID };
            const updateQuery = { $push: { "orderItems": data } };
    
            const haveEmptyData = UtilFunctions.isEmpty(data);
    
            if(activeOrderID !== null && haveEmptyData === false){
                await Order.updateOne(findQuery, updateQuery)
                .then(response => {
                    // console.log(res);
                    res.status(200).send(
                        { 
                            success: true, 
                            'count': response.nModified, 
                            'message': 'Item added successfully!',
                        });
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
        var actOrderData = await getActiveOrder(uId);
        var isEmptyActOrderData = UtilFunctions.isEmpty(actOrderData);
        
        // console.log(isEmptyActOrderData);

        if(isEmptyActOrderData){
            // const orderID = actOrderData._id;
            res.status(200).send({ success: true, 'count': qty }); //no active orders
        }
        else{
            // var order = await Order.findById({"_id": orderID});
            var order = actOrderData;
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

// @desc checkout order
// @route post /api/orders/checkout/:id
// @access User(Registered) 
const checkoutOrder = async(req, res) => {

    var isDataEmpty = UtilFunctions.isEmpty(req.body);

    if(!isDataEmpty){

        var data = req.body;
        var paidStatus = data.isPaid;
        var paypalDetails = data.detailsByPaypal;
        var delDetails = data.orderData;

        // console.log(req.body);

        var find = { "_id": req.params.id };
        var query = {
            $set: { 
                // "isActive": false,
                "isPaid": paidStatus,
                "detailsByPaypal": paypalDetails,
                "deliveryDetails": {
                    "paymentMethod": delDetails.paymentMethod,
                    "totalAmount": delDetails.totalAmount,
                    "addressLine1": delDetails.addressLine1,
                    "addressLine2": delDetails.addressLine2,
                    "contactNumber": delDetails.contactNumber,
                    "city": delDetails.city,
                    "zipCode": delDetails.zipCode,
                },
            } 
        };
        
        await Order.update(find, query)
        .then(response => {
            // console.log(response);
            console.log('Order Placed Success');
            res.status(200).send({ success: true, 'count': response.nModified })
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ success: false, 'message': 'Error'})
        })

    }
    else{
        res.status(200).send({ success: false, 'message': 'Not Found'}); //data not found
    }
    
}


//update online payment method
// @route put /api/orders/payment/method/:id
// @access User(Registered) 
const changePaymentMethod = async(req, res) => {

    var isDataEmpty = UtilFunctions.isEmpty(req.body);

    if(!isDataEmpty){

        var data = req.body;
        var method = data.method;

        var find = { "_id": req.params.id };
        var query = {
            $set: { 
                "deliveryDetails": {
                    "paymentMethod": method,
                }
            } 
        };
        
        await Order.update(find, query)
        .then(response => {
            // console.log(response);
            console.log('Payment Method Updated Success');
            res.status(200).send({ success: true, 'count': response.nModified })
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ success: false, 'message': 'Error'})
        })

    }
    else{
        res.status(200).send({ success: false, 'message': 'Not Found'}); //data not found
    }
    
}

//update online payment details
// @route put /api/orders/payment/:id
// @access User(Registered) 
const updatePaymentDetails = async(req, res) => {

    var isDataEmpty = UtilFunctions.isEmpty(req.body);

    //update item quantities ------------------------------------------------------------
    
    if(!isDataEmpty){

        var data = req.body;
        var paidStatus = data.isPaid;
        var paypalDetails = data.detailsByPaypal;
        var orderData = data.orderData;

        var find = { "_id": req.params.id };
        var query = {
            $set: { 
                "isActive": false,
                "isPaid": paidStatus,
                "detailsByPaypal": paypalDetails,
                "deliveryDetails": orderData,
            } 
        };
        
        await Order.update(find, query)
        .then(response => {
            // console.log(response);
            console.log('Payment Details Updated Success');
            res.status(200).send({ success: true, 'count': response.nModified })
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ success: false, 'message': 'Error'})
        })

    }
    else{
        res.status(200).send({ success: false, 'message': 'Not Found'}); //data not found
    }
    
}

//delete order by id
// @route put /api/orders/:id
// @access User(Registered) 
const deleteOrderByID = async(req, res) => {

    const orderID = req.params.id;
    const searchQuery = { _id: orderID }; //for both search and delete

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
    addLocalItemsToTheCart,
    checkoutOrder,
    changePaymentMethod,
    updatePaymentDetails,
    deleteOrderByID,
}
