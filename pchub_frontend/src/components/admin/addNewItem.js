import React, { Component } from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { Button, Grid, Typography } from '@material-ui/core'
import Loader from '../common/Loader'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { LeftNavBarData } from '../utils/LeftNavBarData'
import { Autocomplete, Alert } from '@material-ui/lab'
import { storage } from '../../firebase/firebase'

const styles = (theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },

  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },

  inputElement: {
    paddingLeft: 10,
    paddingRight: 10,
    minWidth: '360px',
  },
  linkText: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      color: '#DDC545',
    },
  },
})

const initialState = {
  variant: '',
  message: '',
  loading: false,
  imageFile: '',

  formData: {
    item_name: '',
    item_image: '',
    item_description: '',
    category: '',
    rating: '',
    price: '',
    countInStock: '',
  },
}
class AddNewItem extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
    this.formSubmit = this.formSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
    this.setSelectedValue = this.setSelectedValue.bind(this)
  }

  async formSubmit(e) {
    e.preventDefault()

    this.setState({
      loading: true,
    })

    const uploadTask = storage
      .ref(`images/${this.state.imageFile.name}`)
      .put(this.state.imageFile)

    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        console.log(error)
      },
      () =>
        storage
          .ref('images')
          .child(this.state.imageFile.name)
          .getDownloadURL()
          .then((url) => {
            var name = 'item_image'
            var value = url
            var data = this.state.formData
            data[name] = value

            this.setState({
              formData: data,
            })

            this.createItem(data)
          })
    )
  }

  async createItem(data) {

    //console.log(this.state);
    var messageRes = null
    var variantRes = null
    
    axios
      .post('http://localhost:5000/api/products', data)
      .then((res) => {
        if (res.status == 201) {
          messageRes = 'Successfully Inserted!'
          variantRes = 'success'

          setTimeout(() => {
            window.location.href = '/admin/viewItems'
          }, 1000)
        } else {
          //console.log(res)
          messageRes = res.error
          variantRes = 'error'
        }
      })
      .catch((error) => {
        // error.response.data.message : error.message
        console.log(error)
        messageRes = error.message
        variantRes = 'error'
      })

    setTimeout(() => {
      this.setState({
        message: messageRes,
        variant: variantRes,
        loading: false,
      })
    }, 2000)
  }

  handleChange = (e) => {
    var name = e.target.name
    var value = e.target.value
    var data = this.state.formData

    data[name] = value

    this.setState({
      formData: data,
    })
    console.log(this.state)
  }

  fileSelectedHandler = (e) => {
    this.state.imageFile = e.target.files[0]
    console.log('image file', this.state.imageFile)

    console.log(this.state)
  }

  setSelectedValue = (name, value) => {
    var data = this.state.formData
    data[name] = value

    this.setState({
      formData: data,
    })

    console.log(this.state)
  }

  render() {
    const { classes } = this.props
    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h4' align='center'>
            Add New item
          </Typography>
          {/* Loading */}
          {this.state.loading && <Loader />}

          <ValidatorForm onSubmit={this.formSubmit}>
            <Grid
              container
              alignItems='center'
              justify='center'
              direction='column'
            >
              <Grid item xs={12} md={12} className={classes.inputElement}>
                <TextValidator
                  className='mt-5'
                  placeholder='Name'
                  helperText='Product Name'
                  variant='outlined'
                  size='small'
                  fullWidth
                  type='text'
                  name='item_name'
                  value={this.state.formData.item_name}
                  onChange={(e) => this.handleChange(e)}
                  validators={['required']}
                  errorMessages={['This field is required']}
                />
              </Grid>

              <Grid item xs={12} md={12} className={classes.inputElement}>
                <TextValidator
                  className='mt-4'
                  placeholder='Description'
                  helperText='Product description'
                  variant='outlined'
                  size='small'
                  fullWidth
                  type='text'
                  name='item_description'
                  value={this.state.formData.item_description}
                  onChange={(e) => this.handleChange(e)}
                  validators={['required']}
                  errorMessages={[
                    'This field is required',
                    'Email is not valid',
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={12} className={classes.inputElement}>
                <TextValidator
                  className='mt-4'
                  placeholder='Image'
                  helperText='Product Image'
                  variant='outlined'
                  size='small'
                  fullWidth
                  type='file'
                  name='item_image'
                  onChange={(e) => this.fileSelectedHandler(e)}
                />
              </Grid>

              <Grid item xs={12} md={12} className={classes.inputElement}>
                <TextValidator
                  className='mt-4'
                  placeholder='Price (LKR)'
                  helperText='Enter price'
                  variant='outlined'
                  size='small'
                  fullWidth
                  type='number'
                  name='price'
                  value={this.state.formData.price}
                  onChange={(e) => this.handleChange(e)}
                  validators={['required']}
                  errorMessages={[
                    'Price is required!',
                    'Please enter valid Price',
                  ]}
                />
              </Grid>

              <Grid item xs={12} md={12} className={classes.inputElement}>
                <Autocomplete
                  className='mt-4'
                  fullWidth
                  type='text'
                  options={LeftNavBarData}
                  getOptionLabel={(opt) => opt.title}
                  name='category'
                  size='small'
                  // value={{value: this.state.formData.category}}
                  onChange={(e, v) =>
                    this.setSelectedValue(
                      'category',
                      v == null ? null : v.title
                    )
                  }
                  renderInput={(params) => (
                    <TextValidator
                      {...params}
                      variant='outlined'
                      placeholder='Select Category'
                      helperText='Select Category'
                      value={
                        this.state.formData.category == ''
                          ? ''
                          : this.state.formData.category
                      }
                      validators={['required']}
                      errorMessages={['Category is required!']}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={12} className={classes.inputElement}>
                <TextValidator
                  className='mt-4'
                  placeholder='Count In Stock'
                  helperText='Enter the Count in Stock'
                  variant='outlined'
                  size='small'
                  fullWidth
                  type='number'
                  name='countInStock'
                  value={this.state.formData.countInStock}
                  onChange={(e) => this.handleChange(e)}
                  validators={['required']}
                  errorMessages={['This field is required']}
                />
              </Grid>

              {this.state.message != '' && (
                <Grid item xs={12} md={12}>
                  <Alert
                    severity={this.state.variant}
                    style={{ maxWidth: '360px' }}
                  >
                    <Typography>{this.state.message}</Typography>
                  </Alert>
                </Grid>
              )}

              <Grid item xs={12} md={12}>
                <div className='text-center my-3'>
                  <Button variant='contained' color='primary' type='submit'>
                    Submit
                  </Button>
                </div>
              </Grid>
            </Grid>
          </ValidatorForm>
        </Paper>
      </main>
    )
  }
}
export default withStyles(styles)(AddNewItem)
