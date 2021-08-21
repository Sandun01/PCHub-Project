import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';

import { 
    Grid, Typography, Card, Button,
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { LeftNavBarData } from '../utils/LeftNavBarData'

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
            title: null,
            price: 280000,
            qty: 3,
            src: [],
            description: null,
            category: 'laptop',

            categoryIconSrc: null,

            isSmallScreen: false,

        }

    }

    // get icon related to category
    getCategoryIcon = (category) =>{

        LeftNavBarData.forEach(item => {
            if(item.category === category){
                this.setState({
                    categoryIconSrc: item.iconPath,
                })
            }
        })

    }

    componentDidMount(){
        // get icon related to category
        this.getCategoryIcon(this.state.category);

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

                   <Grid item xs={10}>

                        <Card className={classes.cardStyles}>
                            <Grid container justifyContent="center" alignItems="center" direction="row">

                                {/* Item Icon */}
                                { this.state.isSmallScreen === false &&
                                    <Grid item xs={1} sm={1}>
                                        <img src={this.state.categoryIconSrc} width="30px" height="30px" />
                                    </Grid>
                                }

                                {/* Item name */}
                                <Grid 
                                    item 
                                    xs={this.state.isSmallScreen ? 5 : 4} 
                                    sm={this.state.isSmallScreen ? 5 : 4} 
                                    className={classes.itemName}
                                >
                                    Asus ROG Strix G712LWS
                                </Grid>
                                {/* Remove button */}
                                <Grid item xs={2} sm={2}>
                                    { this.state.isSmallScreen === false ? 
                                        <Button variant="contained" size="small" className={classes.removeBtn}>
                                            Remove Item
                                        </Button>
                                        :
                                        <div className={classes.deleteButton}>
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

                                    <Grid container justifyContent="center" alignItems="center" direction="row">
                                        <div className={this.state.isSmallScreen ? "ml-3 mr-5" :classes.plusBtn}>
                                            <AddIcon />
                                        </div>
                                        <div className={classes.qtyDisplayBox}>
                                            <Typography variant="h6">13</Typography>
                                        </div>
                                        <div className={this.state.isSmallScreen ? "ml-5 mr-3" :classes.minusBtn}>
                                            <RemoveIcon />
                                        </div>
                                    </Grid>

                                </Grid>

                                {/* Total */}
                                { this.state.isSmallScreen === false &&
                                    <Grid item xs={2} sm={2}>
                                        <div className={classes.priceText1} >
                                            Rs.280000
                                        </div>
                                        <div className={classes.priceText2}>
                                            Rs.280000 X 1
                                        </div>
                                    </Grid>
                                }

                            </Grid>
                        </Card>

                   </Grid>

                   <Grid item xs={10}>
                        <div className={classes.totalPriceText}>
                            <Typography variant="h5" style={{ fontWeight: 'bold', }}>
                                Total Rs.280000
                            </Typography>
                        </div>
                   </Grid>

                   <Grid item xs={10}>
                        <div className={classes.confirmBtn}>
                            Confirm Order
                        </div>
                   </Grid>

               </Grid>

            </div>
        )
    }
}

export default withStyles(styles)(Cart);