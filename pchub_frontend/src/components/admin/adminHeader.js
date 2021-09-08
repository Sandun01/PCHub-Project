import React, { Component } from 'react'
import { alpha, withStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import MailIcon from '@material-ui/icons/Mail'
import NotificationsIcon from '@material-ui/icons/Notifications'
import MoreIcon from '@material-ui/icons/MoreVert'
import { Button } from '@material-ui/core'
import { Link } from 'react-router-dom'

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
} from '@material-ui/core'

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

  headerlink: {
    textDecoration: 'none',
    color: 'black',
    paddingRight: '40px',
  },
  navbar: {
    backgroundColor: '#fff',
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
})

class adminHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLargeScreen: true,
      loggedIn: false,
    }
  }

  componentDidMount() {
    this.setState({
      isLargeScreen: true,
    })
  }

  largeScreen() {
    const { classes } = this.props

    return (
      <div className={classes.grow}>
        <AppBar position='static'>
          <Toolbar className={classes.navbar}>
            {/* <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon onClick={this.showSidebar} />
            </IconButton> */}
            <Typography className={classes.title} variant='h6' noWrap>
              <a className={classes.headerlink} href='/'>
                PCHub | Admin
              </a>
            </Typography>

            <div className={classes.grow} />
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder='Search…'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>

            <div className={classes.sectionDesktop}>
              <Link style={{ textDecoration: 'none' }} to='/account'>
                <Button
                  className={classes.searchButton}
                  variant='outlined'
                  color='primary'
                  size='medium'
                >
                  Search
                </Button>
              </Link>
            </div>

            <div className={classes.sectionDesktop}>
              <IconButton
                edge='end'
                aria-label='account of current user'
                aria-controls={this.state.menuId}
                aria-haspopup='true'
                // onClick={this.handleProfileMenuOpen}
                color='inherit'
              >
                <AccountCircle className={classes.iconButtons} />
              </IconButton>
            </div>

            <Link style={{ textDecoration: 'none' }} to='/login'>
              <Button
                className={classes.searchButton}
                variant='outlined'
                color='primary'
                size='medium'
              >
                LogOut
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
      </div>
    )
  }

  render() {
    return (
      <>{this.largeScreen()}</>
    )
  }
}

export default withStyles(styles)(adminHeader)
