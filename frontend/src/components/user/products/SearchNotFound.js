import { Button, Typography, Grid } from '@material-ui/core';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SearchNotFound extends Component {
  constructor(props) {
    super(props);
    this.redirectToHome = this.redirectToHome.bind(this);
  }

  redirectToHome() {
    window.location.href = '/';
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Grid container alignItems="center" justify="center" direction="column">
          <Grid item>
            <Typography variant="h3" className="my-3">
              No Result Found !
            </Typography>
          </Grid>

          <Grid item>
            <img src={"/images/searchNotFound.png"} style={{ width: '20rem', height: '20rem' }} />
          </Grid>

          <Grid item>
            <Button
              className="my-3"
              variant="contained"
              color="primary"
              onClick={this.redirectToHome}
            >
              Back to Home
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default SearchNotFound;
