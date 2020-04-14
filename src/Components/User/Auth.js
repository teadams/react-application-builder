import React, {Fragment} from 'react';
import {Typography, Button} from '@material-ui/core';
import AuthContext from './AuthContext';
import LoginForm from './LoginForm'
import * as auth from '../../Utils/auth.js'


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
    this.setState({login_form:true})
  }

  handleClose(event) {
    this.setState({login_form:false})
    if (!this.context.user) {
        // cancelled
        this.props.handleClose()
    }
  }


  render() {
      const auth_scope = "site"
      const auth_priv = "admin"
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
            alert ("You do not have permission to do this action")
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
