import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';

import { 
    Grid, Typography, Card, Snackbar, Button,
} from '@material-ui/core'

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

import { Alert, AlertTitle, Autocomplete, } from '@material-ui/lab';
import { Link } from 'react-router-dom';

import { LeftNavBarData } from '../utils/LeftNavBarData';
import OrderServices from '../../services/OrderServices';
import AuthService from '../../services/AuthService';

import LoadingScreen from '../common/LoadingScreen';
import ProductNotFound from './products/ProductNotFound';

const paymentMethods = [
    {
        key: 1,
        value: 'Cash On Delivery'
    },
    {
        key: 2,
        value: 'Credit Card /Paypal'
    },

]

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
    confirmBtn:{
        float: 'right',
        marginTop: 30,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#A81100',
        width: '250px',
        textAlign: 'center',
        // fontWeight: 'bold',
        '&:hover':{
            backgroundColor: '#860F01',
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
    formContainer:{
        marginTop: 20,
        backgroundColor:'rgba(255, 255, 255, 0.8)', 
        color:'#000', 
        padding: 20,
        borderRadius: 10,
    },

})
class CheckoutScreen extends Component {

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
            userLoggedIn: false,
            userID: null,

            totalAmount: 0,

            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: null,

            //delivery details
            isPaid: false,
            detailsByPaypal: null,
            
