import React, { Component } from 'react';
import { Container, Typography } from '@material-ui/core';

const styles = (theme) => ({});

export default class Wish_list extends Component {
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
              Wish List
            </Typography>
          </center>
        </Container>
      </div>
    );
  }
}
