import React, { Component, Fragment} from 'react';
import AuthContext from './AuthContext';


class AuthProvider extends Component {
  constructor(props) {
      super(props);
      this.state = {
          user: ""
      };
  } 
    render() {
        return (
            <AuthContext.Provider
            value={{
               user: this.state.user,
               logout: ()=> {this.setState({user:""})},   
               login: (user)=> {this.setState({user:user})}    
              }}
            >      
            {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export default AuthProvider