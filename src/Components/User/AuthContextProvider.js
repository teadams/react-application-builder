import React, {  useState} from 'react';
import AuthContext from './AuthContext.js'
import useGetModel from "../../Hooks/useGetModel.js"

function AuthContextProvider(props) {
  const [user, setUser] = useState("");
  const [context_id, setContextId] = useState("");
  const [dirty_stamp, setDirtyData] = useState(Date.now());

  const app_params =  useGetModel("app_params")
  const default_context =app_params["context_default_object"]
  if (!context_id && default_context) {
    setContextId(default_context)
    return null
  }
  return (
    <AuthContext.Provider
      value={{
      user: user,
      context_id: context_id,
      dirty_stamp: dirty_stamp,
      setDirty: () => {setDirtyData(Date.now())},
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