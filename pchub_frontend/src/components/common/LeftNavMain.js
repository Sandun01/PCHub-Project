import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { LeftNavBarData } from '../utils/LeftNavBarData';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
  root: {
    width: '15%',
    minWidth: '250px',
    borderRadius: '0px',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    marginTop: '20px',
  },
  menuItem: {
    color: 'white',
    padding: '20px 20px 20px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    backgroundColor: '#0A1F35',
    // boxShadow: '5px 5px 10px #aaaaaa',
    borderStyle: 'none',
    // margin: '10px',
    '&:hover': {
      background: '#2D9CDB',
      // padding: '5px',
    },
  },
  menuItemLink:{
    textDecoration: 'none'
  }

});


class LeftNavMain extends Component
{
  constructor(props){
    super(props);
    this.state ={
      isLargeScreen: true,
    }
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
  
  render (){
    const { classes } = this.props;
    return(
      <>
        { 
          this.state.isLargeScreen &&

            <Paper className={classes.root}>

              {/* <MenuItem
                className={classes.menuItem}
                onClick={handleClose}
                style={{ marginTop: '20px' }}
              >
                <Typography>Laptops</Typography>
                <img width="25px" height="25px" src="/images/desktop.png" />
              </MenuItem> */}

              {
                  LeftNavBarData.map((item, key) => {
                      return(
                          <Link className={classes.menuItemLink} key={item.title} to={item.path}>
                            <MenuItem className={classes.menuItem}>
                                <Typography>{item.title}</Typography>
                                {item.icon}
                            </MenuItem>
                          </Link>
                      )
                  })
              }

            </Paper>
          }

      </>
    )
  }

}

export default withStyles(styles)(LeftNavMain);