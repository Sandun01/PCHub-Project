import React, { Component } from 'react'
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

import { 
    Grid, Typography, CircularProgress,
} from '@material-ui/core'

import { Alert, AlertTitle, } from '@material-ui/lab';
import { BackendApi_URL } from '../../utils/AppConst';
import Carousel from "react-material-ui-carousel"
import { Link } from 'react-router-dom'
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import BookmarksIcon from '@material-ui/icons/Bookmarks'
import LoadingScreen from '../../common/LoadingScreen';
import OrderServices from '../../../services/OrderServices'
import WishListServices from '../../../services/WishListServices';
import AuthService from '../../../services/AuthService';

const styles = (theme) => ({

    root:{
        // width: '100%',
        // height: '100%',
        // display: 'block',
        // position: 'fixed',
    },
    header:{
        paddingTop: 20,
        paddingLeft: 40,
    },
    imageIcon:{
        marginLeft: 10,
        width:'40px',
        height:'40px',
    },
    image:{
        maxHeight:"500px",
        maxwidth:"500px",
        height:"100%",
        width:"100%",
    },
    gridContainer1:{
        padding: 20,
    },
    gridContainer2:{
        padding: 20,
    },
    priceText:{
        paddingTop: 20,
        fontWeight: 'bold',
    },
    inStockText:{
        marginTop: 10,
        padding: 10,
        fontWeight: 'bold',
        backgroundColor:'#014EA2',
        width: '90px',
        textAlign: 'center',
        borderRadius: 10,
    },
    outStockText:{
        marginTop: 10,
        padding: 10,
        fontWeight: 'bold',
        backgroundColor:'#D70000',
        width: '120px',
        textAlign: 'center',
        borderRadius: 10,
    },

    buttonStyles:{
        marginRight: 10,
        marginTop: 30,
        padding: 10,
        color: 'black',
        fontWeight: 'bold',
        backgroundColor:'#007BFF',
        // width: '100%',
        textAlign: 'center',
        borderRadius: 10,
        '&:hover':{
            // backgroundColor:'#014EA2',
            backgroundColor:'#00DBAE',
            cursor: 'pointer',
            // color: 'white',
        }
    },
    linkStyles:{
        textDecoration: 'none',
    },
    iconButtonStyles:{
        marginLeft: 5,
    },
    
    // Transition
    bodyContent:{
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

    constructor(props){
        super(props);
        //bind addtowishlist
        this.addToWishList = this.addToWishList.bind(this);

        this.state = {
            //user data
            user: {
                _id: '',
                fname: '',
                lname: '',
                email: '',
                password: '',
              },
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

            //user details
            userLoggedIn: false,

            //page details
            haveMoreImages: false,
            loadingData: true,
            haveData: false,

            //error
            error: false,
            errorMessage: null,

        }

    }

    getUserData = async () => {
        var res = AuthService.getUserData();
        var userD = res.userData;
        // userD['fname'] = userData.fname;
    
        console.log(userD);
        this.setState({
          user: userD,
        });
        console.log('1::' + res.userData._id);
        console.log('2::' + this.state.user._id);
      };

    addToCart = () => {

        if(this.state.userLoggedIn){

        }
        else{
            var res = OrderServices.addItemToCart_Local(this.state.item);

            if(res === true){
                console.log('Success');
                window.location.reload(false);
            }
            else if(res === 100){
                console.log('Item already in the cart');
            }
            else if(res === false){
                console.log('Error');
            }
            else{
                console.log('No Data Found');
            }

        }

    }

    addToWishList(){
        

        console.log('Add to wishlist')
        //data that we want to add to wishlist
        let wishlist = {
            userID:this.state.user._id,
            product: this.state.item._id
        }
        

         //send to database
         WishListServices.addToWishList(wishlist);

    }

    componentDidMount(){
        //get user data
        this.getUserData();
        //get item id
        const itmID = this.props.match.params.id;
        // console.log(itmID);
        
        //get item details
        axios.get(BackendApi_URL+"/products/"+itmID)
        .then(res => {
            console.log(res);

            if(res.status === 200 && res.data.product != null){
                const allImages = [];
                const itemDetails = res.data.product;
                const moreImages = Array.isArray(itemDetails.item_image);

                if(moreImages){
                    allImages = JSON.stringify(itemDetails.item_image);
                }
                  
                setTimeout(() => {
                    this.setState({
                        item: itemDetails,
                        haveMoreImages: moreImages,
                        images: allImages,
                        loadingData: false,
                        haveData: true,
                    })
                }, 800)
            }
            else{
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
                                        this.state.haveMoreImages ?
                                            this.state.images.map(img => (
                                                <img src={img} className={classes.image} alt={""} />
                                            ))
                                        :
                                        <img src={this.state.item.item_image} className={classes.image} alt={""} />
                                    }

                                </Carousel>
                            </Grid>

                            <Grid item lg={6} className={classes.gridContainer1} >
                                {/* item description */}
                                { this.state.item.item_description}

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
                                        <Grid item sm={5}>
                                            {/* <Link to="/cart" className={classes.linkStyles}> */}
                                                <div className={classes.buttonStyles} onClick={this.addToCart}>
                                                    Add to Cart <ShoppingCartIcon className={classes.iconButtonStyles}/>
                                                </div>
                                            {/* </Link> */}
                                        </Grid>
                                    {
                                        !this.state.userLoggedIn &&
                                            <Grid item sm={5}>
                                                {/* <Link to="/wishlist" className={classes.linkStyles}> */}
                                                    <div className={classes.buttonStyles} onClick={this.addToWishList}>
                                                        Add to Wishlist <BookmarksIcon className={classes.iconButtonStyles}/>
                                                    </div>
                                                {/* </Link> */}
                                            </Grid>
                                    }

                                </Grid>

                            </Grid>

                        </Grid>
                    </div>

                }

            </div>
        )
    }
}

export default withStyles(styles)(ProductSingleView);