import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../store/actions/authActions';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './Nav.css';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import CopyrightIcon from '@material-ui/icons/Copyright'
import HomeIcon from '@material-ui/icons/Home'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

function SignedInLinks(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElStyled, setAnchorElStyled] = React.useState(null);
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    right: false,
    bottom: false,
    left: false,
  });


  const toggleDrawer = (side, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [side]: open });
  };


  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        <ListSubheader component="div" id="nested-list-subheader">
          Transactions
        </ListSubheader>
        <ListItem button component={Link} to="/coinRecord">
          <ListItemIcon>
            <CopyrightIcon />
          </ListItemIcon>      
          <ListItemText primary="# of Coins" > </ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/record">
          <ListItemIcon>
            <AttachMoneyIcon />
          </ListItemIcon>      
          <ListItemText primary="Dollar Amount" > </ListItemText>
        </ListItem>
        <Divider />
        <ListSubheader component="div" id="nested-list-subheader">
          Navigation
        </ListSubheader>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>      
          <ListItemText primary="Home" > </ListItemText>
        </ListItem>
        <ListItem button onClick={props.signOut}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>      
          <ListItemText primary="Log Out" > </ListItemText>
        </ListItem>
        <Divider />
        <ListSubheader component="div" id="nested-list-subheader">
          Account
        </ListSubheader>
        <div className="userInfo" >
          <div className="user-icon btn btn-floating lighten-1">{props.profile.initials}</div>
        </div>
          <div className="name"> {props.profile.firstName} {props.profile.lastName}</div>
          <div className="name"> {props.profile.email}</div>
          {/* <h4 className="name"> {props.profile.email}</h4> */}
     </List> 
    </div>
  );

  function handleClickStyled(event) {
    setAnchorElStyled(event.currentTarget);
  }

  function handleCloseStyled() {
    setAnchorElStyled(null);
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const StyledMenuItem = withStyles(theme => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })(props => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));

  return (
    <ul className="right">
      {/* <li className="paddingRight">
        <Button
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="contained"
          className="button"
          onClick={handleClickStyled}
        >
          <NavLink to='/'>New Transaction</NavLink>
        </Button>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorElStyled}
          keepMounted
          open={Boolean(anchorElStyled)}
          onClose={handleCloseStyled}
        >
          <StyledMenuItem>
            <NavLink to="/coinRecord">
              <ListItemIcon>
                <i className="material-icons Small paddingRight ">copyright</i>
                Transaction
              </ListItemIcon>
            </NavLink>
          </StyledMenuItem>
          <StyledMenuItem>
            <NavLink to="/record">
              <ListItemIcon>
                <i className="material-icons Small">attach_money</i>
                Transaction
              </ListItemIcon>
            </NavLink>
          </StyledMenuItem>
        </StyledMenu>
      </li> */}
      <li>
      <Button className="menuButton" onClick={toggleDrawer('right', true)}> <i className="material-icons md-16">menu</i></Button>
          <SwipeableDrawer
            anchor="right"
            open={state.right}
            onClose={toggleDrawer('right', false)}
            onOpen={toggleDrawer('right', true)}
          >
            {sideList('right')}
            <div  className="drawer-footer" >
              <Divider className="full-width"/>
              <div className="close-menu" onClick={toggleDrawer('right', false)} >
                <ListItemIcon >
                <i className="material-icons Small">close</i>
                Close Menu
                </ListItemIcon>
              </div>
            </div>
          </SwipeableDrawer>
      </li>
    </ul>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(null, mapDispatchToProps)(SignedInLinks);
 
