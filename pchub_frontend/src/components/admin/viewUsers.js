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
import axios from 'axios'
import { Alert } from '@material-ui/lab'

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
      color: '#C91212',
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
})

const initialState = {
  isLargeScreen: true,
  loading: false,
  users: [],
  message: '',
  variant: '',
  snackbar: false,
}

class ViewUsers extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
    this.deleteuser = this.deleteuser.bind(this)
  }

  deleteuser(id) {
    var result = window.confirm('Are Sure You Want to delete?')

    if (result) {
      var messageRes = ''
      var variantRes = ''
      var snackbarRes = true

      axios
        .delete('http://localhost:5000/api/users/' + id)
        .then((res) => {
          // console.log(res);
          if (res.status == 200) {
            if (res.data.success) {
              snackbarRes = false
              window.location.reload(false)
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
          //console.log("Error:",error);
          variantRes = 'error'
          messageRes = error
        })

      this.setState({
        message: messageRes,
        variant: variantRes,
        snackbar: snackbarRes,
      })
    }
  }

  closeSnackBar = (event, response) => {
    this.setState({
      snackbar: false,
    })
  }

  async componentDidMount() {
    var usersArr = []
    var messageRes = ''
    var variantRes = ''
    var snackbarRes = true

    //get data from db
    await axios
      .get('http://localhost:5000/api/users')
      .then((res) => {
        // console.log(res);

        if (res.status == 200) {
          if (res.data.success) {
            snackbarRes = false
            usersArr = res.data.users
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
      users: usersArr,
      variant: variantRes,
      snackbar: snackbarRes,
    })
  }

  render() {
    const { classes } = this.props

    return (
      <div align="center" style={{ paddingLeft: 100 }}>
        <Grid container alignItems='center' justify='center' direction='column'>
          <Grid item xs={12} md={12}>
            <Typography variant='h4' className='py-3'>
              All Users
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
              <Link to='/admin/'>
                <button type='button' className='btn btn-outline-primary'>
                  Add New User
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
                        First Name
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Last Name
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Email
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Is Admin
                      </TableCell>
                      <TableCell className={classes.tableHeader} align='center'>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {this.state.users.map((row) => (
                      <TableRow key={row.fname} hover>
                        <TableCell className={classes.tableCell}>
                          {row.fname}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {row.lname}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {row.email}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {row.isAdmin}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <Tooltip title='Edit' arrow>
                            <Link to={'/admin/addUser' + row._id}>
                              <EditIcon
                                className={classes.editButtonIcon}
                              ></EditIcon>
                            </Link>
                          </Tooltip>
                          <Tooltip title='Delete' arrow>
                            <DeleteIcon
                              className={classes.deleteButtonIcon}
                              onClick={() => this.deleteuser(row._id)}
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

// export default ViewUsers;
export default withStyles(styles)(ViewUsers)
