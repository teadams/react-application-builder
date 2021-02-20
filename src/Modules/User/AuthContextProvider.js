import React, {  useState} from 'react';
import AuthContext from './AuthContext.js'
import useGetModel from "../../Hooks/useGetModel.js"
import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';
import _ from 'lodash/object'


function AuthContextProvider(props) {
  const app_params =  useGetModel("app_params")
  const object_types_model =  useGetModel("object_types")

  const default_context =app_params["context_default_object"]

  const [user, setUser] = useState("");
  const [subsite, setSubsite] = useState("");
  const [context_id, setContextId] = useState(default_context);
  const [dirty_stamp, setDirtyData] = useState({});


  const handleRefreshSubsiteContext = (context_id) => {
    api.getData ("core_subsite", ({id:context_id,user_id:user.id}), (subsite_data, error) => {  
      if (error) {
        alert ("error " + error.message)
      } else {
        u.a("retrieved subsite data, user", subsite_data[0], user.id)
        if (subsite_data[0]) { 
          setContextId(context_id)    
          setSubsite(subsite_data[0])
        } else {
          setContextId(context_id)    
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


  const handleDirtyData = (object_type) => {
    let dirty_object = _.merge({},dirty_stamp);
    if (object_type) {
      dirty_object[object_type] = Date.now();
      const object_type_model = object_types_model[object_type]
      for (const dependent_object_type of object_type_model.dependent_object_types) {
        dirty_object[dependent_object_type] = Date.now();
      }
      setDirtyData(dirty_object);
    }
  }

  return (
    <AuthContext.Provider
      value={{
      user: user,
      context_id: context_id,
      subsite: subsite, 
      dirty_stamp: dirty_stamp,
      setDirty: (object_type) => {
        handleDirtyData(object_type);
      },
      logout: ()=> {setUser("")},  
      refreshUserContext: () => {
        handleRefreshContext()},
      login: (user)=> {
      setUser(user)},    
      setContextId:  (new_context_id)=> {
        if (context_id !== new_context_id) {
          handleRefreshSubsiteContext(new_context_id)
        } else if (!subsite) {
          handleRefreshSubsiteContext(new_context_id)
        }
      }}}>
        {props.children}
      </AuthContext.Provider>)
}

export default AuthContextProvider