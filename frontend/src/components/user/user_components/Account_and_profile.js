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

class Account_and_profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        _id: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
      },
    };
  }

  getUserData = async () => {
    var res = AuthService.getUserData();
    var userD = res.userData;
    // userD['fname'] = userData.fname;

    console.log(userD);
    this.setState({
      user: userD,
    });
    console.log('dsadsads' + res.userData._id);
    console.log('dsadsads' + this.state.user.email);
  };

  async componentDidMount() {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.user.password) {
        return false;
      }
      return true;
    });
    this.getUserData();
  }

  async componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch');
  }

  handleChange = (event) => {
    const { user } = this.state;
    user[event.target.name] = event.target.value;
    this.setState({ user });
  };

  handleSubmit = async (e) => {
    //console.log('button clicked');
    console.log(this.state.user.email + this.state.user);
    e.preventDefault();
    this.setState({
      loading: true,
    });
    // console.log(this.state);
    var messageRes = null;
    var variantRes = null;
    axios
      .put('/api/auth/' + this.state.user._id, this.state.user)
      .then((res) => {
        console.log(res);
        if (res.data.success == true) {
          AuthService.userLogout();
          window.location.href = '/login';
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

  deleteUser = () => {
    console.log(this.state.user._idject);
    console.log(this.state.user);
    var messageRes = null;
    var variantRes = null;
    //console.log('button clicked');
    axios
      .delete(
        '/api/auth/delete/' + this.state.user._id,
        this.state.user
      )
      .then((res) => {
        console.log(res);
        if (res.data.success == true) {
          AuthService.userLogout();
          window.location.href = '/login';
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
              Account and Profile
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
              <label className={classes.label}>First Name</label>
              <TextValidator
                onChange={this.handleChange}
                name="fname"
                type="text"
                value={this.state.user.fname}
                className={classes.input}
              />

              <label className={classes.label}>Last Name</label>
              <TextValidator
                onChange={this.handleChange}
                name="lname"
                type="lname"
                value={this.state.user.lname}
                className={classes.input}
              />
              {/* </div> */}

              <label className={classes.label}>Email</label>
              <TextValidator
                onChange={this.handleChange}
                name="email"
                type="email"
                value={this.state.user.email}
                className={classes.input}
              />

              <label className={classes.label}>Current Password</label>
              <TextValidator
                onChange={this.handleChange}
                name="currentpassword"
                type="password"
                validators={['required']}
                errorMessages={['this field is required']}
                value={user.currentpassword}
                className={classes.input}
              />

              <label className={classes.label}>New Password</label>
              <TextValidator
                onChange={this.handleChange}
                name="password"
                type="password"
                validators={['required']}
                errorMessages={['this field is required']}
                value={user.password}
                className={classes.input}
              />
              <label className={classes.label}>Confirm New Password</label>
              <TextValidator
                onChange={this.handleChange}
                name="repeatPassword"
                type="password"
                validators={['isPasswordMatch', 'required']}
                errorMessages={['password mismatch', 'this field is required']}
                value={user.repeatPassword}
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
                Update
              </Button>
            </div>

            {/* delete user profile */}
            <Button
              onClick={this.deleteUser}
              style={{
                marginLeft: '20px',
                background: 'rgba(0,0,0,.0)',
                marginTop: '40px',
              }}
            >
              <div style={{ display: 'flex' }}>
                <DeleteForeverIcon
                  type="submit"
                  style={{
                    color: 'red',
                    marginRight: '10px',
                    marginLeft: '-8px',
                  }}
                ></DeleteForeverIcon>
                <h6 style={{ color: 'red', fontSize: '17px' }}>
                  {' '}
                  Delete Account{' '}
                </h6>
              </div>
            </Button>
          </ValidatorForm>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Account_and_profile);
