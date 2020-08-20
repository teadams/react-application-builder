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
import rab_component_models from '../Utils/component.js'


function ACSFieldController(original_props) {
  
  const default_object_type_models = useGetModel("object_types")
  const default_field_models =  useGetModel("fields")

  // Will make this s paoc
  let field_models, object_models
  if (original_props.field_models) {
    if (original_props.field_models_built) {
      field_models = original_props.field_models
    } else { 
      field_models = original_props.field_models

/// Fix this here
//      field_models =_.merge({}, original_props.field_models)
    }
  } else if (!original_props.field_models) {
    field_models=_.merge({}, default_field_models)
  } 


  if (original_props.object_type_models) {
    object_models = original_props.object_type_models
  } else {
    object_models = default_object_type_models
  }
  if (!field_models[original_props.object_type][original_props.field_name]) {
      alert ("No field in model. Object Type: " + original_props.object_type + " Field: " + original_props.field_name)
  }

  const field_model = field_models[original_props.object_type][original_props.field_name]

  const {object_type:props_object_type, id:props_id, field_name:props_field_name, api_options:props_api_options, data:input_data, onData:props_onData,
  handleFormChange:props_handleFormChange, handleFormSubmit:props_handleFormSubmit, formValues:props_formValues, lastTouched:props_lastTouched, onBlur, onFieldClick,  
  mode="view", key_id, autoFocus=false, rab_component_model, onSubmit, ...merging_props} = original_props
    //// *** NOW HAVE APPROPRIATE MODELS *****
  let input_props;
  if (original_props.built) {
    input_props = merging_props
  } else {
  // merge? - take out core props 
  // page does not Submit 
  // type autofocuse
  // Type called 3 times
    if (original_props.rab_component_model) {   
      input_props = { ...rab_component_model.field.props, ...rab_component_model.field.names, ...field_model, ...merging_props}
    } else {
      input_props = {...field_model, ...merging_props}
    }
  }



  // Data may be provided in prop field in addition to data object
  let props_data = input_data
  if (!props_data && input_props.value) {
      props_data = {[input_props.field_name]:input_props.value}
  } 

  // useGetObject has a buffer so that everything changes when the data chnages
  let [object_type, id, field_name, api_options, data] = useGetObject(props_object_type, props_id, props_field_name, props_api_options, props_data, props_onData); 

  ////// ***** DATA and MODEL INPUTS ARE NOW ALIGNED *********

  // XX make a proc - send input props, also layouts
  /// XXX do not change field model
  field_model.formValues_name = field_name
  const form_field_name = field_name

/// ** BASE MODELS ARE NOW DETERMINED **** ///

  const {hidden_on_form, hidden_on_create_form, references, form, valid_values:model_valid_values, select_api_options={}, dependent_field, dependent_filter} = input_props

  const [valid_values, setValidValues] = useState("")
  const field_list = ["id", field_name]  
  
  const handleSubmit= (event) => {
    if (onSubmit) {
        onSubmit(event)
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

  if (data === undefined || (object_type && !field_model) || mode === "hidden" || hidden_on_form && mode ==="edit" ||  (hidden_on_form || hidden_on_create_form) && mode==="create") return null

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
    {...input_props}
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
    //components={rab_component_model.field.components}
    key={key_id+"_render_"+field_name}

/>
  )
}

export default ACSFieldController;
