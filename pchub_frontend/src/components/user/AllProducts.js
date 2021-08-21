import React, { Component } from 'react'
import { 
    Grid, Typography,
} from '@material-ui/core'

import Pagination from '@material-ui/lab/Pagination'
import { withStyles } from '@material-ui/core/styles'

import ItemCard from './home/ItemCard'
import { homeProductItemCardData, } from '../utils/HomePageData'

const styles = (theme) =>({

    root:{
        display: 'block',
        width: '100%',
        // position: 'relative',
    },
    header:{
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    itemContainer:{
        margin: 20,
    },
    paginationStyles: {
        backgroundColor: 'rgba(213, 213, 213, 0.5)',
        borderRadius: '25px',
        
        '& .Mui-selected': {
            backgroundColor: '#000A47',
            color:'#fff',
        },
    },
    paginationContainer: {
        // position: 'absolute',
        // bottom: 0,
        margin: 20,
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

            <div className={classes.root}>

                {/* All items */}
                <Grid container>
                    
                    <Grid item xs={12} sm={12} className={classes.header}>
                        <Typography variant="h4" className="pt-3">Laptops</Typography>
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

                    {/* <Grid item xs={12} sm={12} style={{ textAlign: 'center'}}>
                        <Typography variant="h4" className="pt-3">Item Not Found!</Typography>
                    </Grid> */}

                </Grid>

                {/* Pagination */}
                <Grid container 
                    justifyContent="center" 
                    alignItems="center" 
                    direction="row" 
                    className={classes.paginationContainer}
                >
                    <Grid item style={{ marginBottom: '20px', }}>
                        <Pagination 
                            className={classes.paginationStyles}
                            count={10}
                            // variant="outlined" 
                            color="primary" 
                        />
                    </Grid>
                </Grid>

            </div>
        )
    }
}

export default withStyles(styles)(AllProducts);