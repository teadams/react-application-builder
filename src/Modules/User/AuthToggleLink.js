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

  const context = useContext(AuthContext)
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
