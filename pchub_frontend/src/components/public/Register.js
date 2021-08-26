import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Component } from 'react';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import Loader from '../common/Loader';
import AuthService from '../../services/AuthService';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    backgroundColor: '#17A2B8',
    borderRadius: '5px',
    color: 'white',
  },
  submit: {
    backgroundColor: '#007BFF',
    padding: '10px',
    marginTop: '20px',
  },
});

const initialState = {
  formData: {
    fname: '',
    lname: '',
    email: '',
    password: '',
  },
  variant: '',
  message: '',
  loading: false,
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.formSubmit = this.formSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  formSubmit = async (e) => {
    //console.log(this.state.email + this.state.password);
    e.preventDefault();

    this.setState({
      loading: true,
    });

    // console.log(this.state);
    var messageRes = null;
    var variantRes = null;

    axios
      .post('/api/auth/register', this.state.formData)
      .then((res) => {
        console.log(res);
        if (res.status == 201) {
          messageRes = 'Successfully Registered!';
          variantRes = 'success';

          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          messageRes = 'Error';
          variantRes = 'error';
        }
      })
      .catch((error) => {
        console.log(error);
        messageRes = error.response.data.message;
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

  handleChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    var data = this.state.formData;

    data[name] = value;

    this.setState({
      formData: data,
    });
    // console.log(this.state);
  };

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography
            component="h1"
            variant="h3"
            style={{ fontWeight: '500', color: 'white' }}
          >
            Sign Up
          </Typography>

          {/* Loading */}
          {this.state.loading && <Loader />}

          <Typography
            component="h1"
            variant="h7"
            style={{
              fontWeight: '100',
              color: 'white',
              fontSize: '18px',
              margin: '30px 0px 30px 0px',
            }}
          >
            Sign up and join with us!
          </Typography>

          <form
            className={classes.form}
            noValidate
            method="post"
            onSubmit={this.formSubmit}
          >
            <TextField
              className={classes.input}
              variant="filled"
              margin="normal"
              required
              fullWidth
              id="fname"
              label="First Name"
              name="fname"
              value={this.state.formData.fname}
              onChange={this.handleChange}
            />

            <TextField
              className={classes.input}
              variant="filled"
              margin="normal"
              required
              fullWidth
              id="lname"
              label="Last Name"
              name="lname"
              value={this.state.formData.lname}
              onChange={this.handleChange}
            />

            <TextField
              className={classes.input}
              variant="filled"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={this.state.formData.email}
              onChange={this.handleChange}
            />
            <TextField
              className={classes.input}
              variant="filled"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={this.state.formData.password}
              onChange={this.handleChange}
            />

            <TextField
              className={classes.input}
              variant="filled"
              margin="normal"
              required
              fullWidth
              name="confrmPassword"
              label="confrmPassword"
              type="confrmPassword"
              id="confrmPassword"
              value={this.state.formData.confrmPassword}
              onChange={this.handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Register
            </Button>
            <Grid container style={{ marginTop: '20px' }}>
              <Grid item xs></Grid>
              <Grid item>
                <Link
                  href="/login"
                  variant="body2"
                  style={{ fontWeight: '500', color: 'white' }}
                >
                  {'Already have an account? Sign In'}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(Register);
