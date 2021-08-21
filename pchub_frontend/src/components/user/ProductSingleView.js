import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';

import { 
    Grid, Typography, 
} from '@material-ui/core'

import Carousel from "react-material-ui-carousel"
import { Link } from 'react-router-dom'
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import BookmarksIcon from '@material-ui/icons/Bookmarks'

const styles = (theme) => ({

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
        // maxHeight:"500px",
        height:"500px",
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
            // color: 'white',
        }
    },
    linkStyles:{
        textDecoration: 'none',
    },
    iconButtonStyles:{
        marginLeft: 5,
    },

})

class ProductSingleView extends Component {

    constructor(props){
        super(props);
        this.state = {
            title: null,
            price: 280000,
            qty: 3,
            src: [],
            description: null,
            category: 'laptop',

            userLoggedIn: false,

        }

    }

    componentDidMount(){

    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Typography variant="h3" className={classes.header}>
                    Asus ROG Strix G17 
                    {/* {this.state.title} */}
                </Typography>

                <Grid container alignItems="center" justifyContent="center" direction="row"> 
                    <Grid item lg={6} className={classes.gridContainer2} >
                        <Carousel
                            autoPlay={true}
                            indicators={false}
                            navButtonsAlwaysVisible={false}
                            timeout={400}
                        >
                            <img src="/images/products/ROG Strix 1.png" className={classes.image} />
                            <img src="/images/products/ROG Strix 2.png" className={classes.image} />
                            <img src="/images/products/ROG Strix 3.png" className={classes.image} />
                        </Carousel>
                    </Grid>

                    <Grid item lg={6} className={classes.gridContainer1} >
                        TWO SCREENS. ZERO LIMITS.
                        <br />
                        With its innovative ROG ScreenPad Plus secondary display, the Zephyrus Duo 15 SE takes Windows 10 gaming to new dimensions. Cutting-edge cooling empowers the latest AMD Ryzen™ 9 5900HX  CPU and NVIDIA® GeForce RTX 3080 16GB GDDR6 GPU. A ultrafast 300Hz/3ms gaming panel lets you tailor your system for pro-level esports or content creation. Elevate your entire experience with premium audio delivered by quad speakers and immersive Dolby Atmos surround sound.
                        <br />
                        Asus ROG Zephyrus Duo 15 SE GX551 Ryzen 9 RTX 3080
                        AMD Ryzen™ 9 5900HX Processor 3.3 GHz (16M Cache, up to 4.6 GHz)
                        32GB DDR4 3200MHZ
                        2TB NVME M.2 SSD
                        300Hz 3ms 15.6” FHD IPS-Type PANTONE Validated Display 100% SRGB
                        NVIDIA® GeForce RTX 3080 16GB GDDR6
                        14.1" 3840x1100 32:9 Touch Screen
                        2.50 kg , 90WHrs
                        <br />
                        Plamrest, Per key RGB Keyboard
                        2 Years warranty
                        Geniune Windows 10 Home 64Bit Pre-installed
                        FREE ROG ranger backpack,
                        1080P@60FPS external camera,
                        ROG CHAKRAM CORE Mouse
                        <br />
                        Plamrest, Per key RGB Keyboard
                        2 Years warranty
                        Geniune Windows 10 Home 64Bit Pre-installed
                        FREE ROG ranger backpack,
                        1080P@60FPS external camera,
                        ROG CHAKRAM CORE Mouse

                        <Typography variant="h4" className={classes.priceText}>
                            Rs.{this.state.price}
                        </Typography>

                        <Grid container>
                            <Grid item sm={3}>
                            {
                                this.state.qty !== 0 ?
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
                                    <Link to="/cart" className={classes.linkStyles}>
                                        <div className={classes.buttonStyles}>
                                            Add to Cart <ShoppingCartIcon className={classes.iconButtonStyles}/>
                                        </div>
                                    </Link>
                                </Grid>
                            {
                                this.state.userLoggedIn === false &&
                                    <Grid item sm={5}>
                                        <Link to="/wishlist" className={classes.linkStyles}>
                                            <div className={classes.buttonStyles}>
                                                Add to Wishlist <BookmarksIcon className={classes.iconButtonStyles}/>
                                            </div>
                                        </Link>
                                    </Grid>
                            }

                        </Grid>

                    </Grid>

                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(ProductSingleView);