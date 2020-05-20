import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import AuthContext from './AuthContext.js'


function AuthContextProvider(props) {
  const [user, setUser] = useState("");
  const [context_id, setContextId] = useState("");
  const [dirty_data, setDirtyData] = useState(false);


  return (
    <AuthContext.Provider
      value={{
      user: user,
      context_id: context_id,
      dirty_data: dirty_data,
      setDirty: () => {setDirtyData(true)},
      setClean: () => {setDirtyData(false)},
      logout: ()=> {setUser("")},   
      login: (user)=> {
      setUser(user)},    
      setContextId:  (context_id)=> {
      setContextId(context_id)    
      }}}>
        {props.children}
      </AuthContext.Provider>)
}

export default AuthContextProvider