import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js'
import _ from 'lodash/object'

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

import RenderACSField from './RenderACSField.js'

import useGetObject from '../Hooks/useGetObject';
import useGetModel from '../Hooks/useGetModel';
import useForm from '../Hooks/useForm';

import * as control from "../Utils/control.js"
import useGenerateFieldList from '../Hooks/useGenerateFieldList';

function ACSField(input_props) {
  // XX could be encapulated below if we use and unconvential approach
  // and that convolve it
  const default_object_type_models = useGetModel("object_types")
  const default_field_models =  useGetModel("fields")
  let field_models, object_models
  if (input_props.field_models) {
    // expect these to have everything necessary. no merge
    field_models =_.merge({}, input_props.field_models)
  } else {
    // expect these to have everything necessary. no merge
    field_models=_.merge({}, default_field_models)
  }

  //u.a(Object.keys(input_props.data), input_props.field_name, field_models[input_props.object_type][input_props.field_name])
  if (input_props.object_type_models) {
    object_models = input_props.object_type_models
  } else {
    object_models = default_object_type_models
  }

  let input_field_name = input_props.field_name
  let input_object_type = input_props.object_type

  const [base_field_name, final_field_name, base_object_type, final_object_type, base_field_model, final_field_model] = meta.resolveFieldModel(input_object_type, input_field_name, object_models, field_models)

//  if (final_field_model.data_field) {
//    final_field_name = final_field_model.data_field
//  }

  const {data:input_data, override_meta_model=true, object_type:discard_object_type, field_name:discard_field_name, handleFormChange:props_handleFormChange, handleFormSubmit:props_handleFormSubmit, formValues:props_formValues, lastTouched:props_lastTouched, key_id, autoFocus=false, ...merging_props} = input_props
  const props_data = input_data?input_data:{[input_props.field_name]:input_props.value}

  // form values has the path (references.field)
  // data is structured as object
  final_field_model.formValues_name = input_field_name

  // The REFERENCES field model 
  // has to have input into the component ,etc. But
  // some things like the label we want to take after the.
  // referring table.  Straight precedence? (I think)
  // XX this could be encapsulated in getFinalModel if we do a 
  // unconential approach. That would be much better as
  // this causes a lot of confusion about which object_type
  // and model we are actually using (see call to useForm)

  const parent_object_type = final_object_type
  const parent_field_name = final_field_name
  
  merging_props.object_type = final_field_model.references?final_field_model.references:final_object_type
  // matches data

  merging_props.field_name = final_field_name
  // matches form values
  const form_field_name = input_props.field_name
//u.a("final field model",  final_field_model.field_display, final_field_model.rab_component_model.field.props)
//u.a("merging props", Object.keys(merging_props))
  const rab_component_model = control.getFinalModel("field", {...merging_props}, final_field_model, null, override_meta_model)

  const field_component_model = rab_component_model.field
  const massaged_props = field_component_model.props

//u.a("massaged_props", massaged_props)
  const {object_type:pre_fetch_object_type, id:pre_fetch_id, field_name:pre_fetch_field_name,  api_options:pre_fetch_api_options, component, click_to_edit=true, mouseover_to_edit=false, mode:initial_mode, form,  emphasis, ...params} = massaged_props


  const [mode, setMode] = useState(initial_mode);
  const [more_detail, setMoreDetail]  = useState(false)

  function toggleMoreDetail(event) {
    setMoreDetail(!more_detail)
  } 


  let [ready, object_type, id, field_name, api_options, data] = useGetObject(pre_fetch_object_type, pre_fetch_id,pre_fetch_field_name, pre_fetch_api_options, props_data); 


  const field_list = ["id", field_name]  
//  const field_list = useGenerateFieldList(object_type, field_name, data, mode, form, input_props.field_list)
  // hook rules. always has to run
  // care with inputs.  Form is based of the original object_type
  // and the original field_name (not the change for the references.
const {formValues=props_formValues, lastTouched=props_lastTouched, handleFormChange=props_handleFormChange, handleFormSubmit=props_handleFormSubmit} = useForm(base_object_type, form_field_name, data, handleSubmit, mode, form, "", field_list);

if (!data || (object_type && !final_field_model) || mode === "hidden" || final_field_model.hidden_on_form && initial_mode ==="edit" ||  (final_field_model.hidden_on_form || final_field_model.hidden_on_create_form) && initial_mode==="create") return null

// row_data - original row 
// data - object with this field's data 
//     (accounting for references)
// formValues is flat (base and reference data is the same level
const row_data = data

if (base_field_model.references && mode !== "create") {
    // move down to the reference row, which is named after the base field
    data = row_data[base_field_model.data_field?base_field_model.data_field:base_field_name]
}

if (data && ((base_object_type !== final_object_type) || (base_field_name !== final_field_name)) && mode !== "create") {
    data = row_data[base_field_name]
    if (data && final_field_model.references) {
      data = data[final_field_name]
    }
}
// row_data - original row

// form_field_name  - matches form values

  // XX ?? look at rest of props and see if there are any other API options... what layer to do this in
  function handleSubmit(event, result, form_values_object) {
      setMode(initial_mode)  
      if (input_props.onFieldSubmit) {
        input_props.onFieldSubmit(event,result,form_values_object)
      }
  }

  function toggleEditMode(event, id, type, field_name, row_data, field_data) {  
      if (form && click_to_edit && !final_field_model.prevent_edit && mode!=="create" && mode !=="edit") {
          setMode("edit")
      }

  }
  
  function handleFieldClick(event, id, type, field_name, row_data, field_data) {
    if (rab_component_model.field.props.onFieldClick) {
      rab_component_model.field.props.onFieldClick(event,id,type,field_name,row_data,field_data)
    }
    toggleEditMode(event,id,type,field_name, row_data, field_data)
}
// Determine the mode
// state will track a current mode (edit or initial_mode)
// Use case
// When user clicks on a field that is not in edit/create mode, it will
// render a one-input form. When use mouse leaves the
// form, the form is submitted and the page returns
// to initial_mode (typically view or list)

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
    <RenderACSField {...field_component_model.props}  
    data={data} 
    row_data={row_data}
    formValues = {formValues}
    onChange={handleFormChange}
    onSubmit={handleFormSubmit}
    col_span={final_field_model.col_span}
    with_thumbnail= {final_field_model.with_thumbnail}
    autoFocus ={(field_name === lastTouched || (autoFocus && !lastTouched) || form)?true:false}
    onMouseOver={(form&&((mode!=="create"&&mode!=="edit")&&mouseover_to_edit))?toggleEditMode:""}
    onFieldClick={handleFieldClick} 
    onFieldBlur = {handleOnFieldBlur} 
    object_type={object_type} 
    parent_object_type={parent_object_type}
    base_object_type = {base_object_type}
    form_field_name={form_field_name}
    field_name={final_field_name} 
    parent_field_name = {parent_field_name}
    base_field_name ={base_field_name}
    field_model={final_field_model}
    mode={mode}
    more_detail={more_detail}
    toggleMoreDetail={toggleMoreDetail}
    form={form}
    rab_component_model={rab_component_model}
    key={key_id+"_render_"+field_name}/>
  )
}

export default ACSField;
