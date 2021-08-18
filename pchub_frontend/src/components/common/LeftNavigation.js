import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import SvgIcon from '@material-ui/core/SvgIcon';
import CardMedia from '@material-ui/core/CardMedia';
import Image from 'material-ui-image';

// import Laptop from '../../../public/images/laptop.png';
// import Desktop from '../../../public/images/desktop.png';
// import GamingPc from '../../../public/images/gamingpc.png';

const useStyles = makeStyles({
  root: {
    width: '15%',
    borderRadius: '0px',
    backgroundColor: 'transparent',
    borderStyle: 'none',
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
});

export default function LeftNavigation() {
  const classes = useStyles();
  const handleClose = () => {};
  return (
    <Paper className={classes.root}>
      <MenuItem
        className={classes.menuItem}
        onClick={handleClose}
        style={{ marginTop: '20px' }}
      >
        <Typography>Laptops</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Desktops</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Gaming PCs</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Processors</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Motherboards</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Laptops</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Memory(RAM)s</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Graphic Cards</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Storages</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Power Supplies</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Monitors</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Accessories</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Software</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>

      <MenuItem className={classes.menuItem} onClick={handleClose}>
        <Typography>Casings</Typography>
        <img width="25px" height="25px" src="/images/desktop.png" />
      </MenuItem>
    </Paper>
  );
}
