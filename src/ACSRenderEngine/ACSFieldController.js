import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js'
import * as api from '../Utils/data.js'
import _ from 'lodash/object'

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {ACSFieldRenderer} from '../ACSRenderEngine/'

import useGetObject from '../Hooks/useGetObject';
import useGetModel from '../Hooks/useGetModel';
import useForm from '../Hooks/useForm';

import * as control from "../Utils/control.js"
import useGenerateFieldList from '../Hooks/useGenerateFieldList';

function ACSFieldController(input_props) {
  const default_object_type_models = useGetModel("object_types")
  const default_field_models =  useGetModel("fields")

  // merge in mdoels from props
  let field_models, object_models
  if (input_props.field_models) { 
    field_models =_.merge({}, input_props.field_models)
  } else {
    field_models=_.merge({}, default_field_models)
  }
  if (input_props.object_type_models) {
    object_models = input_props.object_type_models
  } else {
    object_models = default_object_type_models
  }
  // resolve field_names with dot notation (ie - core_address.name)
  let input_field_name = input_props.field_name
  let input_object_type = input_props.object_type

  if (!field_models[input_object_type][input_field_name]) {
      alert ("No field in model. Object Type: " + input_object_type + " Field: " + input_field_name)
  }
  const field_model = field_models[input_object_type][input_field_name]

  // isolate input props to merge into model
  const {data:input_data, override_meta_model=true, object_type:props_object_type, field_name:discard_field_name, handleFormChange:props_handleFormChange, handleFormSubmit:props_handleFormSubmit, formValues:props_formValues, lastTouched:props_lastTouched, key_id, autoFocus=false, ...merging_props} = input_props

  // look for value if data was not provided
  let props_data = input_data
  if (!props_data && input_props.value) {
      // will cause an infinite loop if this is used in combination with form 
      // triggers useGetObject to keep setting state as param_data is technically changing 
      // not sure if this use case will happen (this mgiht only be for views)
      props_data = {[input_props.field_name]:input_props.value}

  } 
  // formValues (state for forms) uses field_name WITH dot notation
  field_model.formValues_name = input_field_name

  // fields that reference another object type
  merging_props.object_type = input_props.object_type


  merging_props.field_name = input_props.field_name
  const form_field_name = input_props.field_name

  let trace = false 
  if (input_props.field_name === "type" && (input_props.object_type === "nwn_project" || input_props.object_type === "core_subsite")) {
      trace = true 
  }
  
  // merge in props and field_model to get final component model
  const rab_component_model = control.getFinalModel("field", {...merging_props}, field_model, null, override_meta_model, trace)

  const field_component_model = rab_component_model.field
  let massaged_props = field_component_model.props
  massaged_props.id = input_props.id
  // "pre" convention is before call to get data.
  // do not want to render page before final data and object_type, etc match

  // massaged_props has all the merged props from field_model, input,
  // etc.
  // Use values in massaged props below

  const {object_type:pre_fetch_object_type, id:pre_fetch_id, field_name:pre_fetch_field_name,  api_options:pre_fetch_api_options, component, click_to_edit=true, mouseover_to_edit=false, mode:initial_mode, form,  emphasis, valid_values:model_valid_values, select_api_options={},
  dependent_field, dependent_filter, ...params} = massaged_props
  const {references} = field_model
  // control of mode (view, edit, create, list)
  const [mode, setMode] = useState(initial_mode);
  const [more_detail, setMoreDetail]  = useState(false)
  const [valid_values, setValidValues] = useState("")

  // fetch valid values

  // get data from ap
  // return params for render and data at the same time
  let [ready, object_type, id, field_name, api_options, data] = useGetObject(pre_fetch_object_type, pre_fetch_id,pre_fetch_field_name, pre_fetch_api_options, props_data, input_props.onData); 

  // form setup - if necessary
  const field_list = ["id", field_name]  
  
  const handleSubmit= (event) => {
    if (input_props.onSubmit) {
        input_props.onSubmit(event)
    }
  }
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
                    const db_data_field = field_model.db_data_field
                    const select_display_field = field_model.field_select_display_field?field_model.field_select_display_field:field_model.data_field
                    const new_value = {}
                    new_value[db_data_field] = ""
                    new_value[select_display_field] = "  *** Select ***"
                    results.unshift(new_value)
                }
                setValidValues(results)
              }
          })
        
      } else {
        setValidValues(model_valid_values)
      }
  }


  if (data === undefined || (object_type && !field_model) || mode === "hidden" || field_model.hidden_on_form && initial_mode ==="edit" ||  (field_model.hidden_on_form || field_model.hidden_on_create_form) && initial_mode==="create") return null

  // ***************************************************//
  // Data and final values ready for render             //
  // **************************************************//

  // isolate data object 
  // navigate to proper object for  references and dot notation
    const row_data = data
  // references
  if (data && field_model.data_path && mode !=="edit" && mode !== "create") {
      const data_path = field_model.data_path.split(".")
      data = row_data[data_path[0]]
      if (data_path[1]) {
        data = data[data_path[1]]
      }
 }

  function toggleMoreDetail(event) {
    setMoreDetail(!more_detail)
  } 

  //function handleSubmit(event, result, form_values_object) {
  //    setMode(initial_mode)  
  //    if (input_props.onFieldSubmit) {
  //      input_props.onFieldSubmit(event,result,form_values_object)
  //    }
