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
import OrderServices from '../../services/OrderServices';
import Utils from '../utils/Utils';

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
    backgroundColor: '#FFFFFF',
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
    email: '',
    password: '',
  },
  variant: '',
  message: '',
  loading: false,
};

class Login extends Component {
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
      .post('/api/auth/login', this.state.formData)
      .then((res) => {
        // console.log('jkdsfjkdsfgdsjfkdjsfkdfdkjfkjfsjkd' + res);
        var userData = res.data;
        var token = res.data.token;

        AuthService.setUserDataToLocal(userData, token);

        if (userData.isAdmin) {
          window.location.href = '/admin';
        } else {

          //check user's local cart
          var orderedItems = OrderServices.getAllItemsInCart_Local()
          var resOrders = Utils.isEmptyObject(orderedItems);
          // console.log(orderedItems)

          if(resOrders){ //empty
              window.location.href = '/account';
          }
          else{ //not empty
            var uID = userData._id;
            
            OrderServices.addLocalItemsToDBLogin(uID, orderedItems)
            .then(res => {
              console.log('Order Success');
            })
            .catch(error => {
              console.log(error)
              console.log('Error in orders');
            })
            .finally(() => {
                window.location.href = '/account';
            })
          }
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
            Sign in
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
            Sign in and start managing your candidates!
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
            <FormControlLabel
              style={{ fontWeight: '500', color: 'white' }}
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  style={{ fontWeight: '500', color: 'white' }}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container style={{ marginTop: '20px' }}>
              <Grid item xs>
                <Link
                  href="/forgotpassword"
                  variant="body2"
                  style={{ fontWeight: '500', color: 'white' }}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  variant="body2"
                  style={{ fontWeight: '500', color: 'white' }}
                  href="/register"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(Login);
