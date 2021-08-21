import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

const styles = (theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
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
})

const initialState = {
  isLargeScreen: true,
  variant: '',
  message: '',
  loading: false,
  dialogBox: false,

  formData: {
    item_name: '',
    item_image: '',
    venue: '',
    startDate: '',
    endDate: '',
    selection: '',
  },
}
class AddNewItem extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  handleChange(event, index, value) {
    //set selection to the value selected
    this.setState({ selection: value })
  }

  render() {
    const { classes } = this.props
    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h4' align='center'>
            Add New item
          </Typography>
          <React.Fragment>
            <Typography variant='h6' gutterBottom>
              Item Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id='item_name'
                  name='item_name'
                  label='Item Name'
                  fullWidth
                  autoComplete='given-product'
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputLabel id='demo-simple-select-label'>Category</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  fullWidth
                  value={this.state.selection}
                  onChange={this.handleChange}
                >
                  <MenuItem value={'English'}>English</MenuItem>
                  <MenuItem value={'Spanish'}>Spanish</MenuItem>
                  <MenuItem value={'French'}>French</MenuItem>
                  <MenuItem value={'English'}>English</MenuItem>
                  <MenuItem value={'Spanish'}>Spanish</MenuItem>
                  <MenuItem value={'French'}>French</MenuItem>
                  <MenuItem value={'English'}>English</MenuItem>
                  <MenuItem value={'Spanish'}>Spanish</MenuItem>
                  <MenuItem value={'French'}>French</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id='item_description'
                  name='item_description'
                  label='Description'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id='price'
                  name='price'
                  label='Unit Price'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id='countInStock'
                  name='countInStock'
                  label='Stock Quantity'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id='item_image'
                  name='item_image'
                  label='Image'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id='zip'
                  name='zip'
                  label='Zip / Postal code'
                  fullWidth
                />
              </Grid>
            </Grid>
          </React.Fragment>
        </Paper>
      </main>
    )
  }
}
export default withStyles(styles)(AddNewItem)
