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
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';

const ITEM_HEIGHT = 48;

const SignedInLinks = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElTransactions, setAnchorElTransactions] = React.useState(null);
  const [anchorElStyled, setAnchorElStyled] = React.useState(null);

  function handleClickStyled(event) {
    setAnchorElStyled(event.currentTarget);
  }

  function handleCloseStyled() {
    setAnchorElStyled(null);
  }

  const open = Boolean(anchorEl);
  const openTransactions = Boolean(anchorElTransactions);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClickTransactions(event) {
    setAnchorElTransactions(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleCloseTransactions() {
    setAnchorElTransactions(null);
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
      <li>
        <Button
            variant="contained"
            className="button"
          >
          <NavLink to="/create">New Project</NavLink>
          </Button>
      </li>
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
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}
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
            <MenuItem key="home">
              <NavLink className="blackText" to="/"><span>Home</span></NavLink>
            </MenuItem>
            <MenuItem key={signOut}  onClick={props.signOut} >
              <span>SignOut</span>
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
 
