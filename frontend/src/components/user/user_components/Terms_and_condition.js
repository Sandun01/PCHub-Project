import React, { Component } from 'react';
import { Container, Typography } from '@material-ui/core';

const styles = (theme) => ({});

export default class Terms_and_condition extends Component {
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
              Terms and Condition
            </Typography>
          </center>
          <br />
          <Typography>
            Please read these terms and conditions ("terms and conditions",
            "terms") carefully before using [website] website (“website”,
            "service") operated by [name] ("us", 'we", "our").
          </Typography>

          <br />
          <Typography
            component="h1"
            variant="h5"
            style={{ fontWeight: '500', color: 'white' }}
          >
            Conditions of use
          </Typography>

          <Typography align="justify">
            By using this website, you certify that you have read and reviewed
            this Agreement and that you agree to comply with its terms. If you
            do not want to be bound by the terms of this Agreement, you are
            advised to leave the website accordingly. [name] only grants use and
            access of this website, its products, and its services to those who
            have accepted its terms.
          </Typography>

          <br />
          <Typography
            component="h1"
            variant="h5"
            style={{ fontWeight: '500', color: 'white' }}
          >
            Intellectual property
          </Typography>

          <Typography align="justify">
            You agree that all materials, products, and services provided on
            this website are the property of [name], its affiliates, directors,
            officers, employees, agents, suppliers, or licensors including all
            copyrights, trade secrets, trademarks, patents, and other
            intellectual property. You also agree that you will not reproduce or
            redistribute the [name]’s intellectual property in any way,
            including electronic, digital, or new trademark registrations. You
            grant [name] a royalty-free and non-exclusive license to display,
            use, copy, transmit, and broadcast the content you upload and
            publish. For issues regarding intellectual property claims, you
            should contact the company in order to come to an agreement
          </Typography>

          <br />
          <Typography
            component="h1"
            variant="h5"
            style={{ fontWeight: '500', color: 'white' }}
          >
            Applicable law
          </Typography>

          <Typography align="justify">
            By visiting this website, you agree that the laws of the [location],
            without regard to principles of conflict laws, will govern these
            terms and conditions, or any dispute of any sort that might come
            between [name] and you, or its business partners and associates.
          </Typography>

          <br />
          <Typography
            component="h1"
            variant="h5"
            style={{ fontWeight: '500', color: 'white' }}
          >
            Limitation on liability
          </Typography>

          <Typography align="justify">
            [name] is not liable for any damages that may occur to you as a
            result of your misuse of our website. [name] reserves the right to
            edit, modify, and change this Agreement at any time. We shall let
            our users know of these changes through electronic mail. This
            Agreement is an understanding between [name] and the user, and this
            supersedes and replaces all prior agreements regarding the use of
            this website.
          </Typography>
        </Container>
      </div>
    );
  }
}
