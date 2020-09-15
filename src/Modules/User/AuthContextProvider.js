import React, {  useState} from 'react';
import AuthContext from './AuthContext.js'
import useGetModel from "../../Hooks/useGetModel.js"
import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';


function AuthContextProvider(props) {
  const app_params =  useGetModel("app_params")
  const default_context =app_params["context_default_object"]

  const [user, setUser] = useState("");
  const [subsite, setSubsite] = useState("");
  const [context_id, setContextId] = useState(default_context);
  const [dirty_stamp, setDirtyData] = useState(Date.now());


  const handleRefreshSubsiteContext = (context_id) => {
    api.getData ("core_subsite", ({id:context_id}), (subsite_data, error) => {  
      if (error) {
        alert ("error " + error.message)
      } else {
        if (subsite_data[0]) {
          setSubsite(subsite_data[0])
        } else {
          setSubsite({})
        }
      }
    })
  }

  const handleRefreshContext = () => {
    // only refresh if logged in
    if (user.id) {
      api.getUserContext (user.id,  (user_data, error) => {
        if (error) {
          alert ("error " + error.message)
        } else {
          setUser(user_data)
        }
      })
    }
  }


  return (
    <AuthContext.Provider
      value={{
      user: user,
      context_id: context_id,
      subsite: subsite, 
      dirty_stamp: dirty_stamp,
      setDirty: () => {
        setDirtyData(Date.now())},
      logout: ()=> {setUser("")},  
      refreshUserContext: () => {
        handleRefreshContext()},
      login: (user)=> {
      setUser(user)},    
      setContextId:  (new_context_id)=> {
        if (context_id !== new_context_id) {
          setContextId(new_context_id)    
          handleRefreshSubsiteContext(new_context_id)
        } else if (!subsite) {
          handleRefreshSubsiteContext(new_context_id)
        }
      }}}>
        {props.children}
      </AuthContext.Provider>)
}

export default AuthContextProvider