            orderData:{
                paymentMethod: null,
                totalAmount: null,
                addressLine1: null,
                addressLine2: null,
                contactNumber: null,
                city: null,
                zipCode: null,
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
    async checkUserLoggedIn(){
        var logIn = false;
        var uData = await AuthService.getUserData();
        var uInfo = null;
        var id = null;
        
        if(uData != null){
            uInfo = uData.userData;
            id = uInfo._id
            logIn = true;
        }
        
        this.setState({
            userLoggedIn: logIn,
            userID: id,
        })

        // console.log("User",this.state)
    }

    //get cart items
    async getCartItems(){

        var uId = this.state.userID;
        var itemsArr = [];
        var oID = null;

        var orderRes = await OrderServices.getOrderByUserID(uId);
        // console.log(orderRes)

        try
        {
            if(orderRes.status == 200 && orderRes != null){

                if(orderRes.data.orders.length > 0){
                    itemsArr = orderRes.data.orders[0].orderItems;
                    oID = orderRes.data.orders[0]._id;

                    var order = orderRes.data.orders[0];

                    this.setState({
                        items: itemsArr,
                        haveItems: true,
                        orderID: oID,
                        isPaid: order.isPaid,
                        detailsByPaypal: order.detailsByPaypal,
                        orderData: order.deliveryDetails,
                    })
        
                    // set icon related to category
                    this.setCategoryIcon(itemsArr);
                    // console.log("order items", orderRes);
                }
                else{
                    console.log('Cart is empty');
                }

            }
            else{
                console.log("error");
            }
        }
        catch(err){
            console.log(err);
        }

        // console.log("order",orderRes);

        this.setState({
            loading: false,
        })

    }

    //cancel order
    navigateToCartScreen = () => {
        window.location.href = '/cart';
    }

    //close snackbar
    handleCloseSnackbar = () =>{
        this.setState({
            snackbar: false,
        })
    }

    //handle change delivery details
    handleChange = (e) => {
        var name = e.target.name;
        var value = e.target.value;
        var data = this.state.orderData;

        data[name] = value

        this.setState({
            orderData: data,
        })

        console.log(this.state);
    }

    //set payment method
    setSelectedValue = (k,v) => {
        var name = k;
        var value = v;
        var data = this.state.orderData;

        data[name] = value

        this.setState({
            orderData: data,
        })

        console.log(this.state);
    }

    //submit form details
    formSubmit = async() => {

        var oID = this.state.orderID;
        var paidInfo = this.state.detailsByPaypal;
        var paid = false;

        if(paidInfo != null){
            paid = true;
        }

        var formData = {
            isPaid: paid,
            detailsByPaypal: paidInfo,
            orderData: this.state.orderData,
        }

        console.log(formData);
        
        await OrderServices.checkoutOrder(formData, oID)
        .then(res => {

            if(res.status == 200 && res.data.success === true){
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'success',
                    snackbar_message: 'Order Placed Successfully!',
                })

                // Navigate to profile orders page
                setTimeout(() => {
                    window.location.href = "/orders/"+this.state.orderID;
                }, 2000)
            }
            else{
                console.log(res);

                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: 'Error',
                })
            }

        })
        .catch(error => {
            console.log(error);

            this.setState({
                snackbar: true,
                snackbar_severity: 'error',
                snackbar_message: 'Error',
            })

        })

    }

    async componentDidMount(){

        //check user logged in
        await this.checkUserLoggedIn();

        //get cart items
        await this.getCartItems();

        // setup screen size
        if(window.innerWidth <= 750) {
            this.setState({
                isSmallScreen: true,
            });
        }
      
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

               <Grid container justifyContent="center" alignItems="center" direction="row">
                   <Grid item xs={12} sm={12}>
                        <div className={classes.headerContainer}>
                            <Typography variant="h4">Checkout Items</Typography>
                        </div>
                   </Grid>

                    {/* section 1 */}
                    {/* Item */}
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
                                                    <Typography variant="h6">
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
                                <hr />
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

                            {/* Section 2 Part 2 - form */}
                            <Grid item xs={10}>

                                {/* Form */}
                                <ValidatorForm 
                                    onSubmit={this.formSubmit} 
                                    className={ classes.formContainer }
                                >

                                    <Grid container className="w-full"
                                        alignItems="center" 
                                        justifyContent="center" 
                                        direction="row"
                                        spacing={1}
                                        className={classes.mainGrid}
                                    >

                                        <Grid item xs={12} sm={12}>
                                            <div className={classes.headerContainer}>
                                                <Typography variant="h4">Delivery Details</Typography>
                                            </div>
                                        </Grid>

                                        {/* Select payment method */}
                                        {
                                            this.state.isPaid === false &&
                                            <Grid item xs={12}>
                                                Payment Method
                                                <Autocomplete
                                                    className="mt-2 mb-2"
                                                    options={paymentMethods}
                                                    size="small"
                                                    name="paymentMethod"
                                                    getOptionLabel={(option) => option.value}
                                                    onChange={(e, v) =>
                                                    this.setSelectedValue(
                                                        "paymentMethod",
                                                        v == null ? null : v.value
                                                    )
                                                    }
                                                    renderInput={(param) => (
                                                    <TextValidator
                                                        {...param}
                                                        label="Payment Method"
                                                        validators={["required"]}
                                                        errorMessages={[ "This field is required!" ,]}
                                                        value={
                                                            this.state.orderData.paymentMethod === null ? ""
                                                                : 
                                                            this.state.orderData.paymentMethod
                                                        }
                                                    />
                                                    )}
                                                />
                                            </Grid>

                                        }

                                        <Grid item xs={12}>
                                            Address Line 1
                                            <TextValidator
                                                className="mt-2 mb-2"
                                                placeholder="Address Line 1"
                                                helperText="Address Line 1"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                type="text"
                                                name="addressLine1"
                                                value={this.state.orderData.addressLine1}
                                                onChange={(e) => this.handleChange(e)} 
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            Address Line 2
                                            <TextValidator
                                                className="mt-2 mb-2"
                                                placeholder="Address Line 2"
                                                helperText="Address Line 2"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                type="text"
                                                name="addressLine2"
                                                value={this.state.orderData.addressLine2}
                                                onChange={(e) => this.handleChange(e)} 
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            Contact Number
                                            <TextValidator
                                                className="mt-2 mb-2"
                                                placeholder="Contact Number"
                                                helperText="Contact Number"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                type="text"
                                                name="contactNumber"
                                                value={this.state.orderData.contactNumber}
                                                onChange={(e) => this.handleChange(e)} 
                                                validators={[
                                                    'required', 
                                                    "matchRegexp:^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$",
                                                ]}
                                                errorMessages={[
                                                    'This field is required', 
                                                    'Please enter valid Contact Number'
                                                ]}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            City
                                            <TextValidator
                                                className="mt-2 mb-2"
                                                placeholder="city"
                                                helperText="city"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                type="text"
                                                name="city"
                                                value={this.state.orderData.city}
                                                onChange={(e) => this.handleChange(e)} 
                                                validators={['required']}
                                                errorMessages={['This field is required']}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            Zip Code
                                            <TextValidator
                                                className="mt-2 mb-2"
                                                placeholder="Zip Code"
                                                helperText="Zip Code"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                type="number"
                                                name="zipCode"
                                                value={this.state.orderData.zipCode}
                                                onChange={(e) => this.handleChange(e)} 
                                                validators={[
                                                    'required', 
                                                    'minNumber:0',
                                                    "matchRegexp:^[0-9][0-9][0-9][0-9][0-9]$", 
                                                ]}
                                                errorMessages={[
                                                    'This field is required', 
                                                    'Please enter valid zip code',                                                    
                                                    'Please enter valid zip code',
                                                ]}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <div div style={{ textAlign: 'center', }}>
                                                <Button
                                                    className="mt-2"
                                                    variant="contained" 
                                                    color="secondary" 
                                                    type="submit"
                                                    size="small"
                                                >
                                                    Confirm Order
                                                </Button>
                                            </div>
                                        </Grid>

                                    </Grid>

                                </ValidatorForm>

                            </Grid>
                            
                            <Grid item xs={10}>
                                <div className={classes.confirmBtn} onClick={this.navigateToCartScreen}>
                                    Cancel Order
                                </div>
                            </Grid>

                        </>
                    }

                    {
                        this.state.haveItems == false &&
                        <ProductNotFound />
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

            </div>
        )
    }
}

export default withStyles(styles)(CheckoutScreen);
