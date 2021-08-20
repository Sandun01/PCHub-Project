import React, { Component } from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import { Button, Grid, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { Alert } from '@material-ui/lab'
import axios from 'axios'


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
  },
}

export default class AddNewItem extends Component {
  render() {
    return (
      <div>
        I will create a one 
      </div>
    )
  }
}
