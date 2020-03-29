import React from 'react';
import { connect } from 'react-redux';
import { signOut } from '../store/actions/authActions';
import './Nav.css';
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
import TransactionDialog from '../transactions/TransactionDialog'

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

function SignedInLinks(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    right: false,
    bottom: false,
    left: false,
  });

  const [modalOpen, toggleModal] = React.useState(false)

  const toggleDrawer = (side, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [side]: open });
  };

  const toggleTransactionModal = () => {
    toggleModal(!modalOpen)
  }
  
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
        <ListItem button onClick={toggleTransactionModal}>
          <ListItemIcon>
            <CopyrightIcon />
          </ListItemIcon>      
          <ListItemText primary="# of Coins" > </ListItemText>
        </ListItem>
        <ListItem button onClick={toggleTransactionModal}>
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
     </List> 
    </div>
  );

  return (
    <div>
      <TransactionDialog modalOpen={modalOpen} toggleModal={toggleTransactionModal}/>
      <ul className="right">
        <li>
        <Button className="menuButton" onClick={toggleDrawer('right', true)}> <i className="menu-button material-icons md-16">menu</i></Button>
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
    </div>

  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default connect(null, mapDispatchToProps)(SignedInLinks);
 
