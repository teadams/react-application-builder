import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js'
import * as api from '../Utils/data.js'
import _ from 'lodash/object'

import React, { Component, Fragment,  useRef, useState, useContext, useEffect} from 'react';
import {ACSFieldRenderer} from '../ACSRenderEngine/'

import useGetObject from '../Hooks/useGetObject';
import useGetModel from '../Hooks/useGetModel';
import useForm from '../Hooks/useForm';

import * as control from "../Utils/control.js"
import useGenerateFieldList from '../Hooks/useGenerateFieldList';

function ACSFieldController(input_props) {

  const default_object_type_models = useGetModel("object_types")
  const default_field_models =  useGetModel("fields")
  const ref_rab_component_model = useRef(null)

  //// *** NOW HAVE APPROPRIATE MODELS *****
  const {object_type:props_object_type, id:props_id, field_name:props_field_name, api_options:props_api_options, data:input_data, onData:props_onData,
  handleFormChange:props_handleFormChange, handleFormSubmit:props_handleFormSubmit, formValues:props_formValues, lastTouched:props_lastTouched, onBlur, onFieldClick,  
  mode="view", key_id, override_meta_model=true, autoFocus=false, ...merging_props} = input_props

  // Data may be provided in prop field in addition to data object
  let props_data = input_data
  if (!props_data && input_props.value) {
      props_data = {[input_props.field_name]:input_props.value}
  } 

  // useGetObject has a buffer so that everything changes when the data chnages
  let [object_type, id, field_name, api_options, data] = useGetObject(props_object_type, props_id, props_field_name, props_api_options, props_data, props_onData); 

  ////// ***** DATA and MODEL INPUTS ARE NOW ALIGNED *********

  // XX make a proc - send input props, also layouts
  
  let field_models, object_models
  if (input_props.field_models) {
    if (input_props.field_models_built) {
      field_models = input_props.field_models
    } else { 
      field_models =_.merge({}, input_props.field_models)
    }
  } else if (!input_props.field_models) {
    field_models=_.merge({}, default_field_models)
  } 


  if (input_props.object_type_models) {
    object_models = input_props.object_type_models
  } else {
    object_models = default_object_type_models
  }
  if (!field_models[input_props.object_type][input_props.field_name]) {
      alert ("No field in model. Object Type: " + input_props.object_type + " Field: " + input_props.field_name)
  }

  const field_model = field_models[object_type][field_name]
  field_model.formValues_name = field_name
  const form_field_name = field_name

/// ** BASE MODELS ARE NOW DETERMINED **** ///

/// ** BUILD FINAL MODEL ***///
  if (ref_rab_component_model.current === null || ref_rab_component_model.current.field_name !== field_name) {
    // merge in props and field_model to get final component model
    ref_rab_component_model.current = control.getFinalModel("field", {...merging_props}, field_model, null, override_meta_model)
    ref_rab_component_model.current.field_name =field_name
  }
  // Performance optimized. This impact is that objects inside rab_component_model can not be mutated.
  const rab_component_model = ref_rab_component_model.current

  // ** Extract other props from model **//

  const field_component_model = rab_component_model.field
  let field_model_props = field_component_model.props

  const {form, valid_values:model_valid_values, select_api_options={}, dependent_field, dependent_filter, ...params} = field_model_props
  const {references} = field_model

  const [valid_values, setValidValues] = useState("")
  const field_list = ["id", field_name]  
  
  const handleSubmit= (event) => {
    if (input_props.onSubmit) {
        input_props.onSubmit(event)
    }
  }
  // for ROWS
  const {formValues=props_formValues, lastTouched=props_lastTouched, handleFormChange=props_handleFormChange, handleFormSubmit=props_handleFormSubmit} = useForm(object_type, form_field_name, data, handleSubmit, mode, form, "", field_list);

  let current_dependent_value = formValues?(dependent_field?formValues[dependent_field]:null):null
  
  const [dependent_value, setDependentValue] = useState(current_dependent_value)
  if (model_valid_values && (!valid_values || (dependent_field && (current_dependent_value !== dependent_value))) && ["edit", "create"].includes(mode)) {
      if (dependent_field && current_dependent_value !== dependent_value) {
        setDependentValue(current_dependent_value)
      }
      if (model_valid_values === "object") {
        if (dependent_field) {
          if (!select_api_options.filter_id) {
              select_api_options.filter_id = []
              select_api_options.filter_field = []
          } 
          select_api_options.filter_id.push(current_dependent_value)
          select_api_options.filter_field.push(dependent_filter)
        }

        api.getData (field_model.references_object_type,select_api_options, (results, error) => {         
              if (error) {
                  alert ("error retrieving object " + references + " " + error.message)
              } else {
                results = results
                if (!field_model.field_required) {
                    const new_value = {}
                    new_value[field_model.references_field] = ""
                    new_value[field_model.display_field] = "  *** Select ***"
                    results.unshift(new_value)
                }
                setValidValues(results)
              }
          })
        
      } else {
        setValidValues(model_valid_values)
      }
  }


  if (data === undefined || (object_type && !field_model) || mode === "hidden" || field_model.hidden_on_form && mode ==="edit" ||  (field_model.hidden_on_form || field_model.hidden_on_create_form) && mode==="create") return null

  // XX Make a proc
  const row_data = data
  if (data && field_model.data_path && mode !=="edit" && mode !== "create") {
      const data_path = field_model.data_path.split(".")
      if (row_data.hasOwnProperty(data_path[0])) {
        data = row_data[data_path[0]]
      } else {
        // query did not retrieve this data  
        // example, referred by that has not been expanded
        data = null
      }
      if (data_path[1]  ) {
        if (data.hasOwnProperty(data_path[1])) {
         data = data[data_path[1]]
        } else {
          data = null
        }
      }
 }

  
  function handleFieldClick(event, id, type, field_name, row_data, field_data) {
    if (onFieldClick) {
      onFieldClick(event,id,type,field_name,row_data,field_data)
    }
  }

  function handleOnFieldBlur(event) {
    if (onBlur) {
      onBlur()
    }
  }
  return (
     <ACSFieldRenderer 
    {...field_model}
    {...field_model_props}
    data={data} 
    row_data={row_data}
    formValues = {formValues}
    object_type={object_type} 
    field_name = {field_name}
    form_field_name={form_field_name}

    field_models={field_models}
    field_model={field_model}
    // specifics about the input field
    model_valid_values={model_valid_values}
    valid_values = {valid_values}
// mode and is this s afield form
    mode={mode}
    form={form}
// form
    onChange={handleFormChange}
    onSubmit={handleFormSubmit}
    with_thumbnail= {field_model.with_thumbnail}
    autoFocus ={(field_name === lastTouched || (autoFocus && !lastTouched) || form)?true:false}
    onFieldClick={handleFieldClick} 
    onFieldBlur = {handleOnFieldBlur} 
    // components
    components={rab_component_model.field.components}
    key={key_id+"_render_"+field_name}

/>
  )
}

export default ACSFieldController;
