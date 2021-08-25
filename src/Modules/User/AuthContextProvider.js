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
  const handleRefreshSubsiteContext = (new_context_id, user_id) => {
    if (user_id === undefined) {
      user_id = user.id
    }
    api.getData ("core_subsite", ({id:new_context_id,user_id:user_id}), (subsite_data, error) => {  
      if (error) {
        alert ("error " + error.message)
      } else {
        if (subsite_data[0]) { 
          setContextId(new_context_id)    
          setSubsite(subsite_data[0])
        } else {
          setContextId(new_context_id)    
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
          handleRefreshSubsiteContext()
        }
      })
    }
  }

  // Cache is simple
  // For each object type, we mark the last time 
  // there has been an update that that object type or 
  // a related object type.
  // If data was retrieved before this time stamp, 
  // getObjectType and getObjectList will automatically
  // refresh. 
  // User Context chacing is handled seprately.
  // There is no attempt to refresh by individual row/id (hard to get right)
  const handleDirtyData = (object_type) => {
    let dirty_object = _.merge({},dirty_stamp);
    if (object_type) {
      dirty_object[object_type] = Date.now();
      const object_type_model = object_types_model[object_type]
      for (const dependent_object_type of object_type_model.dependent_object_types) {
        // clear all the object types that may have also changed
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
      logout: ()=> {setUser("");
          localStorage.removeItem("user");
          handleRefreshSubsiteContext(context_id,"")},  
      refreshUserContext: () => {
        handleRefreshContext()},
      login: (user)=> {
        setUser(user)
        handleRefreshSubsiteContext(context_id,user.id)},  
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