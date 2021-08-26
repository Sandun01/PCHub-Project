import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';

import { 
    Grid, Typography, Card, Button,
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { LeftNavBarData } from '../utils/LeftNavBarData';
import OrderServices from '../../services/OrderServices';

const styles = (theme) => ({
    
    root:{
        display: 'block',
        width: '100%',
    },
    headerContainer:{
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    cardStyles:{
       backgroundColor: '#333333',
       color: '#fff',
       padding: 20,
       margin: 5,
    },
    itemName:{
       fontSize: '1rem',
    },
    removeBtn:{
        backgroundColor: '#F2C94C',
        textTransform: 'none',
        '&:hover':{
            backgroundColor: '#F77272',
        }
    },
    plusBtn:{
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
        borderRadius: 5,
        '&:hover':{
            backgroundColor: '#28A745',
        }
    },
    minusBtn:{
        marginLeft: 10,
        marginRight: 10,
        padding: 5,
        borderRadius: 5,
        '&:hover':{
            backgroundColor: '#F77272',
        }
    },
    
    deleteButton:{
        textAlign: 'center',
        '&:hover':{
            color: '#F77272',
        }
    },

    qtyDisplayBox:{
        backgroundColor: '#C4C4C4',
        color: '#000',
        padding: 5,
        borderRadius: 5,
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
        backgroundColor: '#28A745',
        width: '250px',
        textAlign: 'center',
        fontWeight: 'bold',
        '&:hover':{
            backgroundColor: '#1E7031',
        }
    },

})
class Cart extends Component {

    constructor(props){
        super(props);
        this.state = {

            //screen
            isSmallScreen: false,

            //page data
            items: [],
            haveItems: false,

            //user data
            userLoggedIn: false,

            totalAmount: 0,

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

        this.setState({
            items: newItems,
            totalAmount: tot,
        })
        // console.log(newItems);

    }

    //get cart items
    getCartItems(){

        var arr = OrderServices.getAllItemsInCart_Local();

        if(arr != null && arr.length > 0){
            console.log(arr);
            this.setState({
                items: arr,
                haveItems: true,
            })

            // set icon related to category
            this.setCategoryIcon(arr);

        }
        else{
            console.log('Cart is empty');
        }

    }

    //remove item from cart
    removeCartItem(id){
        var userLog = this.state.userLoggedIn;
        var itemArr = [];

        if(userLog){ //get items in db
            
        }
        else{  //remove item in local
            itemArr = OrderServices.removeItemInCart_Local(id);
            console.log(id)
        }

        window.location.reload(false);

    }

    //change item quantity
    changeQuantity(type, id, qty){

        var userLog = this.state.userLoggedIn;

        if(type === "-" && qty > 1){ //Decrease
            qty = qty - 1;
        }
        else if(type === "+"){   //Increase
            qty = qty + 1;
        }

        //check user logged in
        if(userLog){ //if user logged in DB changes

        }
        else{  //if user not logged in LOCAL changes
            var res = OrderServices.changeItemQuantityInCart_Local(id, qty);
            // console.log(res);

            //set item images
            this.setCategoryIcon(res);

            if(Array.isArray(res)){
                this.setState({
                    items: res,
                })
            }

        }

    }

    componentDidMount(){
        
        //get cart items
        this.getCartItems();

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
               
               <Grid container justifyContent="center" alignItems="center" direction="row">
                   <Grid item xs={12} sm={12}>
                        <div className={classes.headerContainer}>
                            <Typography variant="h4">Quotation</Typography>
                        </div>
                   </Grid>

                    {/* section 1 */}
                    {/* Item */}
                    { 
                        this.state.haveItems && 
                        this.state.items.map((item, key) => (
                            
                            <Grid item xs={10}>

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
                                            {/* Asus ROG Strix G712LWS */}
                                            { item.name }
                                        </Grid>

                                        {/* Remove button */}
                                        <Grid item xs={2} sm={2}>
                                            { this.state.isSmallScreen === false ? 
                                                <Button 
                                                    variant="contained" 
                                                    size="small" 
                                                    className={classes.removeBtn}
                                                    onClick={() => this.removeCartItem(item.id) }
                                                >
                                                    Remove Item
                                                </Button>
                                                :
                                                <div 
                                                    className={classes.deleteButton} 
                                                    onClick={() => this.removeCartItem(item.id) }
                                                >
                                                    <DeleteForeverIcon />
                                                </div>
                                            }
                                        </Grid>

                                        {/* Edit button */}
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
                                                <div 
                                                    className={this.state.isSmallScreen ? "ml-3 mr-5" :classes.plusBtn}
                                                    onClick={() => this.changeQuantity("+", item.id, item.qty)}
                                                >
                                                    <AddIcon />
                                                </div>
                                                <div className={classes.qtyDisplayBox}>
                                                    <Typography variant="h6">
                                                        {/* 13 */}
                                                        { item.qty }
                                                    </Typography>
                                                </div>
                                                <div 
                                                    className={this.state.isSmallScreen ? "ml-5 mr-3" :classes.minusBtn}
                                                    onClick={() => this.changeQuantity("-", item.id, item.qty)}
                                                >
                                                    <RemoveIcon />
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
                        <Grid item xs={10}>
                            <div className={classes.totalPriceText}>
                                <Typography variant="h5" style={{ fontWeight: 'bold', }}>
                                    Rs.{this.state.totalAmount} /=
                                </Typography>
                            </div>
                        </Grid>
                    }

                    {
                        this.state.userLoggedIn &&
                        <Grid item xs={10}>
                            <div className={classes.confirmBtn}>
                                Confirm Order
                            </div>
                        </Grid>
                    }

               </Grid>

            </div>
        )
    }
}

export default withStyles(styles)(Cart);