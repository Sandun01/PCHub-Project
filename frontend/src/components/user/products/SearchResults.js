import React, { Component } from 'react'
import { 
    Grid, Typography,
} from '@material-ui/core'

import axios from 'axios'
import { BackendApi_URL } from '../../utils/AppConst'
import Pagination from '@material-ui/lab/Pagination'
import { withStyles } from '@material-ui/core/styles'

import ItemCard from '../home/ItemCard'
import LoadingScreen from '../../common/LoadingScreen'
import SearchNotFound from './SearchNotFound'

const styles = (theme) =>({

    root:{
        display: 'block',
        width: '100%',
    },
    itemContainer:{
        opacity: 1,
        animation: '$customFade 2s linear',
    },
    "@keyframes customFade":{
        "0%":{ 
            opacity: 0,
        },
        "100%":{ 
            opacity: 1,
        }
    },
    header:{
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
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

class SearchResults extends Component {

    constructor(props){
        super(props);
        this.state = {

            //filter data
            filterData: {
                name: null,
            },
            pagination: {
                noPerPage: 6,
                pageNumber: 1,
            },
            pagination_itemCount: 0,
            noOfResults: 0,

            //results
            items: [],

            //page
            loading: true,
            haveData: false,

        }
    }

    handleChangePage = async(event, page) => {
        const pageNew = page;
        const pageInfo = this.state.pagination;

        pageInfo['pageNumber'] = pageNew;

        this.setState({
            pagination: pageInfo,
        })

        this.loadData();
        // console.log('Page No', pageInfo);
    }

    async loadData(){

        this.setState({
            loading: true,
        })

        const fData = {
            filterData: this.state.filterData,
            pagination: this.state.pagination,
        };
        
        //load filtered data
        await axios.post( BackendApi_URL+"/products/search",fData)
        .then(res => {

            console.log(res);

            if(res.status === 200 && res.data.success){
                
                var total = res.data.totResults;
                
                //set pagination
                var arrItems = res.data.products;
                var len = arrItems.length;                
                var cPage = this.state.pagination.pageNumber;
                var perPage = this.state.pagination.noPerPage;
                var remResults = total - (cPage * perPage);

                var noOfPages =  0;
                if(remResults > 0){
                    noOfPages = Math.round(total / len);
                    noOfPages = noOfPages + 1;
                }
                else if(remResults === 0){
                    noOfPages = Math.round(total / len);
                }
                else{
                    noOfPages = cPage;
                }

                // console.log("Pages:", remResults, noOfPages);

                setTimeout(() => {
                    this.setState({
                        items: arrItems,
                        noOfResults: total,
                        pagination_itemCount: noOfPages,
                        haveData: true,
                        loading: false,
                        pagination: fData.pagination,
                    })
                }, 1000)
            }
            else{
                this.setState({
                    haveData: false,
                    loading: false,
                })
            }

            // console.log(this.state);

        })
        .catch(error => {
            console.log(error)
        })

    }

    async componentDidMount(){

        //get name
        const productName = this.props.match.params.name; 
        // console.log(productName);

        const data = this.state.filterData;
        data["name"] = productName;
        
        this.setState({
            filterData: data,
        })

        //load data
        this.loadData();

    }

    render() {
        const { classes } = this.props;
        
        return (

            <div className={classes.root}>

                {
                    this.state.loading ? 
                    <div>
                        <LoadingScreen />
                    </div>
                    :
                    this.state.loading === false && this.state.haveData === false ?
                    <div>
                        <SearchNotFound />
                    </div>
                    :
                    <div className={classes.itemContainer}>

                        {/* All items */}
                        <Grid container>
                            
                            <Grid item xs={12} sm={12} className={classes.header}>
                                <Typography variant="h4" className="pt-3">
                                    Search Results For: "{   this.state.filterData.name }"
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <Grid container justifyContent="center" alignItems="center" direction="row">
                                    {
                                        this.state.items.map((itm, key) => (
                                            <Grid item key={itm.item_name}>
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
                                    count={this.state.pagination_itemCount}
                                    // variant="outlined"
                                    page={ this.state.pagination.pageNumber }
                                    onChange={this.handleChangePage}
                                    color="primary" 
                                />
                            </Grid>
                        </Grid>
                    </div>

                }


            </div>
        )
    }
}

export default withStyles(styles)(SearchResults);