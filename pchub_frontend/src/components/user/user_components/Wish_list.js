import React, { Component } from 'react';

import {
  Grid, Typography, Snackbar, Button, Container
} from '@material-ui/core'

import axios from 'axios';
import AuthService from '../../../services/AuthService';
import { BackendApi_URL } from '../../utils/AppConst';
import { withStyles } from "@material-ui/core/styles";
import WishListServices from '../../../services/WishListServices';
import OrderServices from '../../../services/OrderServices';




import { Alert } from '@material-ui/lab';



const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },

  itemContainer: {
    padding: 20,
    borderRadius: 20,
    border: '2px solid #fff',
    backgroundColor: 'rgba(216,216,216,0.2)',
  },

  addBtn: {
    margin: 10,
    "&:hover": {
      backgroundColor: "#002073",
      color: "#fff",
    }
  },

  removeBtn: {
    margin: 10,
    "&:hover": {
      backgroundColor: "#A81100",
      color: "#fff",
    }
  }

});



class Wish_list extends Component {


  constructor(props) {
    super(props);
    this.getUserData = this.getUserData.bind(this);
    this.state = {
      user: {
        _id: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
      },
      Wishlist: [],

      //snackbar
      snackbar: false,
      snackbar_severity: 'success',
      snackbar_message: null,
    }
  }

  getUserData = async () => {
    var res = await AuthService.getUserData();
    var userD = res.userData;

    console.log(userD);
    this.setState({
      user: userD,
    });


    console.log('response user id :' + res.userData._id);
    console.log('state user id :' + this.state.user._id);
  }


  deleteItemFromWishList = async (wishlistItemID) => {

    console.log('delete from wishlist')
    if (wishlistItemID != null) {
      console.log("in");
      // delete from  database
      await WishListServices.deleteItemFromWishList(wishlistItemID);

      this.componentDidMount();
      this.setState({
        snackbar: true,
        snackbar_severity: 'success',
        snackbar_message: 'Item Successfully deleted',
      })
    }
  }

  addToCart = async (item_data) => {

    // console.log(item_data);

    var item = {
      _id: item_data.product._id,
      item_name: item_data.product.item_name,
      price: item_data.product.price,
      item_image: item_data.product.item_image,
      item_description: item_data.product.item_description,
      category: item_data.product.category,
    }

    var userID = item_data.userID

    try {
      var res = await OrderServices.addItemToCart_DB(item, userID);
      console.log("Item", res);

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
            this.componentDidMount();
            this.deleteItemFromWishList(item_data._id);
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





  async componentDidMount() {

    //get user data
    // setTimeout(() => {
    await this.getUserData();

    console.log("state user id", this.state.user._id)

    await axios.get(BackendApi_URL + "/wishlists/" + this.state.user._id)

      .then(res => {
        // console.log("state", res);
        console.log('WISHLIST response', res.data.data);
        this.setState(
          {
            Wishlist: res.data.data
          }
        )
      })
      .catch(error => {
        console.log(error);
      })

    // }, 1000)
    console.log("Wishlist state", this.state.Wishlist)
    // console.log("W1", this.state.Wishlist[0].product.countinStock)


  }

  handleCloseSnackbar = () => {
    this.setState({
        snackbar: false,
    })
}


  render() {
    const { classes } = this.props;


    // let head;
    // if (this.state.Wishlist.countInStock > 0) {

    //   head = <div>in-Stock</div>
    // } else {

    //   console.log("toptotpotp: ", this.state.Wishlist.countInStock);

    //   head = <div>out-0f-Stock</div>

    // }



    return (
      <div>

        <Typography
          component="h1"
          variant="h3"
          style={{ fontWeight: '500', color: 'white' }}
        >
          <center>
            Wishlist
          </center>
        </Typography>

        <Container style={{ margin: 20, }}>


          {
            this.state.Wishlist.length > 0 &&
            this.state.Wishlist.map((item, index) => (

              <>
                <Grid container className={classes.itemContainer}>

                  <Grid item xs={5} sm={5}>
                    {item.product.item_name}
                  </Grid>
                  <Grid item xs={7} sm={7}>
                    <div>{(item.product.countInStock > 0 && true) ? "In Stock" : "Out of Stock"}</div>
                  </Grid>
                  <Grid item xs={12} sm={12} style={{ marginRight: 10, }}>
                    <div style={{ float: 'right' }}>
                      <Button
                        onClick={() => this.addToCart(item)}
                        variant="outlined"
                        color="primary"
                        className={classes.addBtn} >
                        Add To Cart

                      </Button>
                      <Button onClick={() => this.deleteItemFromWishList(item._id)} variant="outlined" color="secondary" className={classes.removeBtn} >
                        Remove
                        <Grid hidden>
                          {item.product._id}
                        </Grid>
                      </Button>
                    </div>
                  </Grid>

                </Grid >

                <hr
                // style={{ border: "2px solid #fff" }} 
                />
              </>

            ))
          }


        </Container>


        <Snackbar
        open={this.state.snackbar}
        autoHideDuration={6000}
        onClose={this.handleCloseSnackbar}
    >
        <Alert onClose={this.handleCloseSnackbar} severity={this.state.snackbar_severity} >
            {this.state.snackbar_message}
        </Alert>
    </Snackbar>
      </div >
    );
  }
}
export default withStyles(styles)(Wish_list);
