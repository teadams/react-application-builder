import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js'

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import useGetObject from '../Hooks/useGetObject';
import useGetModel from '../Hooks/useGetModel';

import * as control from "../Utils/control.js"
import rab_component_models from '../Models/HealthMe/component.js'


function ACSField(input_props) {
  const [mode, setMode] = useState("view");
  const field_models =  useGetModel("fields")
  let field_model = field_models?field_models[input_props.object_type][input_props.field_name]:{}
//  if (!field_models) {return null} *** Breaks our rule, which depended on all the models being loaded.
// not a priority now as we know the model is here. Will impact lazy loading of models.

  // take care of fields that do not need to be merged
  const {...merging_props} = input_props
  const rab_component_model = control.getFinalModel("field", {...merging_props}, field_model, field_model.rab_component_model)
  const component_field_model = rab_component_model.field
  const component_field_components = component_field_model.components
  const massaged_props = component_field_model.props

  const {object_type:props_object_type, id:props_id, field_name:props_field_name, api_options:props_api_options, data:props_data, component, ...params} = massaged_props

  let [ready, object_type, id, field_name, api_options, data] = useGetObject(props_object_type, props_id,props_field_name, props_api_options, props_data); 
  if (!data || (object_type && !field_model)) return null

// XX ?? look at rest of props and see if there are any other API options... what layer to do this in
  function handleViewClick(event) {
      setMode("edit")
  }

  function handleEditSubmit(event) {
      setMode("view")
  }
    
  // Use case - this field has been tagged with "references"
  // which indicates the field is from another object type.
  // Need to modify that the  object_type, field_name to 
  // represent the meta model from the other model and
  // provide the correct data.
  if (field_model && field_model.references) {
      const references = field_model.references
      data = data[field_name]
      object_type = field_model.references
      field_name = field_model.referenced_field?field_model.referenced_field:meta.keys(object_type).pretty_key_id
      let referenced_field_model = meta.fields(object_type)[field_name]
      referenced_field_model.pretty_name = field_model.pretty_name // take name from base object
      field_model = referenced_field_model
  }
  // props, meta, default
  
  const RenderACSField = component_field_components.field
  const ACSCell = component_field_components.field_wrap
// state will track a view/edit mode
// Use case
// When user clicks on a field in view mode, it will
// render a one-input form. When use mouse leaves the
// form, the form is submitted and the page returns
// to view mode.  

// I think the field will be responsible for the mode
return (
  <ACSCell {...component_field_model.props}  data={data} object_type={object_type} field_name={field_name} field_model={field_model}  rab_component_model={rab_component_model}>
    <RenderACSField {...component_field_model.props}  data={data} object_type={object_type} field_name={field_name} field_model={field_model} rab_component_model={rab_component_model}/>
  </ACSCell>
  )
}

export default ACSField;
