import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import React, {useState, useContext, Fragment} from 'react';
import {Typography, Button, IconButton, Popover} from '@material-ui/core';
import ACSImage from "../../Functional/Fields/ACSImage.js"
import AuthContext from './AuthContext';
import PopupContext from '../../Template/PopupContext.js';
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
  const popup = useContext(PopupContext)

  const ProfilePopup = (props) => {
      return (<Typography> XXXX <Button>A REALLY NEW BUTTON</Button></Typography>)
  }

  const handlePopup= (event) => {
      popup.open(event, ProfilePopup)
  }

  if (context.user) {
    return (
      <Fragment>  
        <Button color="inherit" onClick={context.logout}>Logout</Button>
        <ACSImage image_object={context.user.thumbnail} letters={context.user.initials} size="small"/> &nbsp; 
        <Button onClick={handlePopup} color="inherit">{context.user.first_name}
        {popup.isOpen?<ExpandLessIcon size="small"/>:<ExpandMoreIcon size="small"/>}
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
