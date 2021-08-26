import React, { Component } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { AdminLeftNavBarData } from '../utils/AdminLeftNavBarData'
import { Link } from 'react-router-dom'

import AuthService from '../../services/AuthService'

const styles = (theme) => ({
  root: {
    width: '15%',
    minWidth: '150px',
    marginRight: '20px',
    borderRadius: '0px',
    backgroundColor: '#363740',
    borderStyle: 'none',
  },
  menuItem: {
    color: '#A4A6B3',
    padding: '30px 20px 20px 20px',
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
    backgroundColor: '#363740',
    // boxShadow: '5px 5px 10px #aaaaaa',
    borderStyle: 'none',
    // margin: '10px',
    '&:hover': {
      background: '#363950',
      // padding: '5px',
    },
  },
  menuItemLink: {
    textDecoration: 'none',
  },
})

class AdminLeftNavMain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLargeScreen: true,
    }
  }

  componentDidMount() {
    if (window.innerWidth <= 1000) {
      this.setState({
        isLargeScreen: false,
      })
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 1000) {
        this.setState({
          isLargeScreen: false,
        })
      } else {
        this.setState({
          isLargeScreen: true,
        })
      }
    })
  }

  redirectToLogin = () => {
    window.location.href = '/login'
  }

  logoutUser = () => {
    AuthService.userLogout()
    this.redirectToLogin()
  }

  render() {
    const { classes } = this.props
    return (
      <>
        {this.state.isLargeScreen && (
          <Paper className={classes.root}>
            {/* <MenuItem
                className={classes.menuItem}
                onClick={handleClose}
                style={{ marginTop: '20px' }}
              >
                <Typography>Laptops</Typography>
                <img width="25px" height="25px" src="/images/desktop.png" />
              </MenuItem> */}

            {AdminLeftNavBarData.map((item, key) => {
              return (
                <Link
                  className={classes.menuItemLink}
                  key={item.title}
                  to={item.path}
                >
                  <MenuItem className={classes.menuItem}>
                    {item.icon}
                    <Typography align={'left'}>{item.title}</Typography>
                  </MenuItem>
                </Link>
              )
            })}
            <MenuItem className={classes.menuItem}>
              <Typography align={'left'} onClick={this.logoutUser}>
                  
                  <img
                  width='25px'
                  height='25px'
                  src='\images\icons8-logout.png'
                  alt='report'
                /> Logout 
              </Typography>
            </MenuItem>
          </Paper>
        )}
      </>
    )
  }
}

export default withStyles(styles)(AdminLeftNavMain)
