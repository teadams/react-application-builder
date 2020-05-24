import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import ModelContext from "./ModelContext.js"
import * as u from "./Utils/utils.js"
import * as meta from "./Utils/meta.js"

function ModelContextProvider(props) {
  const [app_params, setAppParams] = useState("");

  if (!app_params) {
    meta.load("app_params", model_results => {
          setAppParams(model_results)
    })
  }

  if (!app_params) {
    return null
  } else {
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
}

export default ModelContextProvider