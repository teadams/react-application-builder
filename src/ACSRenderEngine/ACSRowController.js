// base libraries, React, MaterialUI, Hooks, Models 
import  'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import _ from 'lodash'

import * as u from '../Utils/utils.js';

import React, {Fragment,useRef} from 'react';

import {ACSFieldController, ACSRowRenderer} from '../ACSRenderEngine/'
import {ACSComboField} from '../ACSLibrary/'

import {DelayedAuth} from '../Modules/User/index.js';

import {   Table, TableBody, Typography } from '@material-ui/core';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, } from '@material-ui/core';

import useGetObject from '../Hooks/useGetObject';
import useGetModel from '../Hooks/useGetModel';
import useForm from '../Hooks/useForm';
import useGenerateFieldList from '../Hooks/useGenerateFieldList';

import * as control from "../Utils/control.js"
import rab_component_models from '../Utils/component.js'

// Will use the current inputs (object_type, data, id) until the 
//    data is returned  (maybe upcoping React concurrently will help)
//    It is important that any parameters that can change with User
//    input and the data that results are changed at the same time.
//    Otherwise, we are rendering with data that does not match the model.
//    For example, we could be rendeirng "core_user" data with and object_type
//    model from "core_roles", which would result in not only excess computation
//    but a mess of subtile and hard to find bugs.

// Conventions
// a) input props - raw input props
//     -- those that are used are immediated casted to input_props_xxx
// b) massaged props - props that have been merged according to 
//        precedence with the rab_component_model. Potentailly expensive
//        merges like data are not merged. This allows for props to override
//        the default values of the component_model. "Massages" may be 2
//        things.
//          1. The result of getFinalModel, which takes all the components
//               models, other inputs and uses precedence rules to 
//               determine the final compoent model to use for the 
//               rest of the function.
//          2. Individual manipulations
//  
// c) The result of a and b are used to protect the state.  Anything that
//       can change with user input (object_type, id) is saved inn
//       state until the data is returned.  Data and the appropriate 
//       inputs all change at the same time and returned by useGetObject.
//       
//       "normal" varaable names are used with the results of useGetObject, 
//        as these have now been massaged/state protected and ready for
//        normal use in the rest of the execution.

// Essentially, think of the function starting immediate after useGetObject! 
//   The rest is just prep

function ACSRow(row_props) {
  const {mode, form, field_chunk, field_models, data, field, rab_component_model, handleFormChange, handleFormSubmit, formValues, key_id, s_index, f_index,reference_formValues, reference_lastTouched} = row_props
  const {...row_params} = row_props
  const {field_chunk_wrap:FieldChunk} = rab_component_model.row.components
  return (
    <FieldChunk {...row_params} key={key_id+"chunk"}>
      {field_chunk.map( (field_name, ch_index) => {
           const autoFocus = (f_index === 0 && s_index === 0 && ch_index === 0 )?true:false
           const field_model = field_models[row_props.object_type][field_name]
           if (field_model.combo_fields) {
             return <ACSComboField {...row_params}  {...field_model} mode={mode} field_models={field_models} form={!form} field_name={field_name}  handleFormChange={handleFormChange} handleFormSubmit={handleFormSubmit}
             override_meta_model={false}
             autoFocus ={autoFocus}
             formValues={formValues} key={ch_index+"field_name"} key_id={ch_index} />
           } else {
            return <ACSFieldController {...row_params}  {...field_model} mode={mode} field_models={field_models} form={!form} field_name={field_name}  handleFormChange={handleFormChange} handleFormSubmit={handleFormSubmit}
            override_meta_model={false}
            autoFocus ={autoFocus}
            formValues={formValues} key={ch_index+"field_name"} key_id={ch_index}
            reference_formValues= {reference_formValues}
            reference_lastTouched = {reference_lastTouched}
          />
          }
      })}
    </FieldChunk>
  )
}

