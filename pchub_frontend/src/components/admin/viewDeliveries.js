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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

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
    this.deleteOrder = this.deleteOrder.bind(this)
    this.calcTotPrice = this.calcTotPrice.bind(this)
    
  }

  async deleteOrder(id) {
    var result = window.confirm('Are Sure You Want to delete?')

    if (result) {
      var snackbarRes = true
      await 
         OrderServices.deleteOrderById(id)
        .then((res) => {
          // console.log(res);
          if (res.status == 200 && res.data.success === true) {  
              
              this.setState({
                message: 'Order was successfully deleted!',
                variant: 'success',
                snackbar: true,
              })
              setTimeout(() => {
                window.location.reload(false)
              }, 2000)
      
          } else {
            this.setState({
              message: res.data.message,
              variant: 'error',
              snackbar: true,
            })
          }
        })
        .catch((error) => {
          this.setState({
            message: error.message,
            variant: 'error',
            snackbar: true,
          })
        })
     
    }
  }
  calcTotPrice(orderItems){
    var tot=null;
    orderItems.map((item, index)=>{
        tot += item.price*item.qty
    })
    return tot

  }


  updateDeliveryDetails = async (id, deliveryStatus, paidStatus) =>
  { 
     console.log("asasas");
      if(id){
        
        var data = {
         
                  "id":id,
                  "deliveryStatus": deliveryStatus,
                  "paidStatus": paidStatus,
                
               
               
      }
      await OrderServices.updateDeliveryDetails(data)        
      .then((res) => {
        // console.log(res);
        if (res.status == 200 && res.data.success === true) {  
            
            this.setState({
              message: 'Order was successfully updated!',
              variant: 'success',
              snackbar: true,
            })
            setTimeout(() => {
              window.location.reload(false)
            }, 2000)
    
        } else {
          this.setState({
            message: res.data.message,
            variant: 'error',
            snackbar: true,
          })
        }
      })
      .catch((error) => {
        this.setState({
          message: error.message,
          variant: 'error',
          snackbar: true,
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


approveDelivery = (_id,isDelivered,isPaid)=>{
  if(isPaid === true){
    
    
    this.updateDeliveryDetails(_id,isDelivered,isPaid)
  }
  else  
  {this.setState({
    loading: false,
    snackbar: true,
    variant: 'error',
    message: 'can\'t approve delivery without payment!',
})}}


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
                        Customer 
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Address 
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Items 
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Price 
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Approve Delivery 
                      </TableCell>
                      
                      <TableCell className={classes.tableHeader} align='center'>
                        Approve Payment
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Delete 
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
                          
                          <Tooltip title='Approve Delivery' arrow>
                            
                            <EditIcon
                            onClick={() => {
                                this.approveDelivery(row._id,!row.isDelivered,row.isPaid)
                            }}
                            className={classes.FaClipboardCheck}
                          ></EditIcon>
                          
                            
                          </Tooltip>
                          {row.isDelivered? <CheckCircleIcon/>:<CancelIcon/> }
                      
                        
                        
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          
                          <Tooltip title='Approve Payment' arrow>
                            
                            <EditIcon
                            onClick={() => this.updateDeliveryDetails(row._id,row.isDelivered,!row.isPaid)}
                            className={classes.FaClipboardCheck}
                          ></EditIcon>
                          
                            
                          </Tooltip>
                          {row.isPaid? <CheckCircleIcon/>:<CancelIcon/> }
                      
                        
                        
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          
                        <Tooltip title='Delete' arrow>
                          <DeleteIcon
                            className={classes.deleteButtonIcon}
                            onClick={() =>this.deleteOrder(row._id)}
                          ></DeleteIcon>
                        </Tooltip>
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
