import React, { Component } from 'react'
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

import {
    Grid, Typography, CircularProgress, Snackbar,
} from '@material-ui/core'

import { Alert, AlertTitle, } from '@material-ui/lab';
import { BackendApi_URL } from '../../utils/AppConst';
import Carousel from "react-material-ui-carousel"
import { Link } from 'react-router-dom'
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import BookmarksIcon from '@material-ui/icons/Bookmarks'
import LoadingScreen from '../../common/LoadingScreen';
import OrderServices from '../../../services/OrderServices'
import AuthService from '../../../services/AuthService';
import WishListServices from '../../../services/WishListServices';


const styles = (theme) => ({

    root: {
        // width: '100%',
        // height: '100%',
        // display: 'block',
        // position: 'fixed',
    },
    header: {
        paddingTop: 20,
        paddingLeft: 40,
    },
    imageIcon: {
        marginLeft: 10,
        width: '40px',
        height: '40px',
    },
    image: {
        maxHeight: "500px",
        maxwidth: "500px",
        height: "100%",
        width: "100%",
    },
    gridContainer1: {
        padding: 20,
    },
    gridContainer2: {
        padding: 20,
    },
    priceText: {
        paddingTop: 20,
        fontWeight: 'bold',
    },
    inStockText: {
        marginTop: 10,
        padding: 10,
        fontWeight: 'bold',
        backgroundColor: '#014EA2',
        width: '90px',
        textAlign: 'center',
        borderRadius: 10,
    },
    outStockText: {
        marginTop: 10,
        padding: 10,
        fontWeight: 'bold',
        backgroundColor: '#D70000',
        width: '120px',
        textAlign: 'center',
        borderRadius: 10,
    },

    buttonStyles: {
        marginRight: 10,
        marginTop: 30,
        padding: 10,
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: '#007BFF',
        // width: '100%',
        minWidth: '150px',
        textAlign: 'center',
        borderRadius: 10,
        '&:hover': {
            // backgroundColor:'#014EA2',
            backgroundColor: '#00DBAE',
            cursor: 'pointer',
            // color: 'white',
        }
    },
    linkStyles: {
        textDecoration: 'none',
    },
    iconButtonStyles: {
        marginLeft: 5,
    },

    // Transition
    bodyContent: {
        opacity: 1,
        animation: '$customFade 2s linear',
    },
    "@keyframes customFade": {
        "0%": {
            opacity: 0,
        },
        "100%": {
            opacity: 1,
        }
    },

    //alert
    alertContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertStyles: {
        // display: 'inline-block',
    },

})

class ProductSingleView extends Component {

    constructor(props) {
        super(props);

        this.state = {

            //Item details
            item: {
                _id: null,
                item_name: null,
                price: 0,
                countInStock: 0,
                item_image: [],
                item_description: null,
                category: null,
            },

            //snackbar
            snackbar: false,
            snackbar_severity: 'success',
            snackbar_message: null,

            //user details
            userLoggedIn: false,
            userID: null,

            //page details
            loadingData: true,
            haveData: false,
            noOfImages: 0,

            //error
            error: false,
            errorMessage: null,

        }

    }

