import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as control from '../../Utils/control.js';
import ACSObjectTypeView from './ACSObjectTypeView.js'
import ACSField from '../Fields/ACSField.js'
import useGetModel from '../../Hooks/useGetModel.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { Tooltip, Table, TableBody, TableRow, TableCell, Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function ChipRow(props) {
      const {data, object_type} = props
      const object_type_models = useGetModel("object_types")
      const object_model = object_type_models[object_type]
      const pretty_key_field = object_model.pretty_key_id
      const summary_key_field = object_model.summary_key
  
      const name=data[pretty_key_field]
      const summary=data[summary_key_field]
      return (<Fragment>
        <Tooltip title={summary} placement="top-end" arrow={true}>
          <Chip   label={name} size="small"/>
       </Tooltip>
              </Fragment>
              )
}


function ACSChipObjectTypeView(props)  {
  const {object_type, api_options, ...params} = props
  let {summary_field, description_field} = props
 

  const rab_component_model = { 
      list:{
            names:{
                  list_header_wrap:"RABVoid",
                  footer_wrap:"RABVoid",
                  footer:"RABVoid",
                  list_pagination:"RABVoid",
                  header_wrap:"RABVoid",
                  header:"RABVoid",
                  list_container:"Fragment",
                  list_wrap:"Fragment",
                  list_header_wrap:"Fragment",
                  list_header:"Fragment",
                  list_pagination:"RABVoid",
                  body_wrap:"Fragment"}
      },
      row:{names:{
          header_wrap:"RABVoid",
          header:"RABVoid",
          row_body:"Fragment",
          section_wrap:"Fragment",
          section_header:"RABVoid",
          section_body_wrap:"Fragment",
          row_wrap:"Fragment",
          field_chunk_wrap:"Fragment"},
          components:{
            row:ChipRow
          },
          props: {
            no_stripe:true
          }
      },
      field:{names:{
            field_wrap:"Fragment"
          },
      }}

  return (<ACSObjectTypeView {...params} rab_component_model={rab_component_model}  object_type={object_type} api_options={api_options}/> )
}

export default ACSChipObjectTypeView;

