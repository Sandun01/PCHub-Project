import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Grid,
  Typography,
  Paper,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Snackbar,
  TablePagination,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Loader from '../common/Loader'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import ProductServices from '../../services/ProductServices'
import { Alert } from '@material-ui/lab'
import OrderServices from '../../services/OrderServices'

const styles = (theme) => ({
  table: {
     minWidth: 550,
  },
  FaClipboardCheck: {
    
    '&:hover': {
        color: '#0CD1BF',
    },
  },
  deleteButtonIcon: {
    color: '#B8BFBE',
    '&:hover': {
      color: '#C91212',
    },
  },
  activeButtonIcon: {
    color: '#0B9D16',
  },
  deActiveButtonIcon: {
    color: '#EDAA26',
  },
  reportBtn:{
    margin: '2rem',
    
  },
  tableHeader: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: '1rem',
  },
  tableHeaderRow: {
    backgroundColor: '#fff',
  },
  tableCell: {
    padding: 30,
    fontSize: '1rem',
  },
  container: {
    maxHeight: 520,
    maxWidth: 1300,
  },
  root: {
    width: '100%',
  },
})

const initialState = {
  isLargeScreen: true,
  loading: false,
  deliveries: [],
  message: '',
  variant: '',
  snackbar: false,
}

class viewDeliveries extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
    this.deleteproduct = this.deleteproduct.bind(this)
    this.calcTotPrice = this.calcTotPrice.bind(this)
  }

  async deleteproduct(id) {
    var result = window.confirm('Are Sure You Want to delete?')

    if (result) {
      var snackbarRes = true
      await 
         ProductServices.deleteProduct(id)
        .then((res) => {
          // console.log(res);
          if (res.status == 200 && res.data.success === true) {  
              
              this.setState({
                message: 'Product was successfully deleted!',
                variant: 'success',
                snackbar: false,
              })
              setTimeout(() => {
                window.location.reload(false)
              }, 2000)
      
          } else {
            this.setState({
              message: res.data.message,
              variant: 'error',
              snackbar: false,
            })
          }
        })
        .catch((error) => {
          this.setState({
            message: error.message,
            variant: 'error',
            snackbar: snackbarRes,
          })
        })
     
    }
  }

  closeSnackBar = (event, response) => {
    this.setState({
      snackbar: false,
    })
  }

  //generate pdf
  generatePDF = async() => {
        
    this.setState({
        loading: true,
    })

    var data = {
        "items": this.state.products,
    }

    console.log("items", data);

    await ProductServices.generateAllproductsReport(data)
    .then( res => {
        if(res === 1){
            this.setState({
                loading: false,
                snackbar: true,
                variant: 'success',
                message: 'Generate PDF Success!',
            })
        }
        else{
            console.log('error');
            this.setState({
                loading: false,
                snackbar: true,
                variant: 'error',
                message: 'Error in Generating PDF!',
            })
        }
    })
    .catch(err => {
        console.log(err);
        this.setState({
            loading: false,
            snackbar: true,
            variant: 'error',
            message: 'Error in Generating PDF!',
        })
    })

}

  async componentDidMount() {
    var deliveriesArr = []
    var messageRes = ''
    var variantRes = ''
    var snackbarRes = true

    //calling product services
    await OrderServices.getAlldeliveries()
      .then((res) => {
        // console.log(res);

        if (res.status == 200) {
          if (res.data.success) {
            snackbarRes = false
            deliveriesArr = res.data.data
          } else {
            messageRes = res.data.message
            variantRes = 'error'
          }
        } else {
          messageRes = res.data.message
          variantRes = 'error'
        }
      })
      .catch((error) => {
        console.log('Error:', error)
        variantRes = 'error'
        messageRes = error.message
      })

    this.setState({
      message: messageRes,
      deliveries: deliveriesArr,
      variant: variantRes,
      snackbar: snackbarRes,
    })
    console.log(this.state.deliveries)
  }

  calcTotPrice(orderItems){
    var tot=null;
    orderItems.map((item, index)=>{
        tot += item.price*item.qty
    })
    return tot

  }

  render() {
    const { classes } = this.props

    return (
      <div style={{ padding: 20 }}>
        <Grid container alignItems='center' justify='center' direction='column'>
          <Grid item xs={12} md={12}>
            <Typography variant='h4' className='py-3'>
              All Deliveries
            </Typography>
          </Grid>

          <Grid item xs={12} md={12}>
            <div
              style={{
                marginBottom: 20,
                padding: 10,
                position: 'relative',
                float: 'right',
              }}
            >
              <Link to='/admin/Item'>
                <button type='button' className='btn btn-outline-primary'>
                todo
                </button>
              </Link>
              
                <button type='button' className='btn btn-outline-warning' style={{margin: 20}} onClick={() => this.generatePDF()}>
                  todo
                </button>
              
            </div>
          </Grid>

          <Grid item xs={12} md={12}>
            <Paper className={classes.root}>
              <TableContainer className={classes.container}>
                <Table
                  className={classes.table}
                  stickyHeader
                  aria-label='sticky table'
                  size='medium'
                  
                >
                  <TableHead>
                    <TableRow className={classes.tableHeaderRow}>
                      <TableCell className={classes.tableHeader} align='center'>
                        customer 
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        address 
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        items 
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Price 
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        approve todo
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        delete todo
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        status todo
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {this.state.deliveries.map((row) => (
                      <TableRow key={row._id} hover>
                        <TableCell className={classes.tableCell}>
                          {row.user.fname+ " "+ row.user.lname}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {row.deliveryDetails.addressLine1}
                          {row.deliveryDetails.addressLine2}
                          {row.deliveryDetails.city}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {row.orderItems.map((item,index)=>(
                            <Grid container className={classes.itemContainer}>
                                <Grid item xs={10} sm={10}>
                                    {(index+1)+") "+item.name+"  x" +item.qty}
                                </Grid>
                            </Grid>
                          ))}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {"Rs."+this.calcTotPrice(row.orderItems)}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          
                          <Tooltip title='Approve' arrow>
                            
                            <EditIcon
                            onclick//todo
                            className={classes.FaClipboardCheck}
                          ></EditIcon>
                            
                          </Tooltip>
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          
                          <Tooltip title='Delete' arrow>
                            <DeleteIcon
                              className={classes.deleteButtonIcon}
                              onClick//todo
                            ></DeleteIcon>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                        {row.isActive? "approved": "not approved"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {this.state.message != '' && (
            <Snackbar
              open={this.state.snackbar}
              autoHideDuration={2500}
              onClose={this.closeSnackBar}
              name='snackBar'
            >
              <Alert severity={this.state.variant} onClose={this.closeSnackBar}>
                {this.state.message}
              </Alert>
            </Snackbar>
          )}
        </Grid>
      </div>
    )
  }
}

// export default ViewItems;
export default withStyles(styles)(viewDeliveries)
