import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import ModelContext from "./ModelContext.js"


function ModelContextProvider(props) {
  const [app_params, setAppParams] = useState("");

  return (
    <ModelContext.Provider
      value={{
      app_params: app_params,
      setAppParams:  (app_params)=> {
      setAppParams(app_params)    
      }}}>
        {props.children}
    </ModelContext.Provider>)
}

export default ModelContextProvider