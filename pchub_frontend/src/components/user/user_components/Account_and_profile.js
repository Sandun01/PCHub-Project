import React, { Component } from 'react';
import { Container, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import AuthService from '../../../services/AuthService';

const styles = (theme) => ({});

export default class Account_and_profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        fname: '',
        lname: '',
        email: '',
        password: '',
        repeatPassword: '',
      },
    };
  }

  getUserData = async () => {
    var res = AuthService.getUserData();
    var userD = res.userData;
    // userD['fname'] = userData.fname;

    this.setState({
      user: userD,
    });
    console.log(res.userData.lname);
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

  handleSubmit = () => {
    // your submit logic
  };

  render() {
    const { user } = this.state;
    return (
      <div>
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
            }}
          >
            <TextValidator
              label="First Name"
              onChange={this.handleChange}
              name="fname"
              type="text"
              value={this.state.user.fname}
            />
            <TextValidator
              label="Last Name"
              onChange={this.handleChange}
              name="lname"
              type="lname"
              value={this.state.user.lname}
            />
            <TextValidator
              label="Email"
              onChange={this.handleChange}
              name="email"
              type="email"
              value={this.state.user.email}
            />
            <TextValidator
              label="Old Password"
              onChange={this.handleChange}
              name="oldpassword"
              type="oldpassword"
              validators={['required']}
              errorMessages={['this field is required']}
              value={user.password}
            />
            <TextValidator
              label="Password"
              onChange={this.handleChange}
              name="password"
              type="password"
              validators={['required']}
              errorMessages={['this field is required']}
              value={user.password}
            />
            <TextValidator
              label="Repeat password"
              onChange={this.handleChange}
              name="repeatPassword"
              type="password"
              validators={['isPasswordMatch', 'required']}
              errorMessages={['password mismatch', 'this field is required']}
              value={user.repeatPassword}
            />
            <Button type="submit">Submit</Button>
          </ValidatorForm>
        </Container>
      </div>
    );
  }
}
