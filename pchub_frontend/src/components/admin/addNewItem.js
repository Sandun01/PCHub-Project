import React, { Component } from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { Button, Grid, Typography } from '@material-ui/core'
import Loader from '../common/Loader'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import ProductServices from '../../services/ProductServices'
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
  formtype: '',
  btnText:'',
 

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
    var pId = this.props.match.params.id;
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
            if(!pId){
            this.createItem(data)
            }else{
            this.updateItem(pId,data)  
            }
          })
    )
  }

  async loadData(id){
    var productbyID;
    var messageRes = '';
    var variantRes = '';

    //get data from db
    await ProductServices.getproductByID(id)
    .then(res => {
        //console.log(res);
        if(res.status == 200){
            if(res.data.success){
                messageRes = res.data.message;
                variantRes = "success";
                productbyID = res.data.product;
                console.log("Product by ID", res);
            }
            else{
                messageRes = res.data.message;
                variantRes = "error";
            }
        }
        else{
            messageRes = res.data.message;
            variantRes = "error";
        }
    })
    .catch(error => {
        console.log("Error:",error)
        variantRes = "error";
        messageRes = error.message;
    })

    this.setState({
        message: messageRes,
        formData: productbyID,
        variant: variantRes,
        id: id,
    })

}

  async createItem(data) {

    
    await ProductServices.addNewProduct(data)
      .then((res) => {
        if (res.status == 201 && res.data.success === true) {
          
          this.setState({
            message: 'Product was successfully inserted!',
            variant: 'success',
            loading: false,
          })

          setTimeout(() => {
            window.location.href = '/admin/viewItems'
          }, 2000)
        } else {
          //console.log(res)
          this.setState({
            message: res.error,
            variant: 'error',
            loading: false,
          })
        }
      })
      .catch((error) => {
        console.log(error)
        this.setState({
          message: error.message,
          variant: 'error',
          loading: false,
        })
      })

  }

  async updateItem(id,data){
      await ProductServices.updateProduct(id,data)
      .then((res) => {
        if (res.status == 200 && res.data.success === true) {
          
          this.setState({
            message: 'Product was Updated inserted!',
            variant: 'success',
            loading: false,
          })

          setTimeout(() => {
            window.location.href = '/admin/viewItems'
          }, 2000)
        } else {
          //console.log(res)
          this.setState({
            message: res.error,
            variant: 'error',
            loading: false,
          })
        }
      })
      .catch((error) => {
        console.log(error)
        this.setState({
          message: error.message,
          variant: 'error',
          loading: false,
        })
      })
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

  componentDidMount(){

    //load data from database
    var pId = this.props.match.params.id;
    if(!pId){
      this.setState({
        formtype: 'Add New Product',
        btnText:'SUBMIT',
    })
    }else{
      this.loadData(pId);
      this.setState({
        formtype: 'Edit Product',
        btnText:'UPDATE',
    })
    }
}

  render() {
    const { classes } = this.props
    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h4' align='center'>
            {this.state.formtype}
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
                  helperText='Enter price (LKR)'
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
                  {this.state.btnText}
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
