import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { alpha, withStyles } from '@material-ui/core/styles';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import axios from 'axios';
import { Alert } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AuthService from '../../../services/AuthService';
import LoadingScreen from '../../common/LoadingScreen';

const styles = (theme) => ({
  table: {
    // minWidth: 650,
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
      color: '#2590BE',
    },
  },
  activeButtonIcon: {
    color: '#0B9D16',
  },
  deActiveButtonIcon: {
    color: '#EDAA26',
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
    maxHeight: 440,
  },
  root: {
    width: '100%',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
    border: '1px solid',
    borderRadius: '5px',
    padding: theme.spacing(0, 2),
    marginRight: '20px',
  },
  dialogcontentdiv: {
    marginTop: '5px',
    marginBottom: '100px',
  },
  dialogbox: {},
});

const initialState = {
  isLargeScreen: true,
  loading: false,
  orders: [],
  message: '',
  variant: '',
  snackbar: false,
  //dialog box data
  dialogBoxData: {
    orderItems: [],
    deliveryDetails: {},
  },
  dialogBoxOpen: false,
  searchName: '',
};

class Order_history extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  cancelOrder(id) {}

  trackOrder(id) {}

  viewItems = (order) => {
    // console.log(order._id)
    window.location.href = `/orders/${order._id}`;
  };

  dialogBoxClose = () => {
    this.setState({
      dialogBoxOpen: false,
    });
  };

  closeSnackBar = (event, response) => {
    this.setState({
      snackbar: false,
    });
  };

  async componentDidMount() {
    var ordersArr = [];
    var messageRes = '';
    var variantRes = '';
    var snackbarRes = true;

    this.setState({
      loading: true,
    });

    var res = await AuthService.getUserData();
    var id = res.userData._id;
    // console.log('res---------------' + id);

    // console.log(res.userData._id);
    await axios
      .post('/api/orders/user/' + id)
      .then((res) => {
        // console.log(res.data.orders /*.orders[0].orderItems[0].name*/);

        if (res.status == 200) {
          if (res.data.success) {
            snackbarRes = false;
            ordersArr = res.data.orders;
            // console.log(ordersArr);
          } else {
            messageRes = res.data.message;
            variantRes = 'error';
          }
        } else {
          messageRes = res.data.message;
          variantRes = 'error';
        }
      })
      .catch((error) => {
        console.log('Error:', error);
        variantRes = 'error';
        messageRes = error.message;
      });

    this.setState({
      message: messageRes,
      orders: ordersArr,
      variant: variantRes,
      snackbar: snackbarRes,
      loading: false,
    });
    // console.log(this.state.orders);
  }

  render() {
    const { classes } = this.props;

    return (
      <div align="center" style={{ paddingLeft: 100 }}>
        {this.state.loading ? (
          <div>
            <LoadingScreen></LoadingScreen>
          </div>
        ) : (
          <div>
            <Grid
              container
              alignItems="center"
              justify="center"
              direction="column"
            >
              <Grid item xs={12} md={12}>
                <Typography variant="h3" className="py-3">
                  My Orders
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
                ></div>
              </Grid>

              <Grid item xs={12} md={12}>
                <Paper className={classes.root}>
                  <TableContainer className={classes.container}>
                    <Table
                      className={classes.table}
                      stickyHeader
                      aria-label="sticky table"
                      size="medium"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Paid Status</TableCell>
                          <TableCell>Delivery Status</TableCell>
                          <TableCell>Total Amount</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {this.state.orders.map((row, key) => (
                          <TableRow key={key} hover>
                            <TableCell className={classes.tableCell}>
                              {row._id}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {row.isPaid ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {row.isDelivered ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              {row.deliveryDetails.totalAmount}
                            </TableCell>
                            <TableCell className={classes.tableCell}>
                              <Tooltip title="View Items" arrow>
                                <VisibilityIcon
                                  className={classes.editButtonIcon}
                                  onClick={() => this.viewItems(row)}
                                ></VisibilityIcon>
                              </Tooltip>
                              <Tooltip title="Track Order" arrow>
                                <GpsFixedIcon
                                  className={classes.deleteButtonIcon}
                                  // onClick={() => this.deleteuser(row._id)}
                                ></GpsFixedIcon>
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
                  name="snackBar"
                >
                  <Alert
                    severity={this.state.variant}
                    onClose={this.closeSnackBar}
                  >
                    {this.state.message}
                  </Alert>
                </Snackbar>
              )}
            </Grid>

            {/* //dialogBox */}
            <Dialog open={this.state.dialogBoxOpen}>
              <DialogTitle>
                Order ID : {this.state.dialogBoxData._id}
              </DialogTitle>
              <hr />
              <DialogContent className={classes.dialogcontent}>
                <div className={classes.dialogcontentdiv}>
                  {this.state.dialogBoxData.orderItems.map((row) => (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>{row.name}</div>
                      <div>{row.price}</div>
                    </div>
                  ))}
                </div>
              </DialogContent>

              <DialogActions>
                <Button onClick={this.dialogBoxClose}>close</Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </div>
    );
  }
}

// export default ViewUsers;
export default withStyles(styles)(Order_history);
