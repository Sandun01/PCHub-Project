import React, { Component } from 'react'
import axios from 'axios';

import { 
    Grid, Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import { homeCardData, } from '../utils/HomePageData'

import SlideShow from './home/SlideShow'
import HomeItemCard from './home/HomeItemCard'
import StaticBoxCard from './home/StaticBoxCard'
import { BackendApi_URL } from '../utils/AppConst';

const styles = (theme) => ({
    header:{
        color:'#fff',
        // backgroundColor: "#fff",
    },
    // Transition
    bodyContent:{
        width: '100%',
        height: '100%',
        display: 'block',
        animation: '$customFade 2s linear',
    },
    "@keyframes customFade":{
        "0%":{ 
            opacity: 0,
        },
        "100%":{ 
            opacity: 1,
        }
    }

})

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {

            //latest items
            allItems: [],

            //error
            error: false,
            errorMessage: null,

        }
    }

    componentDidMount(){

        //load latest products
        axios.get(BackendApi_URL+'/products/latest')
        .then(res => {
            console.log(res);
            
            if(res.status === 200){
                const itemArr = res.data.products;
                
                this.setState({
                     allItems: itemArr,
                })
            }
            else{
                this.setState({
                    error: true,
                    errorMessage: "Error:Can't find latest products.",
                })
            }

        })
        .catch(error => {
            console.log(error);
            this.setState({
                error: true,
                errorMessage: "Error:Can't find latest products.",
            })
        })

    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.bodyContent}>
                <Grid container justifyContent="center" alignItems="center" direction="row">
                    {/* Slide Show */}
                    <Grid item>
                        <SlideShow />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <hr 
                            style={{
                                backgroundColor: '#f1f1f1',
                                height: 3,
                            }}
                        />
                    </Grid>

                    {/* New arrivals */}
                    <Grid item>
                        <Typography variant="h5" className={classes.header}>
                            { this.state.allItems.length !== 0 && "New Arrivals"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Grid container 
                            justifyContent="center" 
                            alignItems="center" 
                            direction="row" 
                        >
                            {
                                this.state.allItems.map((itm, key) => (
                                    <Grid item key={itm.item_name}>
                                        <HomeItemCard data={itm}/>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>

                    {/* Fixed cards */}
                    <Grid item xs={12} sm={12}>
                        <Grid container justifyContent="center" alignItems="center" direction="row">
                            {
                                homeCardData.map((itm, key) => (
                                    <Grid item key={itm.title}>
                                        <StaticBoxCard data={itm}/>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>

                </Grid>

            </div>
        )
    }
}

export default withStyles(styles)(Home);
