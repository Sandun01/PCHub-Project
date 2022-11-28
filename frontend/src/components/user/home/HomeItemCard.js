import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Card, CardActionArea, CardContent, Typography,
} from '@material-ui/core'

const styles = (theme) =>({
    root: {
        maxWidth: 320,
        minWidth: 320,
        margin: '20px',
        textAlign: 'center', 
        backgroundColor: 'transparent',
        color: '#fff',
        border:'1px solid #fff',
        // padding: 5,
        '&:hover':{
            backgroundColor: '#fff',
            color: '#000',
            cursor:'pointer',
        },
    },
    image: {
        height: 300,
        width: 300,
    },

})

class HomeItemCard extends Component {

    constructor(props){
        super(props);
        this.state = {
            _id: this.props.data._id,
            item_image: this.props.data.item_image,
            item_name: this.props.data.item_name,
            item_description: this.props.data.item_description,
        }
    }

    componentDidMount(){
    }
    
    navigateToSingleViewPage = () => {
        window.location.href = '/product/'+this.state._id;
    }

    render() {
        
        const {classes} = this.props;

        return (
            
            <div>
                <Card className={classes.root} onClick={this.navigateToSingleViewPage}>
                    <img src={this.state.item_image} className={classes.image} alt={this.state.item_name} />
                    <CardActionArea>
                        <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                                {this.state.item_name}
                            </Typography>
                            <Typography variant="body2" component="p">
                                {this.state.item_description.substring(0, 50).concat("...")}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        )
    }
}

export default withStyles(styles)(HomeItemCard);