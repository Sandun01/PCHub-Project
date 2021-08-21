import React, { Component } from 'react'
import { 
    Grid, Typography,
} from '@material-ui/core'

import { withStyles } from '@material-ui/core/styles'

import { homeCardData, homeProductItemCardData, } from '../utils/HomePageData'

import SlideShow from './home/SlideShow'
import HomeItemCard from './home/HomeItemCard'
import StaticBoxCard from './home/StaticBoxCard'

const styles = (theme) => ({
    header:{
        color:'#fff',
        // backgroundColor: "#fff",
    },
})

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }

    render() {
        const { classes } = this.props;
        return (
            <>
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
                        <Typography variant="h5" className={classes.header}>New Arrivals</Typography>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Grid container justifyContent="center" alignItems="center" direction="row">
                            {
                                homeProductItemCardData.map((itm, key) => (
                                    <Grid item key={itm.title}>
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

            </>
        )
    }
}

export default withStyles(styles)(Home);
