import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import AuthContext from './AuthContext.js'


function AuthContextProvider(props) {
  const [user, setUser] = useState("");
  const [context_id, setContextId] = useState("");

  return (
    <AuthContext.Provider
      value={{
      user: user,
      context_id: context_id,
      logout: ()=> {setUser({user:""})},   
      login: (user)=> {
      setUser({user:user})},    
      setContextId:  (context_id)=> {
      setContextId(context_id)    
      }}}>
        {props.children}
      </AuthContext.Provider>)
}

export default AuthContextProvider