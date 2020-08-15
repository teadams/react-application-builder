import React, {useState} from 'react';
import ModelContext from "./ModelContext.js"
import * as meta from "./Utils/meta.js"
import * as u from "./Utils/utils.js"
import * as control from "./Utils/control.js"

function ModelContextProvider(props) {
  const [meta_model, setMetaModel] = useState("");

  if (!meta_model) {
    meta.load("all", model_results => {
        // Object.keys(model_results.fields).forEach(object_type => {
        //   Object.keys(model_results.fields[object_type]).forEach(field =>{
        //     field=model_results.fields[object_type][field]
        //       field.rab_component_model = control.buildRABModel(field, false)
        //       field.built = true
        //       field.build_source = "load_fields"
        //   })
        // })
        // Object.keys(model_results.object_types).forEach(object_type => {
        //     object_type = model_results.object_types[object_type]
        //     object_type.rab_component_model = control.buildRABModel(object_type, false)
        //     object_type.built = true
        //     object_type.build_source = "load_object_types"
        // 
        // })

        Object.freeze(model_results)
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
        fields: meta_model.fields,
        menus: meta_model.menus,
        sections: meta_model.sections,
        layouts:meta_model.layouts,
        field_lists:meta_model.field_lists
        }}>
        {props.children}
      </ModelContext.Provider>)
  }
}

export default ModelContextProvider