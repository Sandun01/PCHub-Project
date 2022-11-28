import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Card, Typography } 
from '@material-ui/core'

const styles = (theme) =>({
    root: {
        minWidth: 320,
        maxWidth: 320,
        margin: '20px',
        backgroundColor: '#336290',
        color: '#fff',
        textAlign: 'center',
        padding: 20,
    },
    image: {
        marginBottom: 10,
    },
})

class StaticBoxCard extends Component {

    constructor(props){
        super(props);
        this.state = {
            src: this.props.data.src,
            title: this.props.data.title,
            imgTitle: this.props.data.imgTitle,
            description: this.props.data.description,
        }
        // console.log(this.props.data);
    }

    render() {
        
        const {classes} = this.props;

        return (
            
            <div>
                <Card className={classes.root}>
                    <img src={this.state.src} className={classes.image} alt={this.state.imgTitle} />
                    <Typography variant="h6">
                        {this.state.title}
                    </Typography>
                    <Typography variant="body2">
                        {this.state.description }
                    </Typography>
                    <Typography variant="body2">
                        ( Conditions Applied )
                    </Typography>
                </Card>
            </div>
        )
    }
}

export default withStyles(styles)(StaticBoxCard);