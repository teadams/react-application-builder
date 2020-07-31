import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js'
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
//

  if (!field_models[input_object_type][input_field_name]) {
      alert ("No field in model. Object Type: " + input_object_type + " Field: " + input_field_name)
  }
  const field_model = field_models[input_object_type][input_field_name]

  // isolate input props to merge into model
  const {data:input_data, override_meta_model=true, object_type:discard_object_type, field_name:discard_field_name, handleFormChange:props_handleFormChange, handleFormSubmit:props_handleFormSubmit, formValues:props_formValues, lastTouched:props_lastTouched, key_id, autoFocus=false, ...merging_props} = input_props

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

  // merge in props and field_model to get final component model
  const rab_component_model = control.getFinalModel("field", {...merging_props}, field_model, null, override_meta_model)

  const field_component_model = rab_component_model.field
  let massaged_props = field_component_model.props
  massaged_props.id = input_props.id
u.a("field_component_model",Object.keys(field_component_model.props))
  // "pre" convention is before call to get data.
  // do not want to render page before final data and object_type, etc match
  const {object_type:pre_fetch_object_type, id:pre_fetch_id, field_name:pre_fetch_field_name,  api_options:pre_fetch_api_options, component, click_to_edit=true, mouseover_to_edit=false, mode:initial_mode, form,  emphasis, ...params} = massaged_props
  // control of mode (view, edit, create, list)
  const [mode, setMode] = useState(initial_mode);
  const [more_detail, setMoreDetail]  = useState(false)

  // get data from api 
  // return params for render and data at the same time
  let [ready, object_type, id, field_name, api_options, data] = useGetObject(pre_fetch_object_type, pre_fetch_id,pre_fetch_field_name, pre_fetch_api_options, props_data, null, pre_fetch_object_type); 

  // form setup - if necessary
  const field_list = ["id", field_name]  
  const {formValues=props_formValues, lastTouched=props_lastTouched, handleFormChange=props_handleFormChange, handleFormSubmit=props_handleFormSubmit} = useForm(object_type, form_field_name, data, handleSubmit, mode, form, "", field_list);

  if (!data || (object_type && !field_model) || mode === "hidden" || field_model.hidden_on_form && initial_mode ==="edit" ||  (field_model.hidden_on_form || field_model.hidden_on_create_form) && initial_mode==="create") return null

  // ***************************************************//
  // Data and final values ready for render             //
  // **************************************************//

  // isolate data object 
  // navigate to proper object for  references and dot notation
    const row_data = data
  // references

  if (data && field_model.data_path) {
      data = row_data[field_model.data_path]
  }

  function toggleMoreDetail(event) {
    setMoreDetail(!more_detail)
  } 

  function handleSubmit(event, result, form_values_object) {
      setMode(initial_mode)  
      if (input_props.onFieldSubmit) {
        input_props.onFieldSubmit(event,result,form_values_object)
      }
  }

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

  u.a("massaged",Object.keys(massaged_props))

  return (
    <ACSFieldRenderer {...field_component_model.props}  
    data={data} 
    row_data={row_data}
    formValues = {formValues}
    label_width = {merging_props.label_width}
    onChange={handleFormChange}
    onSubmit={handleFormSubmit}
    col_span={field_model.col_span}
    with_thumbnail= {field_model.with_thumbnail}
    autoFocus ={(field_name === lastTouched || (autoFocus && !lastTouched) || form)?true:false}
    onMouseOver={(form&&((mode!=="create"&&mode!=="edit")&&mouseover_to_edit))?toggleEditMode:""}
    onFieldClick={handleFieldClick} 
    onFieldBlur = {handleOnFieldBlur} 
    object_type={object_type} 
    field_name = {field_name}
    form_field_name={form_field_name}
    field_name={field_name} 
    field_model={field_model}
    mode={mode}
    more_detail={more_detail}
    toggleMoreDetail={toggleMoreDetail}
    form={form}
    rab_component_model={rab_component_model}
    key={key_id+"_render_"+field_name}
    {...massaged_props}
/>
  )
}

export default ACSFieldController;