    addToCart = async () => {

        if (this.state.userLoggedIn) {

            try {
                var res = await OrderServices.addItemToCart_DB(this.state.item, this.state.userID);
                // console.log("Item",res);

                if (res.status == 201 || res.status == 200) {

                    if (res.data.message === "Already_Exists") {

                        console.log('Item already in the cart');
                        this.setState({
                            snackbar: true,
                            snackbar_severity: 'warning',
                            snackbar_message: 'Item already in the cart',
                        })

                    }
                    else {
                        console.log('Item Added to cart - Success');

                        this.setState({
                            snackbar: true,
                            snackbar_severity: 'success',
                            snackbar_message: 'Item Successfully Added to the Cart!',
                        })

                        setTimeout(() => {
                            window.location.reload(false);
                        }, 1500)

                    }
                }
                else {
                    console.log('Error');

                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'error',
                        snackbar_message: "Error! Item didn't added to the cart",
                    })

                }
            }
            catch (err) {
                console.log(err)
                console.log('Error');
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: "Error! Item didn't added to the cart",
                })
            }

        }
        else {
            var res = OrderServices.addItemToCart_Local(this.state.item);

            if (res === true) {
                console.log('Success');

                this.setState({
                    snackbar: true,
                    snackbar_severity: 'success',
                    snackbar_message: 'Item Successfully Added to the Cart!',
                })

                setTimeout(() => {
                    window.location.reload(false);
                }, 1500)

            }
            else if (res === 100) {

                console.log('Item already in the cart');
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'warning',
                    snackbar_message: 'Item already in the cart',
                })

            }
            else if (res === false) {

                console.log('Error');
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: "Error! Item didn't added to the cart",
                })

            }
            else {

                console.log('No Data Found');
                this.setState({
                    snackbar: true,
                    snackbar_severity: 'error',
                    snackbar_message: "Error! Item Data not Found",
                })

            }

        }

    }

    addItemToWishList = async () => {

        console.log('Add to wishlist')



        //data that we want to add to wishlist

        if (this.state.userID != null) {

            var wishlist = {
                userID: this.state.userID,
                product: this.state.item._id
            }

            await WishListServices.che

            // send to database
            await WishListServices.addToWishList(wishlist)
            .then(
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'success',
                        snackbar_message: 'Item Successfully Added to the Wishlist!',
                }))
            .catch(e=>{
                    console.log(e.message);
                    this.setState({
                        snackbar: true,
                        snackbar_severity: 'error',
                        snackbar_message: "Error! Item didn't get added to the Wishlist!",
                        });
                }
              )
        }


    }

    async checkUserLoggedIn() {
        var logIn = false;
        var uData = await AuthService.getUserData();
        var uInfo = null;
        var id = null;

        if (uData != null) {
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

    handleCloseSnackbar = () => {
        this.setState({
            snackbar: false,
        })
    }

    componentDidMount() {
        //get item id
        const itmID = this.props.match.params.id;
        // console.log(itmID);

        //check user logged in
        this.checkUserLoggedIn();

        //get item details
        axios.get(BackendApi_URL + "/products/" + itmID)
            .then(res => {
                // console.log(res);

                if (res.status === 200 && res.data.product != null) {
                    const allImages = [];
                    var count = 0;
                    const itemDetails = res.data.product;
                    const moreImages = Array.isArray(itemDetails.item_image);

                    if (moreImages) {
                        allImages = JSON.stringify(itemDetails.item_image);
                        count = allImages.length;
                    }
                    else if (itemDetails.item_image != null && itemDetails.item_image != "") {
                        count = 1;
                    }
                    else {
                        count = 0;
                    }

                    setTimeout(() => {
                        this.setState({
                            item: itemDetails,
                            noOfImages: count,
                            images: allImages,
                            loadingData: false,
                            haveData: true,
                        })
                    }, 800)
                }
                else {
                    setTimeout(() => {
                        this.setState({
                            loadingData: false,
                            haveData: false,
                        })
                    }, 800)
                }

                console.log(this.state);
            })
            .catch(error => {
                console.log(error);
                setTimeout(() => {
                    this.setState({
                        loadingData: false,
                        haveData: false,
                    })
                }, 800)
            })

    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                {
                    this.state.loadingData ?
                        <div>
                            <LoadingScreen />
                        </div>
                        :

                        this.state.haveData === false ?
                            <div className={classes.alertContainer}>
                                <Alert severity="error" className={classes.alertStyles}>
                                    <AlertTitle>
                                        Error
                                    </AlertTitle>
                                    No Data Found!
                                </Alert>
                            </div>
                            :

                            <div className={classes.bodyContent}>
                                <Typography variant="h3" className={classes.header}>
                                    {/* Asus ROG Strix G17  */}
                                    {this.state.item.item_name}
                                </Typography>

                                <Grid container alignItems="center" justifyContent="center" direction="row">
                                    <Grid item lg={6} className={classes.gridContainer2} >
                                        <Carousel
                                            autoPlay={true}
                                            indicators={false}
                                            navButtonsAlwaysVisible={false}
                                            timeout={400}
                                        >

                                            {
                                                this.state.noOfImages > 1 ?
                                                    this.state.images.map(img => (
                                                        <img src={img} className={classes.image} alt={""} />
                                                    ))
                                                    :
                                                    this.state.noOfImages == 1 ?
                                                        <img src={this.state.item.item_image} className={classes.image} alt={""} />
                                                        :
                                                        this.state.noOfImages == 0 &&
                                                        <img src={"/images/imageNotAvailable.png"} className={classes.image} alt={""} />
                                            }

                                        </Carousel>
                                    </Grid>

                                    <Grid item lg={6} className={classes.gridContainer1} >
                                        {/* item description */}
                                        {this.state.item.item_description}

                                        <Typography variant="h4" className={classes.priceText}>
                                            Rs.{this.state.item.price}
                                        </Typography>

                                        <Grid container>
                                            <Grid item sm={3}>
                                                {
                                                    this.state.item.countInStock !== 0 ?
                                                        <div className={classes.inStockText}>
                                                            In Stock
                                                        </div>
                                                        :
                                                        <div className={classes.outStockText}>
                                                            Out of Stock
                                                        </div>
                                                }
                                            </Grid>
                                        </Grid>


                                        <Grid container alignItems="center" justifyContent="center" direction="row">
                                            {
                                                this.state.item.countInStock > 0 &&
                                                <Grid item sm={5}>
                                                    {/* <Link to="/cart" className={classes.linkStyles}> */}
                                                    <div className={classes.buttonStyles} onClick={this.addToCart}>
                                                        Add to Cart <ShoppingCartIcon className={classes.iconButtonStyles} />
                                                    </div>
                                                    {/* </Link> */}
                                                </Grid>
                                            }

                                            {
                                                this.state.userLoggedIn &&
                                                <Grid item sm>
                                                    {/* <Link to="/wishlist" className={classes.linkStyles}> */}
                                                    <div className={classes.buttonStyles} onClick={this.addItemToWishList}>
                                                        Add to Wishlist <BookmarksIcon className={classes.iconButtonStyles} />
                                                    </div>
                                                    {/* </Link> */}
                                                </Grid>
                                            }

                                        </Grid>

                                    </Grid>

                                </Grid>
                            </div>

                }

                <Snackbar
                    open={this.state.snackbar}
                    autoHideDuration={6000}
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

export default withStyles(styles)(ProductSingleView);