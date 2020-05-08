// base libraries, React, MaterialUI, Hooks, Models 
import  'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';

import React, {useState} from 'react';

import ACSListController from './ACSListController.js'

import useGetObject from '../Hooks/useGetObject';
import useGetModel from '../Hooks/useGetModel';

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

function ACSRowController(input_props) {
  const [mode, setMode] = useState("view");
  const object_models =  useGetModel("object")
  const object_model = object_models?[input_props.object_type]:{}

  // do not merge expensive, known unnecessary things
  const {data:input_props_data, ...merging_props} = input_props
  const rab_component_model = control.getFinalModel("row", {...merging_props}, object_model, rab_component_models.row )
  const row_model = rab_component_model.row
  const row_components = row_model.components
  const massaged_props = row_model.props

  const {body_wrap} = row_model.components
  
  const {object_type: props_object_type, id: props_id, field_list:props_field_list, api_options:props_api_options,  ...params} = massaged_props

  let [ready, object_type, id, field_list, api_options, data] = 
  useGetObject(props_object_type, props_id, props_field_list, props_api_options, input_props_data); 
  const field_models =  useGetModel("fields")
  if (!field_models) {return null}
  const field_model = field_models[object_type]
  if ((object_type && !object_model) || (object_type && !field_model)) return null


  if (!field_list) {
      if (object_type) {
        field_list = Object.keys(field_model)
      } else {
        field_list = Object.keys(data)
      }
  }
  // Changes to field list (metadata rules, ext)
  // Calculate sections
  // calculate row break
  // field, row, section
  // [  [field, field, field ].[ field, field  ] ]

  let RenderACSRow  =  row_components.row
  let ACSRow = row_components.row_wrap
  if (data && field_list) {
    return ( 
        <ACSRow {...row_model.props} object_type={object_type} id={id} field_list={field_list} data={data} api_options={api_options} rab_component_model={rab_component_model} >

          <RenderACSRow {...row_model.props} object_type={object_type} id={id} field_list={field_list} data={data} api_options={api_options} rab_component_model={rab_component_model} >
          </RenderACSRow>

          {data.children && data.children.length >0 &&
              <ACSListController object_type={object_type} parent_id={id} field_list={field_list} data={data.children} api_options={api_options} rab_component_model={rab_component_model} {...rab_component_model.list.props}/>}
        </ACSRow> )
    } else {  
        return <div></div>
    }
}

export default ACSRowController;