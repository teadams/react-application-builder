import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import ModelContext from "./ModelContext.js"
import * as u from "./Utils/utils.js"
import * as meta from "./Utils/meta.js"

function ModelContextProvider(props) {
  const [meta_model, setMetaModel] = useState("");

  if (!meta_model) {
    meta.load("all", model_results => {
          setMetaModel(model_results)
    })
  }

  if (!meta_model) {
    return null
  } else {
    return (
      <ModelContext.Provider
        value={{
        app_params: meta_model.app_params,
        object_types: meta_model.object_types,
        fields: meta_model.fields
        }}>
        {props.children}
      </ModelContext.Provider>)
  }
}

export default ModelContextProvider