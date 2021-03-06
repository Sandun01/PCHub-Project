import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography,
} from '@material-ui/core'

// import { Link } from 'react-router-dom'

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
            backgroundColor: '#E9E9E9',
            color: '#000',
            cursor:'pointer',
        },
    },
    priceText: {
        fontWeight: 'bold',
        padding: 5,
    },
    inStockText: {
        // color: '#000',
        // border:'1px solid #2D8000',
        padding: 5,
        fontWeight: 'bold',
        backgroundColor:'#2D8000',
    },
    outStockText: {
        // color: '#000',
        // border:'1px solid #BB0000',
        padding: 5,
        fontWeight: 'bold',
        backgroundColor:'#A40000',
    },
    image: {
        height: 300,
        width: 300,
    },

})

class ItemCard extends Component {

    constructor(props){
        super(props);
        this.state = {
            _id: this.props.data._id,
            item_image: this.props.data.item_image,
            item_name: this.props.data.item_name,
            price: this.props.data.price,
            category: this.props.data.category,
            countInStock: this.props.data.countInStock,
            published: false,
            // description: this.props.data.description,
        }
    }

    navigateToSingleViewPage = () => {
        window.location.href = '/product/'+this.state._id;
    }

    componentDidMount(){

    }

    render() {
        
        const {classes} = this.props;

        return (
            
            // <Link to={"/product"+this.state._id}>
            <div>
                <Card className={classes.root} onClick={this.navigateToSingleViewPage}>
                    {
                        this.state.item_image ?
                        <img src={this.state.item_image} className={classes.image} alt={this.state.item_name} />
                        :
                        <img src={"/images/imageNotAvailable.png"} height="300px" width="300px" alt={this.state.item_name} />
                    }
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.state.item_name}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {this.state.category}
                        </Typography>
                        <Typography variant="h5" component="h2" className={classes.priceText}>
                            Rs.{this.state.price}
                        </Typography>
                    </CardContent>
                    {
                        this.state.countInStock > 0 ?
                        <div className={classes.inStockText}>
                            In Stock
                        </div>
                        :
                        <div className={classes.outStockText}>
                            Out of Stock
                        </div>
                    }
                </Card>
            </div>
        )
    }
}

export default withStyles(styles)(ItemCard);