import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/log.js'
import ACSObjectTypeView from './ACSObjectTypeView.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

function SummaryRow(props) {
  const {data, object_type} = props
  return "ROW "
//  return (<Fragment>{data.role_name} - {data.descripton}</Fragment>)
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
            row_body:SummaryRow
          }
      }}


  return (<ACSObjectTypeView {...params} rab_component_model={rab_component_model} field_list={field_list} object_type={object_type} api_options={api_options}/> )
}
export default ACSSummaryObjectTypeView;

