import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'

import { 
    Grid, Typography, Backdrop, CircularProgress,
} 
from '@material-ui/core';

const styles = (theme) => ({
    
    root:{
        width: '100%',
        height: '100%',
    },
    loadingText:{
        textAlign: 'center',
    },
    spinnerStyles: {
        animation: '$spin infinite 3s linear',
        fontSize: '200px',
        color: '#fff',
    },
    '@keyframes spin':{
        "from":
        {
          transform: "rotate(0deg)",
        },
        "to":
        {
          transform: "rotate(360deg)",
        }
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

})

class LoadingScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            progress: 0,
        }
    }

    componentDidMount(){
        // const loadingProgress = this.props.progress;
        // this.setState({
        //     progress: loadingProgress,
        // })
        // console.log(this.props);

    }


    render() {

        const { classes } = this.props;

        return (
            <div className={classes.root}>

                <Backdrop open={true} className={classes.backdrop}>

                    <Grid container alignItems="center" justifyContent="center" direction="row" >
                        <Grid item>
                            <img src={"/images/fan.png"} className={classes.spinnerStyles}/>
                            <Typography 
                                variant="subtitle2" 
                                component="div" 
                                className={classes.loadingText}
                            >
                                Loading...
                            </Typography>
                        </Grid>
                    </Grid>

                </Backdrop>
                
            </div>
        )
    }
}

export default withStyles(styles)(LoadingScreen)