//  }

  function toggleEditMode(event, id, type, field_name, row_data, field_data) {  
      if (form && click_to_edit && !field_model.prevent_edit && mode!=="create" && mode !=="edit") {
          setMode("edit")
      }
  }
  
  function handleFieldClick(event, id, type, field_name, row_data, field_data) {
    if (rab_component_model.field.props.onFieldClick) {
      rab_component_model.field.props.onFieldClick(event,id,type,field_name,row_data,field_data)
    }
    toggleEditMode(event,id,type,field_name, row_data, field_data)
  }



  function handleOnFieldBlur(event) {
    if (form) {
      setMode(initial_mode)
    }
    if (input_props.onBlur) {
      input_props.onBlur()
    }
    if (mode === "filter") {
      handleFormSubmit(event)
    }
  }
  
  return (
     <ACSFieldRenderer 
    // destructured props from field_model
    {...massaged_props}

    data={data} 
    row_data={row_data}
    formValues = {formValues}
    object_type={object_type} 
    referred_by_object_type = {field_model.referred_by_object_type}
    field_name = {field_name}
    form_field_name={form_field_name}
    data_field = {field_model.data_field}
    display_field = {field_model.display_field}
    references_field = {field_model.references_field}
    pretty_name = {field_model.pretty_name}
    data_type = {field_model.data_type}
    col_span = {field_model.col_span}
    field_models={field_models}
    field_model={field_model}
// specifics about the input field
    model_valid_values={model_valid_values}
    valid_values = {valid_values}
// mode and is this s afield form
    mode={mode}
    form={form}
    click_to_edit={click_to_edit}
// more detail functionality
    more_detail={more_detail}
    toggleMoreDetail={toggleMoreDetail}
// form
    onChange={handleFormChange}
    onSubmit={handleFormSubmit}
    with_thumbnail= {field_model.with_thumbnail}
    autoFocus ={(field_name === lastTouched || (autoFocus && !lastTouched) || form)?true:false}
    onMouseOver={(form&&((mode!=="create"&&mode!=="edit")&&mouseover_to_edit))?toggleEditMode:""}
    onFieldClick={handleFieldClick} 
    onFieldBlur = {handleOnFieldBlur} 
    // components
    components={rab_component_model.field.components}
    key={key_id+"_render_"+field_name}

/>
  )
}

export default ACSFieldController;
