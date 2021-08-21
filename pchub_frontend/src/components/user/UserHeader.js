import React, { Component } from "react";
import { alpha, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Button } from "@material-ui/core";
import {Link } from 'react-router-dom'
import { AiOutlineClose } from 'react-icons/ai'

import { LeftNavBarData } from '../utils/LeftNavBarData'
import '../../css/LeftNavBar.css'

const styles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "block",
    // [theme.breakpoints.up("sm")]: {
    //   display: "block",
    // },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    border: "1px solid",
    borderRadius: "5px",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    // display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    // display: "flex",
    textAlign:'right',
    // [theme.breakpoints.up("md")]: {
    //   display: "none",
    // },
  },
  headerlink: {
    textDecoration: "none",
    color: "white",
    paddingRight: "40px",
  },
  navbar: {
    backgroundColor: "#0A1F35",
  },

  searchButton: {
    color: "#17A2B8",
    '&:hover':{
        backgroundColor: '#1a83ff',
        color: 'black',
    }
  },

  iconButtons: {
    textDecoration: 'none',
    color: '#fff',
    '&:hover':{
        color: '#1a83ff',
    }
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

      menuId: "primary-search-account-menu",

      isLargeScreen: true,
      
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
    })
  }

  componentDidMount(){
    
    if(window.innerWidth <= 1000) {
        this.setState({
            isLargeScreen: false,
        });
    }
  
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 1000) {
        this.setState({
          isLargeScreen: false,
        });
      } 
      else {
        this.setState({
          isLargeScreen: true,
        });
      }
    });
    
  }

  smallScreen(){

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
            >
              <MenuIcon onClick={this.showSidebar} />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              <a className={classes.headerlink} href="/">
                PCHub
              </a>
            </Typography>

            {/* mobile dropdown */}
            <div className='ms-auto'>
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
            <MenuItem onClick={this.handleMobileMenuClose} >
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
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon onClick={this.showSidebar} />
            </IconButton>
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
            <Typography className={classes.title}  noWrap>
              <a className={classes.headerlink} href="/services">
                Services
              </a>
            </Typography>
            <Typography className={classes.title}  noWrap>
              <a className={classes.headerlink} href="/contactUs">
                Contact Us
              </a>
            </Typography>
            <Typography className={classes.title}  noWrap>
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
                        inputProps={{ "aria-label": "search" }}
                    />
            </div>
            
            <div className={classes.sectionDesktop}>
                <Button
                className={classes.searchButton}
                variant="outlined"
                color="primary"
                size="small"
                >
                Search
                </Button>
            </div>

            {/* Cart */}
            <div className={classes.sectionDesktop}>
              <Link to="/cart">
                <MenuItem>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                        >
                        {/* <Badge badgeContent={11} color="secondary"> */}
                            <ShoppingCartIcon className={classes.iconButtons}/>
                        {/* </Badge> */}
                    </IconButton>
                </MenuItem>
              </Link>
            </div>

            {/* Profile  */}
            <div className={classes.sectionDesktop}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={this.state.menuId}
                aria-haspopup="true"
                // onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle className={classes.iconButtons} />
              </IconButton>
            </div>
            
          </Toolbar>
        </AppBar>
      </div>
    );
  }


  showSidebar = () => {
    var resLeftBar = this.state.sidebar;
    this.setState({
        sidebar: !resLeftBar,
    })
  }

  componentDidMount(){
    
    if(window.innerWidth <= 1150) {
        this.setState({
            isLargeScreen: false,
        });
    }
  
      window.addEventListener("resize", () => {
        if (window.innerWidth <= 1150) {
          this.setState({
            isLargeScreen: false,
          });
        } 
        else {
          this.setState({
            isLargeScreen: true,
          });
        }
      });
  }

  render() {
    return (
        <>
        
            {
                this.state.isLargeScreen ? this.largeScreen() : this.smallScreen()
            }

            {/* <div className="navbar">
                <Link to="#" className="menu-bars">
                    <FaBars onClick={this.showSidebar} style={{color: '#fff'}}/>
                </Link>
            </div> */}
            
            <nav className={this.state.sidebar ? 'nav-menu active': 'nav-menu'} >
                <ul className="nav-menu-items" onClick={this.showSidebar}>
                    <li className="navbar-toggle">
                        <Link to="#" className="menu-bars">
                            <AiOutlineClose style={{color: '#fff'}} />
                        </Link>
                    </li>
                    {
                        LeftNavBarData.map((item, key) => {
                            return(
                                <li key={key} className={item.cName} 
                                    style={{ height: this.state.smallScreen ? '35px' : '45px'}} 
                                >
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span className="navBarspan">
                                            {item.title}
                                        </span>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
        </>
        
    );
  }
}

export default withStyles(styles)(UserHeader);
