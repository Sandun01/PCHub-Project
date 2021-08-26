import React, { Component } from 'react';
import { alpha, withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  List,
  MenuItem,
  Menu,
  ListItem,
  SwipeableDrawer,
} from '@material-ui/core';

import { LeftNavBarData } from '../utils/LeftNavBarData';

const styles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'block',
    // [theme.breakpoints.up("sm")]: {
    //   display: "block",
    // },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    border: '1px solid',
    borderRadius: '5px',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    // display: "none",
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    // display: "flex",
    textAlign: 'right',
    // [theme.breakpoints.up("md")]: {
    //   display: "none",
    // },
  },
  headerlink: {
    textDecoration: 'none',
    color: 'white',
    paddingRight: '40px',
  },
  navbar: {
    backgroundColor: '#0A1F35',
  },

  searchButton: {
    color: '#17A2B8',
    '&:hover': {
      backgroundColor: '#1a83ff',
      color: 'black',
    },
  },

  iconButtons: {
    textDecoration: 'none',
    color: '#fff',
    '&:hover': {
      color: '#1a83ff',
    },
  },

  MuiDrawer: {
    backgroundColor: '#0A1F35',
    color: '#fff',
  },

  sidebarItem: {
    textDecoration: 'none',
    color: '#fff',
  },
  sidebarListItem: {
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: '#1a83ff',
      color: '#fff',
    },
  },
});

class UserHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   anchorEl: null,
      mobileMoreAnchorEl: null,

      //   isMenuOpen: false,
      isMobileMenuOpen: false,

      sideBar: false,

      menuId: 'primary-search-account-menu',

      isLargeScreen: true,
      drawer: false,

      loggedIn: false,
    };
  }

  //   handleProfileMenuOpen = (event) => {
  //     var res = this.state.mobileMoreAnchorEl ? true: false;
  //     this.setState({
  //       anchorEl: event.currentTarget,
  //       isMenuOpen: res,
  //     });
  //   };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = (event) => {
    var res = Boolean(this.state.mobileMoreAnchorEl);
    this.setState({
      mobileMoreAnchorEl: event.currentTarget,
      isMobileMenuOpen: !res,
    });
  };

  handleMobileMenuClose = () => {
    this.setState({
      mobileMoreAnchorEl: null,
      isMobileMenuOpen: false,
    });
  };

  showSidebar = () => {
    this.setState({
      drawer: true,
    });
  };

  componentDidMount() {
    if (window.innerWidth <= 1000) {
      this.setState({
        isLargeScreen: false,
      });
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 1000) {
        this.setState({
          isLargeScreen: false,
        });
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 1000) {
        this.setState({
          isLargeScreen: false,
        });
      } else {
        this.setState({
          isLargeScreen: true,
        });
      }
    });
  }

  smallScreen() {
    const { classes } = this.props;

    return (
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar className={classes.navbar}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={this.showSidebar}
            >
              <MenuIcon />
            </IconButton>

            <Typography className={classes.title} variant="h6" noWrap>
              <a className={classes.headerlink} href="/">
                PCHub
              </a>
            </Typography>

            {/* mobile dropdown */}
            <div className="ms-auto">
              <IconButton
                aria-label="show more"
                aria-controls={this.state.mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        <Menu
          anchorEl={this.state.mobileMoreAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={this.state.mobileMenuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={this.state.isMobileMenuOpen}
          onClose={this.handleMobileMenuClose}
        >
          <MenuItem onClick={this.handleMobileMenuClose}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem onClick={this.handleMobileMenuClose}>
            <IconButton aria-label="show 11 new notifications" color="inherit">
              <Badge badgeContent={11} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={this.handleMobileMenuClose}>
            <IconButton
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              {/* <Badge badgeContent={11} color="secondary"> */}
              <ShoppingCartIcon />
              {/* </Badge> */}
            </IconButton>
            <p>Cart</p>
          </MenuItem>
          <MenuItem
          // onClick={navigate to profile}
          >
            <IconButton
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <Badge color="secondary">
                <AccountCircle />
              </Badge>
            </IconButton>
            <p>Profile</p>
          </MenuItem>
        </Menu>
      </div>
    );
  }

  largeScreen() {
    const { classes } = this.props;

    return (
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar className={classes.navbar}>
            {/* <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon onClick={this.showSidebar} />
            </IconButton> */}
            <Typography className={classes.title} variant="h6" noWrap>
              <a className={classes.headerlink} href="/">
                PCHub
              </a>
            </Typography>
            <Typography className={classes.title} noWrap>
              <a className={classes.headerlink} href="/aboutUs">
                About
              </a>
            </Typography>
            <Typography className={classes.title} noWrap>
              <a className={classes.headerlink} href="/services">
                Services
              </a>
            </Typography>
            <Typography className={classes.title} noWrap>
              <a className={classes.headerlink} href="/contactUs">
                Contact Us
              </a>
            </Typography>
            <Typography className={classes.title} noWrap>
              +9471234567
            </Typography>
            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>

            <div className={classes.sectionDesktop}>
              <Link style={{ textDecoration: 'none' }} to="/account">
                <Button
                  className={classes.searchButton}
                  variant="outlined"
                  color="primary"
                  size="medium"
                >
                  Search
                </Button>
              </Link>
            </div>

            {/* Cart */}
            <div className={classes.sectionDesktop}>
              <MenuItem>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  color="inherit"
                >
                  {/* <Badge badgeContent={11} color="secondary"> */}
                  <ShoppingCartIcon className={classes.iconButtons} />
                  {/* </Badge> */}
                </IconButton>
              </MenuItem>
            </div>

            {this.state.loggedIn ? (
              <div className={classes.sectionDesktop}>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={this.state.menuId}
                  aria-haspopup="true"
                  // onClick={this.handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle
                    className={classes.iconButtons}
                    style={{ width: '30', height: '30' }}
                  />
                </IconButton>
              </div>
            ) : (
              <Link style={{ textDecoration: 'none' }} to="/login">
                <Button
                  className={classes.searchButton}
                  variant="outlined"
                  color="primary"
                  size="medium"
                >
                  Login
                </Button>
              </Link>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }

  //Small Screens
  createDrawer() {
    const { classes } = this.props;

    return (
      <div>
        <SwipeableDrawer
          open={this.state.drawer}
          onClose={() => {
            this.setState({ drawer: false });
          }}
          onOpen={() => {
            this.setState({ drawer: true });
          }}
          classes={{ paper: classes.MuiDrawer }}
        >
          <Typography
            variant="h5"
            style={{ fontWeight: 'bold', padding: '20px' }}
          >
            PCHub
          </Typography>

          <div tabIndex={0} role="button">
            <List className={this.props.classes.list}>
              {LeftNavBarData.map((item, key) => {
                return (
                  <Link
                    to={item.path}
                    className={classes.sidebarItem}
                    key={item.title}
                  >
                    <ListItem
                      button
                      divider
                      className={classes.sidebarListItem}
                    >
                      <div style={{ paddingRight: '10px' }}>{item.icon}</div>
                      <div>{item.title}</div>
                    </ListItem>
                  </Link>
                );
              })}
            </List>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }

  render() {
    return (
      <>
        {this.state.isLargeScreen ? this.largeScreen() : this.smallScreen()}
        {this.state.drawer && this.createDrawer()}
      </>
    );
  }
}

export default withStyles(styles)(UserHeader);
