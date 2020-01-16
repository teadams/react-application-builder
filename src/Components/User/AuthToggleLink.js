import React, {Fragment} from 'react';
import {Typography, Button} from '@material-ui/core';
import AuthContext from './AuthContext';

class AuthToggleLink extends React.Component {
    constructor(props) {
      super(props);      
  }
  render() {
    if (this.context.user) {
      return (  
        <Fragment>
          <Button color="inherit">  {this.context.user} Logout</Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
            <Button color="inherit">Login</Button>
        </Fragment>
      )
    }
  }
}
AuthToggleLink.contextType = AuthContext;
export default AuthToggleLink;
