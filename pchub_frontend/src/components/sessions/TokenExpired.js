import { Button, Typography, Grid } from '@material-ui/core';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import tokenExpired from 'url:../../../public/images/tokenExpired.jpg';

class TokenExpired extends Component {
  constructor(props) {
    super(props);
    this.redirectToHome = this.redirectToHome.bind(this);
  }

  redirectToHome() {
    window.location.href = '/login';
  }

  render() {
    return (
      <div>
        <Grid container alignItems="center" justify="center" direction="column">
          <Grid item>
            <Typography variant="h3" className="my-3">
              Token Expired
            </Typography>
          </Grid>

          <Grid item>
            <img
              src={tokenExpired}
              style={{ width: '20rem', height: '20rem' }}
            />
          </Grid>

          <Grid item>
            <Button
              className="my-3"
              variant="contained"
              color="primary"
              onClick={this.redirectToHome}
            >
              Go to Login
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default TokenExpired;
