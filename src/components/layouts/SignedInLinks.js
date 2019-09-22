import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../store/actions/authActions';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './Nav.css';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const SignedInLinks = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElStyled, setAnchorElStyled] = React.useState(null);

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
      <li className="paddingRight">
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
      </li>
      <li>
        <div
        className="btn btn-floating lighten-1"
          onClick={handleClick}
        >
        {props.profile.initials}
        </div>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <div >
            <h3 className="name" >{props.profile.firstName} {props.profile.lastName}</h3>
            <h4 className="name"> {props.profile.email}</h4>
          </div>
          <MenuItem key="coin" onClick={() => handleClose()}>
            <ListItemIcon>
            <i className="material-icons Small paddingRight ">copyright</i>
              <NavLink className="blackText" to="/coinRecord"><span>Transaction</span></NavLink>
            </ListItemIcon>
          </MenuItem>
          <MenuItem key="dollar" onClick={() => handleClose()}>
            <ListItemIcon>
            <i className="material-icons Small">attach_money</i>
            <NavLink className="blackText" to="/record"><span> Transaction</span></NavLink>
            </ListItemIcon>
          </MenuItem>
          <hr/>
          <MenuItem key="home" onClick={() => handleClose()}>
            <ListItemIcon>
              <i className="material-icons Small paddingRight">home</i>
              <NavLink className="blackText" to="/"><span> Home</span></NavLink>
            </ListItemIcon>
          </MenuItem>
          <MenuItem key={signOut}  onClick={props.signOut} >
            <ListItemIcon>
              <i className="material-icons Small paddingRight">exit_to_app</i>
              Sign Out
            </ListItemIcon>
          </MenuItem>
        </StyledMenu>
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
 
