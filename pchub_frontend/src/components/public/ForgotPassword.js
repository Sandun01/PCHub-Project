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
    backgroundColor: '#ffffff',
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
  },
  variant: '',
  message: '',
  loading: false,
  error: '',
  success: '',
};

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.formSubmit = this.formSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  formSubmit = async (e) => {
    console.log(this.state.formData.email);
    e.preventDefault();

    this.setState({
      loading: true,
    });

    // console.log(this.state);
    var messageRes = null;
    var variantRes = null;

    await axios
      .post('/api/auth/forgotpassword', this.state.formData)
      .then((res) => {
        if (res.status == 200) {
          messageRes = 'Successfully Send Email! Check Your Inbox';
          variantRes = 'success';
          this.setState({
            success: messageRes,
          });
        } else {
          messageRes = 'Error';
          variantRes = 'error';
          this.setState({
            error: messageRes,
          });
        }
      })
      .catch((error) => {
        messageRes = 'Error';
        variantRes = 'error';
        this.setState({
          error: messageRes,
        });
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
    console.log(this.state);
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
            Forgot Password
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
            Please enter the email address you register your account with. We
            will send you reset password confirmation to this email
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

            {this.state.error && (
              <span className="error-message">{this.state.error}</span>
            )}
            {this.state.success && (
              <span className="success-message">{this.state.success}</span>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(ForgotPassword);
