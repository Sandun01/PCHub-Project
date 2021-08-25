import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Container, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import PaymentIcon from '@material-ui/icons/Payment';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import HistoryIcon from '@material-ui/icons/History';
import StarIcon from '@material-ui/icons/Star';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PublicIcon from '@material-ui/icons/Public';

import Account_and_profile from './user_components/Account_and_profile';
import Manage_payment from './user_components/Manage_payment';
import Contact_support from './user_components/Contact_support';
import Order_history from './user_components/Order_history';
import Privacy_policy from './user_components/Privacy_policy';
import Terms_and_condition from './user_components/Terms_and_condition';
import Wish_list from './user_components/Wish_list';
import Write_a_review from './user_components/Write_a_review';
import Manage_address from './user_components/Manage_address';

//import Profile_picture from '../../../public/images/profile_picture.jpg';

const styles = (theme) => ({
  leftNav: {
    width: '30%',
  },

  rightNav: {
    width: '70%',

    // backgroundColor: 'red',
  },

  leftNavItem: {
    padding: '20px 0px 20px 0px',
    // backgroundColor: 'black',
    '&:hover': {
      background: '#2D9CDB',
    },
  },

  verticleline: {
    borderLeft: '1px solid white',
    height: '500px',
  },

  leftNavItemText: {
    color: 'white',
  },

  leftNavItemIcon: {
    color: '#17A2B8',
  },
});

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_account_and_profile: true,
      show_manage_paymet: false,
      show_manage_address: false,
      show_order_history: false,
      show_contact_support: false,
      show_wish_list: false,
      show_write_a_review: false,
      show_terms_and_condition: false,
      show_privacy_policy: false,
    };
  }

  showComponent = (name) => {
    console.log(name);
    if (name === 'account' || name === null) {
      this.setState({
        show_account_and_profile: true,
        show_manage_paymet: false,
        show_manage_address: false,
        show_order_history: false,
        show_contact_support: false,
        show_wish_list: false,
        show_write_a_review: false,
        show_terms_and_condition: false,
        show_privacy_policy: false,
      });
    } else if (name === 'payment') {
      this.setState({
        show_account_and_profile: false,
        show_manage_paymet: true,
        show_manage_address: false,
        show_order_history: false,
        show_contact_support: false,
        show_wish_list: false,
        show_write_a_review: false,
        show_terms_and_condition: false,
        show_privacy_policy: false,
      });
    } else if (name === 'address') {
      this.setState({
        show_account_and_profile: false,
        show_manage_paymet: false,
        show_manage_address: true,
        show_order_history: false,
        show_contact_support: false,
        show_wish_list: false,
        show_write_a_review: false,
        show_terms_and_condition: false,
        show_privacy_policy: false,
      });
    } else if (name === 'order_history') {
      this.setState({
        show_account_and_profile: false,
        show_manage_paymet: false,
        show_manage_address: false,
        show_order_history: true,
        show_contact_support: false,
        show_wish_list: false,
        show_write_a_review: false,
        show_terms_and_condition: false,
        show_privacy_policy: false,
      });
    } else if (name === 'contact_support') {
      this.setState({
        show_account_and_profile: false,
        show_manage_paymet: false,
        show_manage_address: false,
        show_order_history: false,
        show_contact_support: true,
        show_wish_list: false,
        show_write_a_review: false,
        show_terms_and_condition: false,
        show_privacy_policy: false,
      });
    } else if (name === 'wish_list') {
      this.setState({
        show_account_and_profile: false,
        show_manage_paymet: false,
        show_manage_address: false,
        show_order_history: false,
        show_contact_support: false,
        show_wish_list: true,
        show_write_a_review: false,
        show_terms_and_condition: false,
        show_privacy_policy: false,
      });
    } else if (name === 'terms_and_conditions') {
      this.setState({
        show_account_and_profile: false,
        show_manage_paymet: false,
        show_manage_address: false,
        show_order_history: false,
        show_contact_support: false,
        show_wish_list: false,
        show_write_a_review: false,
        show_terms_and_condition: true,
        show_privacy_policy: false,
      });
    } else if (name === 'write_a_review') {
      this.setState({
        show_account_and_profile: false,
        show_manage_paymet: false,
        show_manage_address: false,
        show_order_history: false,
        show_contact_support: false,
        show_wish_list: false,
        show_write_a_review: true,
        show_terms_and_condition: false,
        show_privacy_policy: false,
      });
    } else if (name === 'privacy_policy') {
      this.setState({
        show_account_and_profile: false,
        show_manage_paymet: false,
        show_manage_address: false,
        show_order_history: false,
        show_contact_support: false,
        show_wish_list: false,
        show_write_a_review: false,
        show_terms_and_condition: false,
        show_privacy_policy: true,
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div style={{ width: '80%' }}>
        <Container
          style={{
            padding: '20px',
            display: 'flex',
            marginTop: '20px',
            backgroundColor: '#0A1F35',
            borderRadius: '5px',
          }}
          maxWidth="lg"
        >
          <div className={classes.leftNav}>
            <center>
              <img
                src="/images/profile_picture.jpg"
                width="100px"
                height="100px"
                style={{
                  borderRadius: '50%',
                  margin: '30px 0px 30px 0px',
                  border: '5px solid #2D9CDB',
                }}
              />
            </center>

            {/* account and profile */}
            <div
              className={classes.leftNavItem}
              onClick={() => this.showComponent('account')}
            >
              <div
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <BorderColorIcon
                    style={{ marginRight: '20px' }}
                    className={classes.leftNavItemIcon}
                  />
                  <Typography className={classes.leftNavItemText}>
                    Account And Profile
                  </Typography>
                </div>

                <KeyboardArrowRightIcon className={classes.leftNavItemIcon} />
              </div>
            </div>

            {/* payment */}
            <div
              className={classes.leftNavItem}
              onClick={() => this.showComponent('payment')}
            >
              <div
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <PaymentIcon
                    style={{ marginRight: '20px' }}
                    className={classes.leftNavItemIcon}
                  />
                  <Typography className={classes.leftNavItemText}>
                    Manage Payment Method
                  </Typography>
                </div>

                <KeyboardArrowRightIcon className={classes.leftNavItemIcon} />
              </div>
            </div>

            {/* address */}
            <div
              className={classes.leftNavItem}
              onClick={() => this.showComponent('address')}
            >
              <div
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <LocationOnIcon
                    style={{ marginRight: '20px' }}
                    className={classes.leftNavItemIcon}
                  />
                  <Typography className={classes.leftNavItemText}>
                    Manage Address
                  </Typography>
                </div>

                <KeyboardArrowRightIcon className={classes.leftNavItemIcon} />
              </div>
            </div>

            {/* order History */}
            <div
              className={classes.leftNavItem}
              onClick={() => this.showComponent('order_history')}
            >
              <div
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <HistoryIcon
                    style={{ marginRight: '20px' }}
                    className={classes.leftNavItemIcon}
                  />
                  <Typography className={classes.leftNavItemText}>
                    Oreder History
                  </Typography>
                </div>

                <KeyboardArrowRightIcon className={classes.leftNavItemIcon} />
              </div>
            </div>

            {/* contact_support */}
            <div
              className={classes.leftNavItem}
              onClick={() => this.showComponent('contact_support')}
            >
              <div
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <BorderColorIcon
                    style={{ marginRight: '20px' }}
                    className={classes.leftNavItemIcon}
                  />
                  <Typography className={classes.leftNavItemText}>
                    Contact Support
                  </Typography>
                </div>

                <KeyboardArrowRightIcon className={classes.leftNavItemIcon} />
              </div>
            </div>

            {/* wish_list */}
            <div
              className={classes.leftNavItem}
              onClick={() => this.showComponent('wish_list')}
            >
              <div
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <AddShoppingCartIcon
                    style={{ marginRight: '20px' }}
                    className={classes.leftNavItemIcon}
                  />
                  <Typography className={classes.leftNavItemText}>
                    Wish List
                  </Typography>
                </div>

                <KeyboardArrowRightIcon className={classes.leftNavItemIcon} />
              </div>
            </div>

            {/* write_a_review */}
            <div
              className={classes.leftNavItem}
              onClick={() => this.showComponent('write_a_review')}
            >
              <div
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <StarIcon
                    style={{ marginRight: '20px' }}
                    className={classes.leftNavItemIcon}
                  />
                  <Typography className={classes.leftNavItemText}>
                    Write A Review
                  </Typography>
                </div>

                <KeyboardArrowRightIcon className={classes.leftNavItemIcon} />
              </div>
            </div>

            {/* terms_and_condition */}
            <div
              className={classes.leftNavItem}
              onClick={() => this.showComponent('terms_and_conditions')}
            >
              <div
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <ListAltIcon
                    style={{ marginRight: '20px' }}
                    className={classes.leftNavItemIcon}
                  />
                  <Typography className={classes.leftNavItemText}>
                    Terms and Conditions
                  </Typography>
                </div>

                <KeyboardArrowRightIcon className={classes.leftNavItemIcon} />
              </div>
            </div>

            {/* privacy_policy */}
            <div
              className={classes.leftNavItem}
              onClick={() => this.showComponent('privacy_policy')}
            >
              <div
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex' }}>
                  <PublicIcon
                    style={{ marginRight: '20px' }}
                    className={classes.leftNavItemIcon}
                  />
                  <Typography className={classes.leftNavItemText}>
                    Privacy Policy
                  </Typography>
                </div>

                <KeyboardArrowRightIcon className={classes.leftNavItemIcon} />
              </div>
            </div>
          </div>

          {/* <div className={classes.verticleline}></div> */}

          <div className={classes.rightNav}>
            {this.state.show_account_and_profile === true && (
              <Account_and_profile />
            )}
            {this.state.show_manage_paymet === true && <Manage_payment />}
            {this.state.show_manage_address === true && <Manage_address />}
            {this.state.show_order_history === true && <Order_history />}
            {this.state.show_contact_support === true && <Contact_support />}
            {this.state.show_privacy_policy === true && <Privacy_policy />}
            {this.state.show_terms_and_condition === true && (
              <Terms_and_condition />
            )}
            {this.state.show_wish_list === true && <Wish_list />}
            {this.state.show_write_a_review === true && <Write_a_review />}

            {/* <center>
              <Typography
                component="h1"
                variant="h3"
                style={{ fontWeight: '500', color: 'white' }}
              >
                ACCOUNT AND PROFILE
              </Typography>
            </center> */}
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(UserProfile);
