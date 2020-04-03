import React, {Fragment} from 'react';
import {Typography, Button} from '@material-ui/core';
import AuthContext from './AuthContext';
import LoginForm from './LoginForm'

class AuthToggleLink extends React.Component {
    constructor(props) {
      super(props);  
      this.state = {
          login_form:false 
      };
      this.handleLogin = this.handleLogin.bind(this);
      this.handleClose = this.handleClose.bind(this);
    }

  handleLogin(event) {
    this.setState({login_form:true})
  }

  handleClose(event) {
    this.setState({login_form:false})
  }

  render() {
    if (this.context.user) {
      return (  
        <Fragment>
          <Button color="inherit" onClick={this.context.logout}>  {this.context.user.first_name} Logout</Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
            <Button onClick={this.handleLogin}
            color="inherit">Login</Button>
            {this.state.login_form  &&
              <LoginForm
                open={this.state.login_form}
                handleClose={this.handleClose}
             />}
        </Fragment>
      )
    }
  }
}
AuthToggleLink.contextType = AuthContext;
export default AuthToggleLink;
