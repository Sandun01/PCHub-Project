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

const styles = (theme) => ({
  table: {
     minWidth: 550,
  },
  editButtonIcon: {
    color: '#0625C8',
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
  products: [],
  message: '',
  variant: '',
  snackbar: false,
}

class ViewItems extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
    this.deleteproduct = this.deleteproduct.bind(this)
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

  async componentDidMount() {
    var productsArr = []
    var messageRes = ''
    var variantRes = ''
    var snackbarRes = true

    //calling product services
    await ProductServices.getAllProducts()
      .then((res) => {
        // console.log(res);

        if (res.status == 200) {
          if (res.data.success) {
            snackbarRes = false
            productsArr = res.data.products
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
      products: productsArr,
      variant: variantRes,
      snackbar: snackbarRes,
    })
  }

  render() {
    const { classes } = this.props

    return (
      <div style={{ padding: 20 }}>
        <Grid container alignItems='center' justify='center' direction='column'>
          <Grid item xs={12} md={12}>
            <Typography variant='h4' className='py-3'>
              All products
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
                  Add New Product
                </button>
              </Link>
              <Link to='/admin/Item'>
                <button type='button' className={classes.reportBtn}>
                  Download Product Report
                </button>
              </Link>
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
                        Item Name
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Description
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Category
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Price
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Stock Qty
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {this.state.products.map((row) => (
                      <TableRow key={row.item_name} hover>
                        <TableCell className={classes.tableCell}>
                          {row.item_name}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {row.item_description}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {row.category}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {row.price}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {row.countInStock}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <Tooltip title='Edit' arrow>
                            <Link to={'/admin/Item/' + row._id}>
                              <EditIcon
                                className={classes.editButtonIcon}
                              ></EditIcon>
                            </Link>
                          </Tooltip>
                          <Tooltip title='Delete' arrow>
                            <DeleteIcon
                              className={classes.deleteButtonIcon}
                              onClick={() => this.deleteproduct(row._id)}
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
export default withStyles(styles)(ViewItems)
