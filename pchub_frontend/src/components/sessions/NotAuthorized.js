import { Button, Typography, Grid } from '@material-ui/core';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import image401 from 'url:../../../public/images/401.jpg';

class NotAuthorized extends Component {
  constructor(props) {
    super(props);
    this.redirectToHome = this.redirectToHome.bind(this);
  }

  redirectToHome() {
    this.props.history.goBack();
  }

  render() {
    return (
      <div>
        <Grid container alignItems="center" justify="center" direction="column">
          <Grid item>
            <Typography variant="h3" className="my-3">
              Not Authorized 401
            </Typography>
          </Grid>

          <Grid item>
            <img src={image401} style={{ width: '20rem', height: '20rem' }} />
          </Grid>

          <Grid item>
            <Button
              className="my-3"
              variant="contained"
              color="primary"
              onClick={this.redirectToHome}
            >
              Go Back
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default NotAuthorized;
