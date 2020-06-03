// base libraries, React, MaterialUI, Hooks, Models 
import  'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import _ from 'lodash'

import * as u from '../Utils/utils.js';

import React, {useState} from 'react';

import RenderACSRow from './RenderACSRow.js'
import ACSField from '../Functional/ACSField2.js'

import useGetObject from '../Hooks/useGetObject';
import useGetModel from '../Hooks/useGetModel';
import useForm from '../Hooks/useForm';
import useGenerateFieldList from '../Hooks/useGenerateFieldList';

import * as control from "../Utils/control.js"
import rab_component_models from '../Models/HealthMe/component.js'

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
//       can change with user input (object_type, id) is saved in a
//       state until the data is returned.  Data and the appropriate 
//       inputs all change at the same time and returned by useGetObject.
//       
//       "normal" varaable names are used with the results of useGetObject, 
//        as these have now been massaged/state protected and ready for
//        normal use in the rest of the execution.

// Essentially, think of the function starting immediate after useGetObject! 
//   The rest is just prep

function RABRow(row_props) {
  const {mode, form, field_chunk, data, field, rab_component_model, handleFormChange, handleFormSubmit, formValues, key_id, s_index, f_index} = row_props
  const {...row_params} = row_props
  const {field_chunk_wrap:FieldChunk} = rab_component_model.row.components
  return (
    <FieldChunk {...row_params} key={key_id+"chunk"}>
      {field_chunk.map( (field_name, ch_index) => {
           const autoFocus = (f_index === 0 && s_index === 0 && ch_index === 0 )?true:false
            
           return <ACSField field_mode={mode} field_form={!form} field_name={field_name} handleFormChange={handleFormChange} handleFormSubmit={handleFormSubmit}
           autoFocus ={autoFocus}
           formValues={formValues} {...row_params} key={ch_index+"field_name"} key_id={ch_index}/>
      })}
    </FieldChunk>
  )
}

function ACSRowController(input_props) {
  function handleSubmit(event, result, form_values_object, inserted_id) {
      if (input_props.onSubmit) {
        input_props.onSubmit(event, result, form_values_object, inserted_id)
      }
      handleFormClose()
  }
  const object_models =  useGetModel("object_types")
  const object_model = object_models?[input_props.object_type]:{}

  // do not merge expensive, known unnecessary things
  const {data:input_props_data, form_open, key_id, ...merging_props} = input_props
  // do not change base component
  let row_component_model = Object.assign({},rab_component_models.row)
  row_component_model.row.components.row = RABRow
//  row_component_model.row.names.header_wrap = "RABVoid"

  if (form_open) {
  // XX somthing is changing the base row_component_models
    row_component_model.row.components.header_wrap=""
    row_component_model.row.names.header_wrap = "RABVoid"
    row_component_model.row.names.header = "RABVoid"
    row_component_model.field.props.disable_underline = true
  }
  const rab_component_model = control.getFinalModel("row", {...merging_props}, object_model, row_component_model)
  const row_model = rab_component_model.row
  const massaged_props = row_model.props
  const {object_type: props_object_type, id: props_id, field_list:props_field_list, api_options:props_api_options, num_columns="", mode="view", form=false,  ...params} = massaged_props

  function handleFormClose() {
      if (input_props.onClose) {
        input_props.onClose()
      } 
  }

  let [ready, object_type, id, prescrubbed_field_list, api_options, data] =  useGetObject(props_object_type, props_id, props_field_list, props_api_options, input_props_data);
  if (!input_props_data && !id && data) {
    // lookup was by filter, not id
    id = data.id
  }

  let field_list = useGenerateFieldList(object_type, "", data, mode, form, prescrubbed_field_list)

  // field list will come back scrubbed
  let {formValues, lastTouched, handleFormChange, handleFormSubmit,} = useForm(object_type, "", data, handleSubmit, mode, form, merging_props,field_list);

  //// wall /////
  const field_models =  useGetModel("fields")
  if (!field_models) {return null}
  const field_model = field_models[object_type]

  if ((mode !== "create" && !data) || (object_type && !object_model) || (object_type && !field_model) || field_list.length === 0) return null

  //XX TODO - have to restructure references defaults
  if (mode==="create") {data = formValues}
  /// XX Will be expanded to deal with sections
  // XX will be expanded to deal with col_spans

  
  if (num_columns && num_columns !="all" && mode !== "list" )  {
    let chunked_field_list = [[]]
    let index = 0
    let col_count = 0
    field_list.forEach(field => {
      const col_span = field_model[field].col_span
      if (field_model[field].hidden_on_form && ["create", "edit"].includes(mode)) {
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
    field_list = chunked_field_list
    field_list = [field_list]
  } else {
    field_list = [[field_list]]
  }
  // Sectiions
  // Final structure[[section], [section]]
  // where each section contains one or more fields 
  // (according to field_chunk and colspan rules examples: [field, field, field ]
  return  (<RenderACSRow {...row_model.props} mode={mode} form={form} object_type={object_type}  id={id} field_list={field_list} data={data} api_options={api_options} num_columns={num_columns} formValues={formValues} form_open={form_open} onClose={handleFormClose}
  handleFormChange={handleFormChange} handleFormSubmit={handleFormSubmit} lastTouched={lastTouched} rab_component_model={rab_component_model} key={key_id+"Render"} key_id={key_id}/>)

}

export default ACSRowController; 