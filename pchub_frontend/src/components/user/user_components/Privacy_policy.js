import React, { Component } from 'react';
import { Container, Typography } from '@material-ui/core';

const styles = (theme) => ({});

export default class Privacy_policy extends Component {
  render() {
    return (
      <div style={{ margin: '25px' }}>
        <Container>
          <center>
            <Typography
              component="h1"
              variant="h3"
              style={{ fontWeight: '500', color: 'white' }}
            >
              Privacy Policy
            </Typography>
          </center>
          <br />
          <Typography>
            Before you continue using our website, we advise you to read our
            privacy policy [link to privacy policy] regarding our user data
            collection. It will help you better understand our practices.
          </Typography>

          <br />
          <Typography
            component="h1"
            variant="h5"
            style={{ fontWeight: '500', color: 'white' }}
          >
            Age restriction
          </Typography>

          <Typography align="justify">
            You must be at least 18 (eighteen) years of age before you can use
            this website. By using this website, you warrant that you are at
            least 18 years of age and you may legally adhere to this Agreement.
            [name] assumes no responsibility for liabilities related to age
            misrepresentation
          </Typography>

          <br />
          <Typography
            component="h1"
            variant="h5"
            style={{ fontWeight: '500', color: 'white' }}
          >
            User accounts
          </Typography>

          <Typography align="justify">
            As a user of this website, you may be asked to register with us and
            provide private information. You are responsible for ensuring the
            accuracy of this information, and you are responsible for
            maintaining the safety and security of your identifying information.
            You are also responsible for all activities that occur under your
            account or password. If you think there are any possible issues
            regarding the security of your account on the website, inform us
            immediately so we may address them accordingly. We reserve all
            rights to terminate accounts, edit or remove content and cancel
            orders at our sole discretion.
          </Typography>

          <br />
          <Typography
            component="h1"
            variant="h5"
            style={{ fontWeight: '500', color: 'white' }}
          >
            Disputes
          </Typography>

          <Typography align="justify">
            Any dispute related in any way to your visit to this website or to
            products you purchase from us shall be arbitrated by state or
            federal court [location] and you consent to exclusive jurisdiction
            and venue of such courts.
          </Typography>
        </Container>
      </div>
    );
  }
}
