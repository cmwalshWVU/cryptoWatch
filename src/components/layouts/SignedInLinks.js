import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../store/actions/authActions';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import './Nav.css';

const ITEM_HEIGHT = 48;

const SignedInLinks = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <ul className="right">
      <li><NavLink to="/create">New Project</NavLink></li>
      <li><NavLink to="/record">New Transaction</NavLink></li>
      <li>
        <div
        className="btn btn-floating lighten-1"
          onClick={handleClick}
        >
        {props.profile.initials}
        </div>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 200,
          },
        }}
      >
          <div >
            <h3 className="name" >{props.profile.firstName} {props.profile.lastName}</h3>
            <h4 className="name"> {props.profile.email}</h4>
          </div>
          <MenuItem key={signOut}  onClick={props.signOut}>
            SignOut
          </MenuItem>
      </Menu>
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
 
