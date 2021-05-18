import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
//import * as u from '../../Utils/utils.js'
import React, {useState, useContext, Fragment} from 'react';
import { Button,  Divider} from '@material-ui/core';
import {ACSField, ACSListMenu, ACSImageView} from "../../ACSLibrary"
import AuthContext from './AuthContext';
import UIContext from '../../Template/UIContext.js';
import LoginForm from './LoginForm'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';


function AuthToggleLink(props) {
  const [login_form, setLoginForm] = useState(false)
  const handleLogin = (event) => {
    setLoginForm(true)
  }
  const handleClose= (event) => {
    setLoginForm(false)
  }
  const handleLogout = (event) => {
      setLoginForm(false)
      popup.close()
      context.logout()
  }
  const handleMenuClose= (event) => {
      popup.close()
  }

  const jwt_token = JSON.parse(localStorage.getItem('user'));

  const handleJWTLogin = () => {
    if (jwt_token) {
      api.login ( {},  (user_data, error) => {
          context.login(user_data)
      })
    }
  }

  const context = useContext(AuthContext)

  if (!jwt_token && context.user) {
    context.logout();    
  }

  const popup = useContext(UIContext).popup

  const ProfilePopup = (props) => {
      return (
      <Fragment>
      <div style={{margin:10, display:"flex",flexDirection:"row", alignItems:"center"}}>
        <div style={{display:"flex",flexDirection:"row", marginRight:10}}>
          <ACSImageView letters={context.user.first_name.charAt(0)+context.user.last_name.charAt(0)} image_object={context.user.thumbnail}/>
        </div>
        <div>
          <div style={{display:"flex", flexDirection:"column"}}>
            <ACSField object_type = "core_user" field_name = "first_name" data={context.user}/>
            <ACSField object_type = "core_user" field_name = "last_name" data={context.user}/>
          </div>
          <div>
            <ACSField object_type = "core_user" field_name = "email" data={context.user}/>
          </div>
      </div>
    </div>
    <Divider/>
    <div style={{margin:10, display:"flex",flexDirection:"row", alignItems:"center"}}>
    <Button color="inherit" onClick={handleLogout}>Logout</Button>

    </div>
    <ACSListMenu menu_type="user_profile" onClose={handleMenuClose}/>
    </Fragment>)
  }

  const handlePopup= (event) => {
      popup.open(event, ProfilePopup)
  }

  if (context.user) {
    return (
      <Fragment>  
        <ACSImageView image_object={context.user.thumbnail} letters={context.user.initials} size="small"/> &nbsp; 
        <Button onClick={handlePopup} color="inherit">{context.user.first_name}
        {popup.isOpen?<ExpandLessIcon size="small"/>:<ExpandMoreIcon size="small"/>}
        </Button>
      </Fragment>
      )
    } else if (jwt_token) {
      // token present but not logged in
      handleJWTLogin(); 
      return (<Fragment/>)
    } else {
      return (
        <Fragment>
            <Button onClick={handleLogin}
            color="inherit">Login</Button>
              <LoginForm
                open={login_form}
                onClose={handleClose}
             />
        </Fragment>
      )
    }
  }


export default AuthToggleLink;
