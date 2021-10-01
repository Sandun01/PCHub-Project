import pdf from 'html-pdf';
import finalBillTemplate from '../utils/orderReports/FinalOrderBill_Temp/FinalOrderBill.js';
import Quotation_Template from '../utils/orderReports/Quotation/QuatationTemplate.js';
import OrderReport_Template from '../utils/orderReports/AdminOrderReport/AdminOrderReport.js';
import path from 'path';

import Order from "../models/OrderModel.js";
import Product from "../models/ProductModel.js";
import UtilFunctions from "../utils/UtilFunctions.js";

//get item details
async function checkItemQuantity(itemId, qty){

    const query = { 
        "_id": itemId
    };

    const data = await Product.findById(query);
    const stock = data.countInStock;

    if(stock >= qty){
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

// check item quantities in order
async function checkOrderItemQuantities(id, itemsArr){

    var allInStock = 1;
    
    try
    {
        var orderID = id;
        var lenItems = itemsArr.length;

        // check item by item
        for(var i = 0; i < lenItems; i++){
            // console.log(itemsArr[i])
            
            // get item qty from Product Table
            var pID = itemsArr[i].product._id;
            var findProductQuery = { "_id": pID  }
            var qtyData = await Product.findById(findProductQuery, { countInStock:1, _id:0 });
            // console.log(qtyData)
            
            var isQtyDataEmpty = UtilFunctions.isEmpty(qtyData);
            
            if(isQtyDataEmpty == false){
                
                var cartQty = itemsArr[i].qty;
                var qtyDB = qtyData.countInStock;
                // console.log(cartQty, qtyDB)
                
                if(cartQty > qtyDB){ //if quantity in cart exceeded the count in stock
                    allInStock = 0;
                    
                    //order item db id
                    var orderItemDbId = itemsArr[i]._id;
                    
                    // update record
                    const queryOrderID = { "_id": orderID , "orderItems._id": orderItemDbId };
                    const queryUpdateQty = {
                        $set: { "orderItems.$.inStock": false, }
                    };
                    
                    //update order inStock status
                    var updateRes = await Order.updateOne( queryOrderID, queryUpdateQty );

                    // console.log(orderItemDbId, orderID, updateRes);

                }

            }
            else{
                console.log("Product data is empty")
                allInStock = -1;
                return allInStock;
            }
            
        }

        return allInStock;

    }
    catch(error){
        console.log(error)
        allInStock = -1;
        return allInStock;
    }

};

//update Order Item stock
async function updateOrderItemsInProductStock(itemsArr){

    var updateStockCode = 1;
    
    try
    {
        var lenItems = itemsArr.length;

        // check item by item
        for(var i = 0; i < lenItems; i++){
            
            var pID = itemsArr[i].product._id;
            // var pID = itemsArr[i].product;
            var findProductQuery = { "_id": pID  };
            // console.log(pID)

            //get item quantity
            var qty = itemsArr[i].qty;

            var queryUpdateQty = {
                $inc: { countInStock: -qty }
            };

            // update quantity in db
            var qtyData = await Product.updateOne(findProductQuery, queryUpdateQty);
            // console.log(qtyData)
            updateStockCode = 1;
            
        }

    }
    catch(error){
        console.log(error)
        updateStockCode = -1;
    }

    return updateStockCode;

}


//debugging check function
const checkFunction = async(req, res) => {

    // var arr = req.body.items;

    // var result = updateOrderItemsInProductStock(arr)

    // res.status(200).send({ 'data':result  })

};

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
    // console.log(id);
        
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
            $set: { "orderItems.$.qty": qty, "orderItems.$.inStock": true, }
        };
    
        await Order.updateOne( queryOrderID, queryUpdateQty )
        .then( response => {
            // console.log(response)
            res.status(200).send({ success: true, 'count': response.nModified, 'message': 'Success' })
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ success: false, 'message': 'Error'})
        })
    }
    else{
        res.status(200).send({ success: true, 'message': 'Exceeded' })
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

//update online payment details(Finalize order)
// @route put /api/orders/payment/:id
// @access User(Registered) 
const updatePaymentDetails = async(req, res) => {

    var isDataEmpty = UtilFunctions.isEmpty(req.body);
    
    if(!isDataEmpty){

        var itemsArr = req.body.items;
        var ordID = req.params.id;
        
        //update item quantities ------------------------------------------------------------
        var haveOutOfStockItems = await checkOrderItemQuantities(ordID, itemsArr);

        if(haveOutOfStockItems == 0){
            res.status(200).send({ success: true, 'message': 'OutOfStock' })
        }
        else if(haveOutOfStockItems == -1){
            res.status(200).send({ success: false, 'message': 'Error in checking ordered items', })
        }
        else{

            var data = req.body;
            var paidStatus = data.isPaid;
            var paypalDetails = data.detailsByPaypal;
            var orderData = data.orderData;
            
            var find = { "_id": ordID };
            var query = {
                $set: { 
                    "isActive": false,
                    "isPaid": paidStatus,
                    "detailsByPaypal": paypalDetails,
                    "deliveryDetails": orderData,
                } 
            };
            
            //update item quantity----------------------------
            var qtyUpdated = await updateOrderItemsInProductStock(itemsArr);

            if(qtyUpdated == -1){
                res.status(200).send({ success: false, 'message': 'Error in updating product quantities', })
            }

            await Order.update(find, query)
            .then(response => {
                // console.log(response);
                console.log('Payment Details Updated Success');
                res.status(200).send({ success: true, 'count': response.nModified, 'message': 'Success', })
            })
            .catch(error => {
                console.log(error);
                res.status(400).send({ success: false, 'message': 'Error', })
            })
            
        }

    }
    else{
        res.status(200).send({ success: false, 'message': 'Not Found', }); //data not found
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

//Generate final order bill
// @route post /api/orders/generateFinalBill
// @access User(Registered) 
const generateFinalOrderBill = async(req, res) => {

    // console.log("generate Final Order Bill");
    
    const __dirname = path.resolve()
    
    const data = req.body;
    // console.log(data);
    
    //generate bill
    pdf.create(finalBillTemplate(data), {}).toFile(`${__dirname}/files/OrderBill.pdf`, (err) => {
        if(err) {
            res.send(Promise.reject());
        }
        
        res.send(Promise.resolve());
    });
    
}

//get final order bill
// @route get /api/orders/fetchFinalBill
// @access User(Registered) 
const getFinalOrderBill = async(req, res) => {

    console.log("get Final Order Bill");

    const __dirname = path.resolve()

    res.sendFile(`${__dirname}/files/OrderBill.pdf`)
}


//Generate Quotation
// @route post /api/orders/generateQuotation
// @access User(Registered) 
const generateQuotation = async(req, res) => {

    // console.log("generate Final Order Bill");
    
    const __dirname = path.resolve()
    
    const data = req.body;
    // console.log(data);
    
    //generate bill
    pdf.create(Quotation_Template(data), {}).toFile(`${__dirname}/files/Quotation.pdf`, (err) => {
        if(err) {
            res.send(Promise.reject());
        }
        
        res.send(Promise.resolve());
    });
    
}

//get Quotation
// @route get /api/orders/getQuotation
// @access User(Registered) 
const getPrintedQuotation = async(req, res) => {

    console.log("get Quotation");

    const __dirname = path.resolve()

    res.sendFile(`${__dirname}/files/Quotation.pdf`)
}

//update delivery status
// @route PUT /api/orders/delivery/edit/:id
// @access User(Registered) 
const updateDeliveryDetails = async(req, res) => {

    var isDataEmpty = UtilFunctions.isEmpty(req.body);

    if(!isDataEmpty){

        var data = req.body;
        var deliveryStatus = data.deliveryStatus;
        var paidStatus = data.paidStatus;

        var find = { "_id": req.params.id };
        var query = {
            $set: { 
               
                    "isDelivered": deliveryStatus,
                    "isPaid": paidStatus,
                
            } 
        };

        await Order.update(find, query)
        .then(response => {
            // console.log(response);
            console.log('Delivery Status  Updated Success');
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

//Generate order report
// @route post /api/orders/report
// @access User(Registered) 
const generateFinalOrderReport = async(req, res) => {
    
    const __dirname = path.resolve()
    const data = req.body;
    
    // console.log(data)

    //generate bill
    pdf.create(OrderReport_Template(data), {}).toFile(`${__dirname}/files/OrderReport.pdf`, (err) => {
        if(err) {
            res.send(Promise.reject());
        }
        
        res.send(Promise.resolve());
    });
    
}

//get order report
// @route get /api/orders/report
// @access User(Registered) 
const getFinalOrderReport = async(req, res) => {

    console.log("get Final Order Report");

    const __dirname = path.resolve()

    res.sendFile(`${__dirname}/files/OrderReport.pdf`)
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
    updateDeliveryDetails,

    checkFunction,

    // report quotation
    generateQuotation,
    getPrintedQuotation,

    // report bill
    generateFinalOrderBill,
    getFinalOrderBill,

    //order report
    generateFinalOrderReport,
    getFinalOrderReport,

}
