import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';


import React, {Fragment, useState} from 'react';
import Auth from "./Auth.js";
import { Button } from '@material-ui/core';
import * as u from "../../Utils/utils.js"

function DelayedAuth(props) {
  const [auth_tag, setAuthTag] = useState(false)
  const {onClick,...auth_props} = props

  function handleOnClick(event) {
    setAuthTag(true)
  }

  function handleOnClose(event) {
    setAuthTag(false)
  }


  function handleOnClickAuth(event) {
    setAuthTag(false)
    if (onClick) {
        onClick()
    }
  }

  const require_authorization=auth_tag?true:false 

  return (<Auth {...auth_props} require_authorization={require_authorization} onAuthorized={handleOnClickAuth}  onClose={handleOnClose}>{props.children}</Auth>)

}


export default DelayedAuth;
