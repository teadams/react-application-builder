import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as control from '../../Utils/control.js';
import ACSObjectTypeView from './ACSObjectTypeView.js'
import ACSField from '../ACSField2.js'
import useGetModel from '../../Hooks/useGetModel.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

function SummaryRow(props) {
  const {data, object_type} = props
  const object_type_models = useGetModel("object_types")
  const object_model = object_type_models[object_type]
  const pretty_key_field = object_model.pretty_key_id
  const summary_field = object_model.summary_key
  const description_field = object_model.description_key
  const TableCell = control.componentByName("TableCell")

  return (
    <Fragment>
   <TableCell style={{width:"30%"}}>
    <ACSField  {...props} field_name={pretty_key_field} key={pretty_key_field} />
    {summary_field && 
      <Fragment> - <ACSField  {...props} field_name={summary_field} key={summary_field}/> </Fragment>
    }
    </TableCell> 
    {description_field && 
      <TableCell style={{width:"70%"}}><ACSField  {...props} field_name={description_field} key={description_field} /></TableCell>
    }
  </Fragment>
  
  )
}

function ACSSummaryObjectTypeView(props)  {
  const {object_type, api_options, ...params} = props
  const field_list = ["role_name", "description"]
  const rab_component_model = { 
      list:{
            names:{header_wrap:"RABVoid", 
                  list_header_wrap:"RABVoid",
                  footer_wrap:"RABVoid",
                  footer:"RABVoid",
                  list_pagination:"RABVoid"}
      },
      row:{components:{
            row:SummaryRow
          },
      },
      field:{names:{
            field_wrap:"Fragment"
          },
      }}


  return (<ACSObjectTypeView {...params} rab_component_model={rab_component_model}  object_type={object_type} api_options={api_options}/> )
}
export default ACSSummaryObjectTypeView;

