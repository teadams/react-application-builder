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
import rab_component_models from '../Models/HealthMe/component.js'
import useGenerateFieldList from '../Hooks/useGenerateFieldList';

function ACSField(input_props) {

  // XX could be encapulated below if we use and unconvential approach
  // and that convolve it
  const object_type_models = useGetModel("object_types")
  const field_models =  useGetModel("fields")
  let field_model = field_models?field_models[input_props.object_type][input_props.field_name]:{}
  const {data:props_data, object_type:input_object_type, field_name:input_field_name, handleFormChange:props_handleFormChange, handleFormSubmit:props_handleFormSubmit, formValues:props_formValues, lastTouched:props_lastTouched, key_id, autoFocus=false, ...merging_props} = input_props

  // Use case - this field has been tagged with "references"
  // which indicates the field is from another object type.
  // Need to modify that the  object_type, field_name to 
  // represent the meta model from the other model and
  // provide the correct data.
  let final_data_target = ""
//  let final_model_object_type = input_object_type
  let final_field_name = input_field_name
  field_model.formValues_name = input_props.field_name

  // The REFERENCES field model 
  // has to have input into the component ,etc. But
  // some things like the label we want to take after the.
  // referring table.  Straight precedence? (I think)
  // XX this could be encapsulated in getFinalModel if we do a 
  // unconential approach. That would be much better as
  // this causes a lot of confusion about which object_type
  // and model we are actually using (see call to useForm)
  if (field_model && field_model.references) {
      // manipulate field_model and object_type to be from references
//      const references = field_model.references
    //  final_data_target = input_props.field_name
  //    final_model_object_type = field_model.references
      // XX server side
  //    const references_field_name = field_model.references_field?field_model.references_field:object_type_models[final_model_object_type].key_id 

    //  let references_field_model = field_models?field_models[final_model_object_type][references_field_name]:{}
      // XX done on server
//      field_model.formValues_name = input_props.field_name
      //field_model.field_component = field_model.field_component?field_model.field_component:"RABSelectField"
      // XX done on server
    //  field_model.select_display_field = object_type_models[final_model_object_type].pretty_key_id 
    //  field_model.final_object_type = final_model_object_type
  }

  merging_props.object_type = field_model.final_object_type
  merging_props.field_name = input_props.field_name
  // XX performance optimization, use state merging props (and only)
  // change those if props change
  const rab_component_model = control.getFinalModel("field", {...merging_props}, field_model)

  const field_component_model = rab_component_model.field
  const massaged_props = field_component_model.props

  const {object_type:props_object_type, id:props_id, field_name:props_field_name, api_options:props_api_options, component, click_to_edit=true, mouseover_to_edit=false, mode:initial_mode, form,  ...params} = massaged_props

  //u.a(initial_mode,input_props.field_name, field_model.hidden_on_form, field_model)

  const [mode, setMode] = useState(initial_mode);

  let [ready, object_type, id, field_name, api_options, data] = useGetObject(props_object_type, props_id,props_field_name, props_api_options, props_data); 

  const field_list = ["id", field_name]  
//  const field_list = useGenerateFieldList(object_type, field_name, data, mode, form, input_props.field_list)
  // hook rules. always has to run
  // care with inputs.  Form is based of the original object_type
  // and the original field_name (not the change for the references.

const {formValues=props_formValues, lastTouched=props_lastTouched, handleFormChange=props_handleFormChange, handleFormSubmit=props_handleFormSubmit} = useForm(input_object_type, input_props.field_name, data, handleSubmit, mode, form, "", field_list);

if (!data || (object_type && !field_model) || mode === "hidden" || field_model.hidden_on_form && initial_mode ==="edit" ||  (field_model.hidden_on_form || field_model.hidden_on_create_form) && initial_mode==="create") return null

// references data
// create form uses formValues as data, 
// which is flat
if (field_model.references && mode !="create") {
    data = data[input_props.field_name]
}


  // XX ?? look at rest of props and see if there are any other API options... what layer to do this in
  function handleSubmit(event, result, form_values_object) {
      setMode(initial_mode)      
  }

  function toggleEditMode(event, id, type, field_name, field_data) {  
      if (click_to_edit && !field_model.prevent_edit) {
          setMode("edit")
      }
      if (rab_component_model.field.props.onFieldClick) {
          rab_component_model.field.props.onFieldClick(event,id,type,field_name,field_data)
      }
  }
    
// Determine the mode
// state will track a current mode (edit or initial_mode)
// Use case
// When user clicks on a field that is not in edit/create mode, it will
// render a one-input form. When use mouse leaves the
// form, the form is submitted and the page returns
// to initial_mode (typically view or list)

function handleOnFieldBlur() {
  if (form) {
    setMode(initial_mode)
  }
}

return (
    <RenderACSField {...field_component_model.props}  data={data} 
    formValues = {formValues}
    object_type = {object_type}
    onChange={handleFormChange}
    onSubmit={handleFormSubmit}
    col_span={field_model.col_span}
    autoFocus ={(field_name === lastTouched || (autoFocus && !lastTouched) || form)?true:false}
    onMouseOver={(form&&((mode!=="create"&&mode!=="edit")&&mouseover_to_edit))?toggleEditMode:""}
    onFieldClick ={(form&&((mode!=="create"&&mode!=="edit")&&click_to_edit))?toggleEditMode:""}
    onFieldBlur = {handleOnFieldBlur} 
    object_type={object_type} field_name={field_name} field_model={field_model}
    mode={mode}
    form={form}
    rab_component_model={rab_component_model}
    key={key_id+"_render_"+field_name}/>
  )
}

export default ACSField;
