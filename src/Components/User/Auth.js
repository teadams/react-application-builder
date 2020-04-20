import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment} from 'react';
import {Typography, Button} from '@material-ui/core';
import AuthContext from './AuthContext';
import LoginForm from './LoginForm'
import * as auth from '../../Utils/auth.js'
import * as meta from '../../Utils/meta.js';


class Auth extends React.Component {
    constructor(props) {
      super(props);  
      this.state = {
          login_form:false,
      };
      this.handleLogin = this.handleLogin.bind(this);
      this.handleClose = this.handleClose.bind(this);
    }

  handleLogin(event) {
    alert ("logged in")
    this.setState({login_form:true})
  }

  handleClose(event) {
    alert ("handle Close")
    this.setState({login_form:false})
    if (!this.context.user) {
        // cancelled
        this.props.handleClose()
    }
  }


  render() {
      // the props can override what scope/priv the user must have
      let {auth_scope, auth_priv, auth_action, object_type} = this.props
      // otherwise, we look at the action and use app paramters
      // to determine the default for that action


      if (!auth_priv) {
        // map that links privleges to actions
         let auth_action_privs = "site"
         auth_scope = "site"
         if (object_type) {
            
            const object_attributes = meta.object(object_type)
            if (!object_attributes.all_subsites || object_attributes.extends_object == "core_subsite") {
              auth_action_privs = "context"
              auth_scope = "context"
            }         
            auth_action_privs =  object_attributes.auth_action_privs?object_attributes.auth_action_privs:auth_action_privs
          }
        auth_priv = meta.get_param("auth_action_privs")[auth_action_privs][auth_action]
      }
  
      let show_children = true
      if (auth_scope && auth_priv && auth_priv != "public") {
          if (!this.context.user) {
              show_children = false
              if (!this.state.login_form) {
                this.setState({login_form:true})
              }
          }
      } 
      const authorized = auth.authorized({context_id:this.context.context_id, user:this.context.user}, auth_scope, auth_priv)

        if (this.state.login_form && !this.context.user) {
          return ( 
            <Fragment>
              <LoginForm
                open={this.state.login_form}
                handleClose={this.handleClose}
            />
            </Fragment>
           )
          } else if (authorized && show_children) {
            return (
              <Fragment>
                {this.props.children}
              </Fragment>
            )
          } else if (!authorized && show_children) {

            this.props.handleClose()
            return ""
          } else {
            // should not reach here
            return ""
          }    
  }
}
Auth.contextType = AuthContext;
export default Auth;
