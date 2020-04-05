import React, { Component, Fragment} from 'react';
import AuthContext from './AuthContext';
import * as meta from '../../Utils/meta.js';



class AuthProvider extends Component {
  constructor(props) {
      super(props);
      const default_context_id = meta.get_param("context_default_object")
      this.state = {
          user: "",
          context_id: default_context_id
      };
  } 
    render() {
        return (
            <AuthContext.Provider
            value={{
               user: this.state.user,
               context_id: this.state.context_id,
               logout: ()=> {this.setState({user:""})},   
               login: (user)=> {
                  this.setState({user:user})},    
                setContextId:  (context_id)=> {
                 this.setState({context_id:context_id})    
                }
              }}
            >      
            {this.props.children}
            </AuthContext.Provider>
        );
    }
}

export default AuthProvider