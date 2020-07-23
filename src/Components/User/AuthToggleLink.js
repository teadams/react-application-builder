import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import React, {useState, useContext, Fragment} from 'react';
import {Typography, Button, IconButton} from '@material-ui/core';
import ACSImage from "../../Functional/Fields/ACSImage.js"
import AuthContext from './AuthContext';
import LoginForm from './LoginForm'

function AuthToggleLink(props) {
  const [login_form, setLoginForm] = useState(false)
  const handleLogin = (event) => {
    setLoginForm(true)
  }
  const handleClose= (event) => {
    setLoginForm(false)
  }
  const context = useContext(AuthContext)

  if (context.user) {
    return (
      <Fragment>
        <Button color="inherit" onClick={context.logout}> Logout</Button>
        <ACSImage image_object={context.user.thumbnail} letters={context.user.initials} size="small"/> &nbsp; {context.user.first_name}
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
