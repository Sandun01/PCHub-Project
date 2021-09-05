import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles';

import { 
    Grid, Typography, Card, Snackbar, Button, Switch,
    Dialog, DialogTitle, DialogActions, DialogContent,
} from '@material-ui/core'

import { Alert, } from '@material-ui/lab';
import { Link } from 'react-router-dom';

import { PayPalButton } from 'react-paypal-button-v2';
import { indigo, red } from '@material-ui/core/colors';

import { LeftNavBarData } from '../utils/LeftNavBarData';
import OrderServices from '../../services/OrderServices';
import AuthService from '../../services/AuthService';

import LoadingScreen from '../common/LoadingScreen';
import ProductNotFound from './products/ProductNotFound';

const PurpleSwitch = withStyles({

    switchBase: {
        color: red[700],
        '&$checked': {
            color: indigo[700],
        },
        '&$checked + $track': {
            backgroundColor: indigo[700],
        },

    },
    checked: {},
    track: {
        backgroundColor: red[700],
    },

})(Switch);

const styles = (theme) => ({
    
    root:{
        display: 'block',
        width: '100%',
        opacity: 1,
        animation: '$customFade 2s linear',
    },
    "@keyframes customFade":{
        "0%":{ 
            opacity: 0,
        },
        "100%":{ 
            opacity: 1,
        }
    },

    headerContainer:{
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    cardStyles:{
       backgroundColor: '#333333',
       color: '#fff',
       padding: 10,
       margin: 5,
    },
    itemName:{
       fontSize: '1rem',
    },
    priceText1:{
        textAlign: 'end',
        marginRight: 5,
        fontSize: '1.5rem',
    },
    priceText2:{
        color: '#9B9B9B',
        textAlign: 'end',
        marginRight: 5,
        fontSize: '1rem',
    },
    totalPriceText:{
        float: 'right',
        color: '#fff',
    },

    printBillBtn:{
        float: 'right',
        marginTop: 30,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#018F03',
        width: '250px',
        textAlign: 'center',
        // fontWeight: 'bold',
        '&:hover':{
            backgroundColor: '#007002',
            cursor: 'pointer',
        }
    },

    confirmBtn:{
        float: 'right',
        marginTop: 30,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#B90000',
        width: '250px',
        textAlign: 'center',
        // fontWeight: 'bold',
        '&:hover':{
            backgroundColor: '#A40000',
            cursor: 'pointer',
        }
    },

    onClickViewItemText:{
        textAlign: 'center',
        color: "#fff",
        textDecoration: 'none',
        '&:hover':{
            textDecoration: 'underline',
        }
    },
    paymentButtonContainer:{
        margin: 20,
        backgroundColor:'rgba(255, 255, 255, 0.8)', 
        color:'#000', 
        padding: 20,
        borderRadius: 10,
    },

})

//dialog box message
const dialogMessage = "Please note that there can be a delay of up-to 7 working days or slightly more due to delivery difficulties prevailing in these days.";

class ViewOrder extends Component {

    constructor(props){
        super(props);
        this.state = {

            //screen
            isSmallScreen: false,
            loading: true,

            //order data
            items: [],
            haveItems: false,
            orderID: null,

            //user data
            // userLoggedIn: false,
            // userID: null,

            totalAmount: 0,

            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: null,

            //dialog box
            dialogBox: false,
            dialogBox_severity: 'success',
            dialogBox_message1: null,
            dialogBox_message2: null,

            sdk_ready: false,

            //delivery details
            isPaid: false,
            isActive: false,
            isDelivered: false,
            detailsByPaypal: null,
            
            orderData:{
                paymentMethod: null,
                totalAmount: null,
                addressLine1: null,
                addressLine2: null,
                city: null,
                zipCode: null,
                contactNumber: null,
            },

        }

    }

    // set icon related to category
    setCategoryIcon = (items) =>{

        var newItems = [];
        var category = null;
        var tot = 0;
        
        items.forEach(itm => {
            //get item category
            category = itm.category;

            //check with icon data
            LeftNavBarData.forEach(item => {
                if(item.category === category){
                    var icon = item.iconPath;
                    itm.categoryIconSrc = icon;
                }
            })

            //add to new array
            newItems.push(itm);

            //calculate total price
            tot = tot + (itm.price * itm.qty);
            
        })

        this.state.orderData.totalAmount = tot;

        this.setState({
            items: newItems,
            totalAmount: tot,
        })
        // console.log(newItems);

    }

    //check user logged in
    // async checkUserLoggedIn(){
    //     var logIn = false;
    //     var uData = await AuthService.getUserData();
    //     var uInfo = null;
    //     var id = null;
        
    //     if(uData != null){
    //         uInfo = uData.userData;
    //         id = uInfo._id
    //         logIn = true;
    //     }
        
    //     this.setState({
    //         userLoggedIn: logIn,
    //         userID: id,
    //     })

    //     // console.log("User",this.state)
    // }

    //get cart items
    async getOrderDetails(){

        var itemsArr = [];
        var oID = this.props.match.params.id;

        var orderRes = await OrderServices.getOrderByID(oID);
        console.log(orderRes)

        try{

            if(orderRes.status == 200 && orderRes.data.order != null){
    
                var order = orderRes.data.order;
                itemsArr = order.orderItems;
                oID = order._id;
    
                this.setState({
                    items: itemsArr,
                    haveItems: true,
                    orderID: oID,
                    isPaid: order.isPaid,
                    isActive: order.isActive,
                    isDelivered: order.isDelivered,
                    detailsByPaypal: order.detailsByPaypal,
                    orderData: order.deliveryDetails,
                })
    
                // set icon related to category
                this.setCategoryIcon(itemsArr);
                // console.log("order items", orderRes);
    
            }
            else{
                console.log("error");
            }
        }
        catch(err){
            console.log(err);
        }

        this.setState({
            loading: false,
        })

    }

    //change payment method
    changePaymentMethod = async() => {

        // value: 'Cash On Delivery'
        // value: 'Credit Card /Paypal'

        var method = this.state.orderData.paymentMethod;

        if(method === 'Cash On Delivery'){
            method = 'Credit Card /Paypal';
        }
        else{
            method = 'Cash On Delivery';
        }

        var id = this.state.orderID;

        var data = {
            "method": method,
        }

        await OrderServices.changePaymentMethod(id, data)
        .then(res => {
            console.log(res);
            this.setState({
                snackbar: true,
                snackbar_severity: 'success',
                snackbar_message: 'Method Changed!',
            })
            
        })
        .catch(error => {
            console.log(error);
            this.setState({
                snackbar: true,
                snackbar_severity: 'error',
                snackbar_message: 'Error',
            })
        })
        
        setTimeout(() => {
            this.getOrderDetails();
        },800)

    }

    //close snackbar
    handleCloseSnackbar = () =>{
        this.setState({
            snackbar: false,
        })
    }

    //close dialog box
    handleCloseDialogBox = () =>{
        this.setState({
            dialogBox: false,
        })

        // this.getOrderDetails();
        window.location.reload(false);
    }

    //handle paypal payment
    handelPaypalPayment = async(details, data) =>{
        
        var ordData = {
            "create_time": details.create_time,
            "update_time": details.update_time,
            "id": details.id,
            "status": details.status,
            "payer": details.payer,
        }

        var paypalResult = JSON.stringify(ordData);
        var oID = this.state.orderID;
        
        var deliveryData = this.state.orderData;
        deliveryData['paymentMethod'] = 'Credit Card /Paypal';

        var data = {
            items: this.state.items,
            isPaid: true,
            paymentMethod: 'Credit Card /Paypal',
            detailsByPaypal: paypalResult,
            orderData: deliveryData,
        }

        await OrderServices.updatePaymentDetails(oID, data)
        .then(res => {

            console.log(res);
            
            if( res.status == 200 && res.data.message === "Success" ){
                this.setState({
                    dialogBox: true,
                    dialogBox_severity: 'success',
                    dialogBox_message1: 'Order Completed!',
                    dialogBox_message2: dialogMessage,
                })
            }
            else if( res.status == 200 && res.data.message === "OutOfStock" ){
                this.setState({
                    dialogBox: true,
                    dialogBox_severity: 'error',
                    dialogBox_message1: "Order Can't Complete!",
                    dialogBox_message2: "Some of the ordered items are out of stock! Please edit quantity/remove them"
                    +"from the cart and try again.",
                })
            }
            else{
                this.setState({
                    dialogBox: true,
                    dialogBox_severity: 'error',
                    dialogBox_message1: 'Error!',
                    dialogBox_message2: dialogMessage,
                })
            }

            // setTimeout(() => {
                // window.location.reload(false);
            // },1500)
            
        })
        .catch(error => {
            console.log(error);
            this.setState({
                dialogBox: true,
                dialogBox_severity: 'error',
                dialogBox_message1: 'Error',
            })
        })
        
        // console.log(details)

    }

    //confirm Order
    confirmOrder = async() =>{

        var deliveryData = this.state.orderData;
        var oID = this.state.orderID;

        var data = {
            items: this.state.items,
            isPaid: false,
            detailsByPaypal: null,
            orderData: deliveryData,
        }

        await OrderServices.updatePaymentDetails(oID, data)
        .then(res => {

            console.log(res);

            if( res.status == 200 && res.data.message === "Success" ){
                this.setState({
                    dialogBox: true,
                    dialogBox_severity: 'success',
                    dialogBox_message1: 'Order Completed!',
                    dialogBox_message2: dialogMessage,
                })
            }
            else if( res.status == 200 && res.data.message === "OutOfStock" ){
                this.setState({
                    dialogBox: true,
                    dialogBox_severity: 'error',
                    dialogBox_message1: "Order Can't Complete!",
                    dialogBox_message2: "Some of the ordered items are out of stock! Please edit quantity/remove them"
                    +"from the cart and try again.",
                })
            }
            else{
                this.setState({
                    dialogBox: true,
                    dialogBox_severity: 'error',
                    dialogBox_message1: 'Error!',
                    dialogBox_message2: dialogMessage,
                })
            }

            // setTimeout(() => {
                // window.location.reload(false);
            // },1500)
            
        })
        .catch(error => {
            console.log(error);
            this.setState({
                dialogBox: true,
                dialogBox_severity: 'error',
                dialogBox_message1: 'Error',
            })
        })

    }

    //delete order
    deleteOrder = async() => {

        var oID = this.state.orderID;

        await OrderServices.deleteOrderById(oID)
        .then(res => {

            console.log(res);
            this.setState({
                dialogBox: true,
                dialogBox_severity: 'success',
                dialogBox_message1: 'Order Deleted!',
            })
            
        })
        .catch(error => {
            console.log(error);
            this.setState({
                dialogBox: true,
                dialogBox_severity: 'error',
                dialogBox_message1: 'Error',
            })
        })

    }

    async componentDidMount(){

        //get cart items
        await this.getOrderDetails();

        // setup screen size
        if(window.innerWidth <= 750) {
            this.setState({
                isSmallScreen: true,
            });
        }

        //add paypal script
        var clientID = "AStqh5gAAH8AdV0bTZ1sddBWiubd9YAphRs6hjO1wsAddGyDGROkwJV5QnpyrQVFpEzi6-TLdO1k6dow";
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`;
        script.async = true;
        script.onload = () => {
            this.setState({
                sdk_ready: true,
            })
        }
        document.body.appendChild(script);

        //set window
        window.addEventListener("resize", () => {
          if (window.innerWidth <= 750) {
            this.setState({
                isSmallScreen: true,
            });
          } 
          else {
            this.setState({
                isSmallScreen: false,
            });
          }
        });
    }

    render() {
        const { classes } = this.props;

        return (

            <div className={classes.root}>

            {
                // loading icon
                this.state.loading ?
                <div>
                    <LoadingScreen />
                </div>
                :

                this.state.orderID == null && this.state.loading === false ?
                <ProductNotFound />

                :
                <Grid container justifyContent="center" alignItems="center" direction="row">
                   <Grid item xs={12} sm={12}>
                        <div className={classes.headerContainer}>
                            <Typography variant="h4">Order Bill</Typography>
                        </div>
                   </Grid>

                    {/* section 1 */}
                    {/* Items */}
                    <Grid item xs={10}>
                        <Typography variant="h6">
                            All Items
                        </Typography>
                    </Grid>
                    { 
                        this.state.haveItems && 
                        this.state.items.map((item, key) => (
                            
                            <Grid item xs={10} key={key} >

                                <Card className={classes.cardStyles}>
                                    <Grid container justifyContent="center" alignItems="center" direction="row">

                                        {/* Item Icon */}
                                        { this.state.isSmallScreen === false &&
                                            <Grid item xs={1} sm={1}>
                                                <img src={item.categoryIconSrc} width="30px" height="30px" />
                                            </Grid>
                                        }

                                        {/* Item name */}
                                        <Grid 
                                            item 
                                            xs={this.state.isSmallScreen ? 5 : 4} 
                                            sm={this.state.isSmallScreen ? 5 : 4} 
                                            className={classes.itemName}
                                        >
                                            <Link 
                                                className={classes.onClickViewItemText} 
                                                to={"/product/"+item.product._id}
                                            >
                                                { item.name }
                                            </Link>

                                        </Grid>

                                        {/* status */}
                                        <Grid 
                                            item 
                                            xs={this.state.isSmallScreen ? 2 : 1} 
                                            sm={this.state.isSmallScreen ? 2 : 1}
                                        >

                                            <Grid 
                                                container 
                                                justifyContent="center" 
                                                alignItems="center" 
                                                direction="row"
                                                >
                                                <div>
                                                    {
                                                        item.inStock ? 
                                                        <Typography 
                                                            variant="body2" 
                                                            style={{ 
                                                                backgroundColor: "#288C04",
                                                                padding:5, 
                                                                borderRadius: 10,
                                                             }}
                                                        >
                                                            In Stock
                                                        </Typography>
                                                        :
                                                        <Typography 
                                                            variant="body2"
                                                            style={{ 
                                                                backgroundColor: "#B32200",
                                                                padding:5,
                                                                borderRadius: 10,
                                                             }}
                                                        >
                                                            Out Of Stock
                                                        </Typography>
                                                    }
                                                </div>
                                            </Grid>

                                        </Grid>

                                        {/* Quantity */}
                                        <Grid 
                                            item 
                                            xs={this.state.isSmallScreen ? 5 : 3} 
                                            sm={this.state.isSmallScreen ? 5 : 3}
                                        >

                                            <Grid 
                                                container 
                                                justifyContent="center" 
                                                alignItems="center" 
                                                direction="row"
                                                >
                                                <div>
                                                    <Typography variant="body2">
                                                        {/* 13 */}
                                                        Quantity: { item.qty }
                                                    </Typography>
                                                </div>
                                            </Grid>

                                        </Grid>

                                        {/* Total */}
                                        { this.state.isSmallScreen === false &&
                                            <Grid item xs={2} sm={2}>
                                                <div className={classes.priceText1} >
                                                    {/* Rs.280000 */}
                                                    Rs.{ item.price * item.qty }
                                                </div>
                                                <div className={classes.priceText2}>
                                                    {/* Rs.280000 X 1 */}
                                                    Rs.{ item.price +" X "+ item.qty }
                                                </div>
                                            </Grid>
                                        }

                                    </Grid>
                                </Card>

                            </Grid>
                        ))

                    }

                    {/* section 2 */}
                    { 
                        this.state.haveItems && 
                        <>
                            {/* Section 2 Part 1 - total amount details */}
                            <Grid item xs={10}>
                                <div className={classes.totalPriceText}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', }}>
                                        Total Amount
                                    </Typography>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', }}>
                                        Rs.{this.state.totalAmount} /=
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={10}>
                                <div style={{ float: 'right', }}>
                                    Included all taxes and delivery cost* 
                                </div>
                            </Grid>

                            <Grid item xs={10}>

                                {/* Line 1 */}
                                <hr />

                                <Typography variant="h6">
                                    Delivery Details
                                </Typography>

                                <Typography variant="body2">
                                    Address: {   this.state.orderData.addressLine1  + " , " }
                                            {   this.state.orderData.addressLine2  + " , " }
                                            {   this.state.orderData.city  + "." }
                                </Typography>

                                <Typography variant="body2">
                                    Contact No: {   this.state.orderData.contactNumber  }
                                </Typography>

                                <Typography variant="body2">
                                    Zip Code: { this.state.orderData.zipCode  }
                                </Typography>

                                <Typography variant="body2" className="mt-3">
                                    Payment Method: { this.state.orderData.paymentMethod  }
                                </Typography>

                                {
                                    this.state.isActive &&
                                    <Typography variant="h6" className="mt-3">
                                        Change Payment Method: 

                                        <PurpleSwitch
                                            checked={this.state.orderData.paymentMethod === "Credit Card /Paypal"}
                                            onChange={this.changePaymentMethod}
                                            name="change Payment Method"
                                            // color="secondary"
                                        />
                                        { this.state.orderData.paymentMethod}
                                    </Typography>
                                }

                                {/* Line 2 */}
                                <hr />
                                <Typography variant="h6">
                                    Delivery Status
                                </Typography>
                                { 
                                    this.state.isDelivered ? 
                                    <Typography 
                                        variant="body2" 
                                        style={{ 
                                            margin: 5,
                                            textAlign: 'center',
                                            backgroundColor: '#117300', 
                                            padding: 10,
                                            borderRadius: 10,
                                            width: '150px',
                                        }}
                                    >
                                        Delivered
                                    </Typography>
                                    :
                                    <Typography 
                                        variant="body2" 
                                        style={{ 
                                            margin: 5,
                                            textAlign: 'center',
                                            backgroundColor: '#A10000', 
                                            padding: 10,
                                            borderRadius: 10,
                                            width: '150px',
                                        }}
                                    >
                                        Not Delivered
                                    </Typography>
                                }

                                {/* Line 3 */}
                                <hr />
                                <Typography variant="h6">
                                    Payment Status
                                </Typography>
                                { 
                                    this.state.isPaid ? 
                                    <Typography 
                                        variant="body2" 
                                        style={{ 
                                            margin: 5,
                                            textAlign: 'center',
                                            backgroundColor: '#117300', 
                                            padding: 10,
                                            borderRadius: 10,
                                            width: '100px',
                                        }}
                                    >
                                        Paid
                                    </Typography>
                                    :
                                    <Typography 
                                        variant="body2" 
                                        style={{ 
                                            margin: 5,
                                            textAlign: 'center',
                                            backgroundColor: '#A10000', 
                                            padding: 10,
                                            borderRadius: 10,
                                            width: '100px',
                                        }}
                                    >
                                        Not Paid
                                    </Typography>
                                }

                            </Grid>

                            {/* Section 2 Part 2 - Pay palButton */}
                            <Grid item xs={10}>

                                {/* Line 4 */}
                                <hr />
                                <Typography variant="h6">
                                    Order Status
                                </Typography>

                                { 
                                    this.state.isActive && 
                                    this.state.orderData.paymentMethod === "Credit Card /Paypal" ?

                                    <Typography 
                                        variant="body2" 
                                        style={{ 
                                            margin: 5,
                                            textAlign: 'center',
                                            backgroundColor: '#A10000', 
                                            padding: 10,
                                            borderRadius: 10,
                                            // width: '300px',
                                        }}
                                    >
                                        Pending...(Please make necessary payment to complete order)
                                    </Typography>

                                    :

                                    this.state.isActive && 
                                    this.state.orderData.paymentMethod === 'Cash On Delivery' ?

                                    <Typography 
                                        variant="body2" 
                                        style={{ 
                                            margin: 5,
                                            textAlign: 'center',
                                            backgroundColor: "#D39B00",
                                            color: "#B81E00",
                                            padding: 10,
                                            borderRadius: 10,
                                            fontWeight: 'bold',
                                            // width: '300px',
                                        }}
                                    >
                                        Pending...(Please Confirm The order)
                                    </Typography>

                                    :

                                    <Typography 
                                        variant="body2" 
                                        style={{ 
                                            margin: 5,
                                            textAlign: 'center',
                                            backgroundColor: '#117300', 
                                            padding: 10,
                                            borderRadius: 10,
                                            width: '100px',
                                        }}
                                    >
                                        Completed
                                    </Typography>
                                }

                                <Grid item xs={12} sm={12}>
                                {
                                    this.state.isPaid === false && 
                                    this.state.orderData.paymentMethod === "Credit Card /Paypal" &&
                                    
                                    // Paypal Button
                                    <Grid item xs={12} sm={6} className={classes.paymentButtonContainer}>
                                        <Typography variant="h5" className="p-2">
                                            Pay Now
                                        </Typography>
                                        {
                                            this.state.sdk_ready &&

                                            <PayPalButton
                                                amount={1}
                                                shippingPreference="NO_SHIPPING" 

                                                onSuccess={(d, v) => this.handelPaypalPayment(d, v)}

                                                onCancel={ () => {
                                                    console.log("Canceled"); //do nothing
                                                    this.setState({
                                                        snackbar: true,
                                                        snackbar_severity: 'warning',
                                                        snackbar_message: 'Transaction Canceled!',
                                                    })
                                                }}

                                                onError={ () => {
                                                    console.log("Error");
                                                    this.setState({
                                                        snackbar: true,
                                                        snackbar_severity: 'error',
                                                        snackbar_message: 'Error In Transaction! Please try again.',
                                                    })
                                                }}
                                                
                                            />
                                            
                                        }

                                    </Grid>
                                }
                                </Grid>

                                <Grid item xs={12}>
                                {
                                    this.state.isPaid === false && this.state.isActive &&
                                    this.state.orderData.paymentMethod === 'Cash On Delivery' &&
                                    <Button
                                        className="mt-5 m-2 float-end"
                                        style={{ backgroundColor: "#1b5e20", color: "#fff" }}
                                        variant="contained"
                                        onClick={this.confirmOrder}
                                    >
                                        Confirm Order
                                    </Button>
                                }
                                {
                                    this.state.isPaid === false && this.state.isActive &&
                                    <Button
                                        className="mt-5 m-2 float-end"
                                        style={{ backgroundColor: "#B90000", color: "#fff" }}
                                        variant="contained"
                                        onClick={this.deleteOrder}
                                    >
                                        Delete Order
                                    </Button>
                                }
                                </Grid>
                                
                            </Grid>

                            {
                                this.state.isActive === false&& 
                                <Grid item xs={10}>
                                    <div className={classes.printBillBtn} onClick={this.navigateToCartScreen}>
                                        Print Bill
                                    </div>
                                </Grid>
                            }

                        </>
                    }

                </Grid>
            }

            <Snackbar 
                open={this.state.snackbar} 
                autoHideDuration={2500} 
                onClose={this.handleCloseSnackbar}
            >
                <Alert onClose={this.handleCloseSnackbar} severity={this.state.snackbar_severity} >
                    {this.state.snackbar_message}
                </Alert>
            </Snackbar>

            
            <Dialog open={this.state.dialogBox == true ? true : false}>
                
                <DialogTitle>
                    <Typography variant="h5">
                        PCHub Order Final Bill Confirmation
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <Alert severity={this.state.dialogBox_severity}>
                        { this.state.dialogBox_message1 }
                    </Alert>

                    {
                        this.state.dialogBox_message2 != null &&
                        
                        <Alert severity="info">
                            { this.state.dialogBox_message2 }
                        </Alert>
                    }

                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={this.handleCloseDialogBox}
                    >
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>

            </div>
        )
    }
}

export default withStyles(styles)(ViewOrder);
