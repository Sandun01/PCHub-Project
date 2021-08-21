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
            id: 0,
            src: this.props.data.src,
            title: this.props.data.title,
            description: this.props.data.description,
        }
    }

    componentDidMount(){

    }
    
    navigateToSingleViewPage = () => {
        window.location.href = '/product/'+this.state.id;
    }

    render() {
        
        const {classes} = this.props;

        return (
            
            <div>
                <Card className={classes.root} onClick={this.navigateToSingleViewPage}>
                    <img src={this.state.src} className={classes.image} alt={this.state.imgTitle} />
                    <CardActionArea>
                        <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                                {this.state.title}
                            </Typography>
                            <Typography variant="body2" component="p">
                                {this.state.description}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        )
    }
}

export default withStyles(styles)(HomeItemCard);