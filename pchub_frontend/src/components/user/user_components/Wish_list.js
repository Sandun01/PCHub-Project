import React, { Component } from 'react';
import { Container } from '@material-ui/core';


import axios from 'axios';
import AuthService from '../../../services/AuthService';
import { BackendApi_URL } from '../../utils/AppConst';
import { withStyles } from "@material-ui/core/styles";



import { Typography, Grid, Button, } from '@material-ui/core';



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
      Wishlist: []
    }
  }

  getUserData = async () => {
    var res = await AuthService.getUserData();
    var userD = res.userData;

    console.log(userD);
    this.setState({
      user: userD,
    });


    console.log('dsadsads :' + res.userData._id);
    console.log('dsadsads :' + this.state.user._id);
  }


  async componentDidMount() {

    //get user data
    // setTimeout(() => {
    await this.getUserData();

    console.log("DATA", this.state.user._id)

    await axios.get(BackendApi_URL + "/wishlists/" + this.state.user._id)

      .then(res => {
        console.log("state", res);
        // console.log('WISHLIST', res.data.data);
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
    console.log("W", this.state.Wishlist)
    // console.log("W1", this.state.Wishlist[0].product.countinStock)

   
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
                      <Button variant="outlined" color="primary" className={classes.addBtn} >
                        Add To Cart
                      </Button>
                      <Button variant="outlined" color="secondary" className={classes.removeBtn} >
                        Remove
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



      </div >
    );
  }
}
export default withStyles(styles)(Wish_list);