function ACSFormWrap(props) {
  const {object_type, dialog_size="sm", form_title} = props
  const object_types = useGetModel("object_types")
  if (!object_types) {return null}

  if (props.form && (props.mode === "edit" || props.mode === "create")) {
    const object_type_model = object_types[object_type]
    const object_type_pretty_name = object_type_model.pretty_name
    const form_message = (props.mode==="create")?object_type_model.create_message:object_type_model.edit_message
    if (props.dialog_center) {
        return (
            <form onSubmit={props.onSubmit}>
            {props.children}
            <DialogActions>
            <DelayedAuth  object_type={object_type} auth_action={props.mode} color="primary">
              <Button onClick={props.onSubmit} color="primary">{props.mode==="edit"?"save":props.mode}</Button>
            </DelayedAuth>
            {props.onClose && <Button onClick={props.onClose} color="primary">
              Close
           </Button>}
          </DialogActions>  
          </form>
        )

    } else {
      return (
        <Dialog fullWidth={true} maxWidth={dialog_size} open={Boolean(props.open)} onClose={props.onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{form_title?form_title:(u.capitalize(props.mode) + u.capitalize(object_type_pretty_name))}</DialogTitle>
          <DialogContent>
            {form_message && 
            <DialogContentText>{form_message}</DialogContentText>}
            <form onSubmit={props.onSubmit}>
            {props.children}
            <DialogActions>
            <DelayedAuth  object_type={object_type} auth_action={props.mode}>
            <Button onClick={props.onSubmit} color="primary">{props.mode==="edit"?"save":props.mode}</Button>
            </DelayedAuth>
            {props.onClose && <Button onClick={props.onClose} color="primary">
              Close
           </Button>}
          </DialogActions>  
          </form>
        < /DialogContent>
      </Dialog>)
    }
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

function ACSSectionWrap(props) {
  return (<Fragment>{props.children}</Fragment>)
}

function ACSSectionBodyWrap(props) {
  return (<Table style={{marginBottom:20}}>
            <TableBody>{props.children}</TableBody>
        </Table>)
}

function ACSSectionHeader(props) {
    const section_models = useGetModel("sections")
    const {section, num_columns} = props
    const {title,pretty_name} =section?section_models[section]:""
    return (<Fragment>
        {(title||pretty_name) && <Typography variant="h6" style={{paddingTop:0, paddingBottom:0}}>{title}{pretty_name}:</Typography>}
        </Fragment>)
}

function ACSRowController(input_props) {

  function handleSubmit(event, result, form_values, inserted_id) {
      if (input_props.onSubmit) {
        input_props.onSubmit(event, result, form_values, inserted_id)
      } else if (input_props.onClose) {
        input_props.onClose()
      }
  }

  // Proc, and if build, 
  const object_models =  useGetModel("object_types")
  const object_model = object_models?[input_props.object_type]:{}
  let field_models =  useGetModel("fields")
  if (input_props.field_models) { 
    field_models = _.merge({},field_models, input_props.field_models)
  }

  const section_models = useGetModel("sections")
  const layout_models = useGetModel("layouts")
  const field_list_models = useGetModel("field_lists")

  const reference_formValues= useRef({})
  const reference_lastTouched = useRef({})
  reference_formValues.current = {}
  reference_lastTouched.current = {}
  
  // do not merge expensive, known unnecessary things
  let {layout, headless=false, data:input_props_data, row_type="table_row", form_open, key_id, onData="",action_props, action, form_title, no_header=false, sections,  override_meta_model, delay_dirty=false,setListFormValues, list_form_params, index, mode, ...merging_props} = input_props

  // if mode is create and there is ad id, change mode to edit.
  // Use Case - Wizard when user goes back to the create step
  if (["create","list_create"].includes(mode) && (merging_props.id || (input_props_data && input_props_data.id))) {
      mode = "edit"
      merging_props.id = merging_props.id?merging_props.id:(input_props_data?input_props_data.id:"")
  }
  let layout_model
  // treat layout as another dynamic input
  // props (usually from menu) takes
  // precedence
  if (input_props.layout) {
    layout_model = layout_models[input_props.layout]
    merging_props = _.merge({},layout_model, merging_props)
  }
  // do not use base component
  // Make a ref?
  let row_component_model = _.merge({},rab_component_models[row_type])
  row_component_model.row.components.row = ACSRow
  row_component_model.row.components.form_wrap =ACSFormWrap
  row_component_model.row.components.section_wrap =ACSSectionWrap
  row_component_model.row.components.section_header =ACSSectionHeader
  row_component_model.row.components.section_body_wrap =ACSSectionBodyWrap


  // What is form open?
// pre merge thse or put in component model
  if (form_open) {
    row_component_model.row.components.header_wrap=""
    row_component_model.row.names.header_wrap = "RABVoid"
    row_component_model.row.names.header = "RABVoid"
    row_component_model.field.props.disable_underline = true
  }

  // XX pre merge these
  if (no_header) {
    row_component_model.row.components.header_wrap=""
    row_component_model.row.names.header_wrap = "RABVoid"
    row_component_model.row.names.header = "RABVoid"
  }

// row _componene_mode is built, could get rid of build model compoennts
// nothing in object model needs build
// woudl only need if model should override mreging props
  const rab_component_model = control.getFinalModel("row", {...merging_props}, object_model, row_component_model, override_meta_model)
  const row_model = rab_component_model.row

  const massaged_props = row_model.props
  const { num_columns="",  form=false,  ...params} = massaged_props



  let [object_type, id, prescrubbed_field_list, api_options, data] =  useGetObject(input_props.object_type, input_props.id, input_props.field_list, input_props.api_options, input_props.data, onData);


  if (!input_props_data && !id && data) {
    // lookup was by filter, not id
    id = data.id
  }


// definitely save this
  let field_list = useGenerateFieldList(object_type, "", data, mode, form, prescrubbed_field_list, "core", layout, sections)
  let section_field_lists =[] 
  if (layout) {
      sections = layout_model.sections 
  }

  // XX for now, we are trusting that
  // layout, section and field_list are  
  // prescrubbed if provied.
  // We may refactor this 
  // later but it will likely require 
  // useGenerateFieldList to not be a hook
  // as it might be impossible to avoid conditionals
  if (sections) {
    sections=sections.split(",")
    sections.forEach( section => {
      let field_list_name = section_models[section].field_list
      let section_field_list = field_list_models[field_list_name].split(",")
    
      field_list = field_list.concat(section_field_list)
      section_field_lists.push(section_field_list)
    })
  } else {
      section_field_lists.push(field_list)
  }

  let {formValues, lastTouched, handleFormChange, handleFormSubmit,} = useForm(object_type, "", data, handleSubmit, mode, form, merging_props,field_list, delay_dirty, list_form_params, index);
  //// wall /////
  if (!field_models) {return null}
  const field_model = field_models[object_type]

  if ((!["create","list_create"].includes(mode) && !data) || (object_type && !object_model) || (object_type && !field_model) || field_list.length === 0) return null

  //XX TODO - have to restructure references defaults
  if (["create","list_create"].includes(mode)) {data = formValues}
  /// XX Will be expanded to deal with sections
  // XX will be expanded to deal with col_spans

  
  if (num_columns && num_columns !== "all" && 
    (!["list","list_edit","list_create"].includes(mode)))  {
    section_field_lists.forEach ((field_list, section_index) => {
      let chunked_field_list = [[]]
      let index = 0
      let col_count = 0
      field_list.forEach(field => {
        const field_model = field_models[object_type][field]
        let col_span = 1
        if (["create", "edit"].includes(mode)) {
          col_span = field_model.col_span
        }
        if ((field_model.hidden_on_form && ["create", "edit"].includes(mode)) ||
            field_model.hidden_on_create_form && mode === "create") {
          chunked_field_list[index].push(field)
        } else if (col_count + col_span <= num_columns) {
            chunked_field_list[index].push(field)
            col_count += col_span
        } else {
            index += 1
            col_count = col_span
            chunked_field_list[index] = [field]
        }
      })
      section_field_lists[section_index] = chunked_field_list
    })
  } else {
    section_field_lists.forEach ((field_list, section_index) => {
      section_field_lists[section_index] = [field_list]
    })
  }

  // Sectiions
  // Final structure[[section], [section]]
  // where each section contains one or more fields 
  // (according to field_chunk and colspan rules examples: [field, field, field ]

  if (headless) {
      return null
  }
  return  (<ACSRowRenderer {...row_model.props} mode={mode} row_type={row_type} field_models={field_models} form={form} object_type={object_type} action_props={action_props} action={action}  id={id} chunked_field_list={section_field_lists} field_list={field_list} sections={sections} data={data} api_options={api_options}  formValues={formValues} form_open={form_open} form_title={form_title} onClose={input_props.onClose}
  handleFormChange={handleFormChange} handleFormSubmit={handleFormSubmit} lastTouched={lastTouched} rab_component_model={rab_component_model} key={key_id+"Render"} key_id={key_id}   reference_formValues= {reference_formValues}
    reference_lastTouched = {reference_lastTouched}/>)

}

export default ACSRowController; 