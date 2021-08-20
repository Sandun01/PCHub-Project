import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';

import { 
    Grid, Typography, 
} from '@material-ui/core'


const styles = (theme) => ({

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
        }

    }

    componentDidMount(){

    }

    render() {
        const { classes } = this.props;

        return (
            <div>
               Cart
            </div>
        )
    }
}

export default withStyles(styles)(Cart);