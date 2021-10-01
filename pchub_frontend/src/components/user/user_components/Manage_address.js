import React, { Component } from 'react';
import { Container, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import AuthService from '../../../services/AuthService';
import { withStyles } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from 'axios';

const styles = (theme) => ({
  input: {
    margin: '5px 10px 20px 10px',
    width: '96%',
    backgroundColor: 'white',
    padding: '10px 20px 10px 20px',
    borderRadius: '3px',
  },
  label: {
    fontSize: '16px',
    marginLeft: '10px',
    color: '#2D9CDB',
  },
});

class Manage_address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      user: {
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        city: '',
        zipcode: '',
        contactNumber: '',
      },
    };
  }

  getUserData = async () => {
    var res = AuthService.getUserData();

    var data = res.userData;
    var stateData = this.state.user;

    stateData['addressLine1'] = data.addressLine1;
    stateData['addressLine2'] = data.addressLine2;
    stateData['addressLine3'] = data.addressLine3;
    stateData['city'] = data.city;
    stateData['zipcode'] = data.zipcode;
    stateData['contactNumber'] = data.contactNumber;

    this.setState({
      userID: res.userData._id,
      user: stateData,
    });
    console.log('u data' + res.userData);
  };

  async componentDidMount() {
    await this.getUserData();
  }

  handleChange = (event) => {
    const userData = this.state.user;
    userData[event.target.name] = event.target.value;
    this.setState({
      user: userData,
    });
    console.log(this.state);
  };

  handleSubmit = async (e) => {
    //console.log('button clicked');
    e.preventDefault();
    this.setState({
      loading: true,
    });
    // console.log(this.state);
    var messageRes = null;
    var variantRes = null;
    axios
      .put(
        'http://localhost:5000/api/auth/updateUserAddress/' + this.state.userID,
        this.state.user
      )
      .then((res) => {
        console.log(res);
        if (res.data.success == true) {
        }
      })
      .catch((error) => {
        console.log(error);
        messageRes = error.message;
        variantRes = 'error';
      });
    setTimeout(() => {
      this.setState({
        message: messageRes,
        variant: variantRes,
        loading: false,
      });
    }, 2000);
  };

  render() {
    const { user } = this.state;
    const { classes } = this.props;
    return (
      <div style={{ margin: '30px 70px 30px 70px' }}>
        <Container>
          <center>
            <Typography
              component="h1"
              variant="h3"
              style={{ fontWeight: '500', color: 'white' }}
            >
              Manage Address
            </Typography>
          </center>
          <ValidatorForm
            onSubmit={this.handleSubmit}
            style={{
              backgroundColor: 'white',
              padding: '2%',
              borderRadius: '5px',
              background: 'rgba(0,0,0,.3)',
              width: '80%',
              margin: '0 auto',
              marginTop: '50px',
            }}
          >
            <div
              className="inputContainer"
              style={{
                // backgroundColor: 'red',
                margin: '30px 10px 30px 10px',
              }}
            >
              {/* <div style={{ display: 'flex' }}> */}
              <label className={classes.label}>Address Line 1</label>
              <TextValidator
                onChange={this.handleChange}
                name="addressLine1"
                type="text"
                value={this.state.user.addressLine1}
                className={classes.input}
              />

              <label className={classes.label}>Address Line 2</label>
              <TextValidator
                onChange={this.handleChange}
                name="addressLine2"
                type="text"
                value={this.state.user.addressLine2}
                className={classes.input}
              />
              {/* </div> */}

              <label className={classes.label}>Address Line 3</label>
              <TextValidator
                onChange={this.handleChange}
                name="addressLine3"
                type="text"
                value={this.state.user.addressLine3}
                className={classes.input}
              />

              <label className={classes.label}>Zip Code</label>
              <TextValidator
                onChange={this.handleChange}
                name="zipcode"
                type="text"
                validators={['required']}
                errorMessages={['this field is required']}
                value={user.zipcode}
                className={classes.input}
              />

              <label className={classes.label}>City</label>
              <TextValidator
                onChange={this.handleChange}
                name="city"
                type="text"
                validators={['required']}
                errorMessages={['this field is required']}
                value={user.city}
                className={classes.input}
              />

              <label className={classes.label}>Contact Number</label>
              <TextValidator
                onChange={this.handleChange}
                name="contactNumber"
                type="text"
                validators={['required']}
                errorMessages={['this field is required']}
                value={user.contactNumber}
                className={classes.input}
              />

              <Button
                type="submit"
                style={{
                  margin: '10px 0px 0px 10px',
                  border: '1px solid white',
                  padding: '10px 50px 10px 50px',
                  color: 'white',
                  backgroundColor: '#17A2B8',
                }}
              >
                Save
              </Button>
            </div>
            <Button
              style={{
                marginLeft: '20px',
                background: 'rgba(0,0,0,.0)',
                marginTop: '40px',
              }}
            ></Button>
          </ValidatorForm>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Manage_address);
