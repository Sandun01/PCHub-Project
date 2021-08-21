import React, { Component } from 'react';
import { Container, Typography } from '@material-ui/core';

const styles = (theme) => ({});

export default class Account_and_profile extends Component {
  render() {
    return (
      <div>
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
        </Container>
      </div>
    );
  }
}
