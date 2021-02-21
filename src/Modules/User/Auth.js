import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';


import React, {Fragment,useLayoutEffect, useState, useContext} from 'react';
import {Typography, Button} from '@material-ui/core';
import AuthContext from './AuthContext';
import LoginForm from './LoginForm'
import * as auth from '../../Utils/auth.js'
import * as meta from '../../Utils/meta.js';
import * as u from '../../Utils/utils.js'
import useGetModel from '../../Hooks/useGetModel.js'

function Auth(props) {
  let {auth_scope="", auth_priv="", auth_action="read", object_type, object_models:input_object_models, prompt_login=true, require_authorization=true, data=""} = props
  // for safety making this explicit instead of defaulting

  if (["view","csv","list"].includes(auth_action)) {auth_action="read"}
  if (["list_edit"].includes(auth_action)) {auth_action="edit"}
  if (["list_create"].includes(auth_action)) {auth_action="create"}

  const [login_form, setLoginForm] = useState(false)
  let object_type_meta = useGetModel("object_types", object_type)
  if (input_object_models) {
      object_type_meta = input_object_models[object_type]
  }
  const app_params  = useGetModel("app_params")
  const context = useContext(AuthContext)
  
  // shwo butotn regardless
  if (!require_authorization) {
      return (
        <Fragment>{props.children}</Fragment>
      )
  }

  function handleLogin() {
      setLoginForm(false)
  }

  function handleClose(event) {
    if (props.onClose) {
        props.onClose()
    }
  }

   [auth_scope,auth_priv] = auth.getAuthScopeAndPriv(object_type_meta,auth_action, app_params, auth_scope,auth_priv);

  let show_children = true

  if (auth_priv !== "public") {
        if (!context.user ) {
          show_children = false
         if (!login_form && prompt_login) {

             setLoginForm(true)
         }    
       }
  }
  

  const authorized = auth.authorized({context_id:context.context_id, user:context.user}, auth_scope, auth_priv, auth_action, object_type_meta, data, app_params)


  if (login_form && !context.user) {
    return ( 
      <LoginForm open={login_form} onLogin={handleLogin} onClose={handleClose}/>
           )
  } else if (authorized && props.onAuthorized) {
      props.onAuthorized()
      return null
  } else if (authorized && show_children) {
    return (
      <Fragment>{props.children}</Fragment>
          )
  } else if (!authorized && show_children) {
      // normal navigation would not reach here
          if (props.handleClose) {
            props.handleClose()
          }
          return null
  } else {
    // should not reach here by logic
            return null
  }    
  
}
export default Auth;
