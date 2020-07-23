import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import React, {useState, useContext, Fragment} from 'react';
import {Typography, Button, IconButton, Popover} from '@material-ui/core';
import ACSImage from "../../Functional/Fields/ACSImage.js"
import AuthContext from './AuthContext';
import LoginForm from './LoginForm'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';


function AuthToggleLink(props) {
  const [login_form, setLoginForm] = useState(false)
  const handleLogin = (event) => {
    setLoginForm(true)
  }
  const handleClose= (event) => {
    setLoginForm(false)
  }
  const context = useContext(AuthContext)
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleProfileClose = () => {
      setAnchorEl(null);
    };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const NewButton = (props) => {
      return (<Fragment> XXXX <Button>NEW BUTTON</Button></Fragment>)
  }
  if (context.user) {
    return (
      <Fragment>
      <Popover 
          id={id}
          open={open}
          anchorEl={anchorEl}
          children={<NewButton/>}
          onClose={handleProfileClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
      >
      </Popover>  
        <Button color="inherit" onClick={context.logout}>Logout</Button>
        <ACSImage image_object={context.user.thumbnail} letters={context.user.initials} size="small"/> &nbsp; 
        <Button onClick={handleProfileClick} color="inherit">{context.user.first_name}
        {open?<ExpandLessIcon size="small"/>:<ExpandMoreIcon size="small"/>}
        </Button>
      </Fragment>
      )
    } else {
      return (
        <Fragment>
            <Button onClick={handleLogin}
            color="inherit">Login</Button>
            {login_form  &&
              <LoginForm
                open={login_form}
                onClose={handleClose}
             />}
        </Fragment>
      )
    }
  }


export default AuthToggleLink;
