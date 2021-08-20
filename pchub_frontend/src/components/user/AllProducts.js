import React, { Component } from 'react'
import { 
    Grid, Typography,
} from '@material-ui/core'

import Pagination from '@material-ui/lab/Pagination'
import { withStyles } from '@material-ui/core/styles'

import ItemCard from './home/ItemCard'
import { homeProductItemCardData, } from '../utils/HomePageData'

const styles = (theme) =>({

    paginationContainer: {
        backgroundColor: 'rgba(213, 213, 213, 0.5)',
        borderRadius: '25px',
        
        '& .Mui-selected': {
            backgroundColor: '#000A47',
            color:'#fff',
        },
    },

    header:{
        textAlign: 'center',
    },

})

class AllProducts extends Component {

    constructor(props){
        super(props);
        this.state = {
            category: null,
            noOfResult: 0,
        }
    }

    componentDidMount(){

    }

    render() {
        const { classes } = this.props;
        
        return (
            <>
                {/* All items */}
                <Grid container justifyContent="center" alignItems="center" direction="row" >

                    <Grid item>
                        <Typography variant="h4">Laptops</Typography>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Grid container justifyContent="center" alignItems="center" direction="row">
                            {
                                homeProductItemCardData.map((itm, key) => (
                                    <Grid item key={itm.title}>
                                        <ItemCard data={itm}/>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>
                    
                    <Grid item xs={12} sm={12}>
                        <Grid container justifyContent="center" alignItems="center" direction="row">
                            {
                                homeProductItemCardData.map((itm, key) => (
                                    <Grid item key={itm.title}>
                                        <ItemCard data={itm}/>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>


                    {/* Pagination */}
                    <Grid item xs={12} sm={12}>
                        <Grid container justifyContent="center" alignItems="center" direction="row">
                            <Grid item style={{ marginBottom: '20px', }}>
                                <Pagination 
                                    className={classes.paginationContainer}
                                    count={10}
                                    // variant="outlined" 
                                    color="primary" 
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </>
        )
    }
}

export default withStyles(styles)(AllProducts);