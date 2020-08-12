import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as control from '../../Utils/control.js';
import ACSObjectTypeView from './ACSObjectTypeView.js'
import ACSField from '../Fields/ACSField.js'
import ACSImage from '../Fields/ACSImage.js'

import useGetModel from '../../Hooks/useGetModel.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { Tooltip, Table, TableBody, TableRow, TableCell, Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function ChipRow(props) {
      const {data, object_type} = props
      const object_type_models = useGetModel("object_types")
      const field_models = useGetModel("fields")

      const object_model = object_type_models[object_type]
      const pretty_key_field = object_model.pretty_key_id
      const pretty_key_field_model = field_models[object_type][pretty_key_field]
      const pretty_key_data_path = pretty_key_field_model.data_path 
      const pretty_key_data = data[pretty_key_data_path]
      const pretty_key_field_component = pretty_key_field_model.field_component
      let pretty_key_value = pretty_key_data[pretty_key_field_model.display_field]

      if (pretty_key_field_component !== "RABTextField") {
        const Field = control.componentByName(pretty_key_field_component)
        pretty_key_value = Field({data:pretty_key_data, field_name:pretty_key_field_model.display_field, mode:"text"})
      }

      const avatar_field = object_model.thumbnail_key 
      let show_blank = false
      let avatar_object
      if (avatar_field) {
        const avatar_field_model = field_models[object_type][avatar_field]
        const avatar_data_path = avatar_field_model.data_path 
        const avatar_data = data[avatar_data_path]
        show_blank = true
        avatar_object = avatar_data[avatar_field_model.display_field]
      }

      // XX THIS SHOULD EXPAND OUT LIKE PRETTY KEY
      const summary_key_field = object_model.summary_key
      let summary
      if (summary_key_field) {
        const summary_key_field_model = field_models[object_type][summary_key_field]
        const summary_key_data_path = summary_key_field_model.data_path 
        const summary_key_data = data[summary_key_data_path]
        const summary_key_field_component = summary_key_field_model.field_component
        summary = summary_key_data[summary_key_field_model.display_field]
        if (summary_key_field_component !== "RABTextField") {
          const Field = control.componentByName(pretty_key_field_component)
          summary = Field({data:pretty_key_data, field_name:pretty_key_field_model.display_field, mode:"text"})
        }

      }

      const label=pretty_key_value
      return (<Fragment>
          {summary? 
          <Tooltip title={summary} placement="top-end" arrow={true}>
            <Chip   variant="outlined" label={label} size="small" avatar={<ACSImage image_object={avatar_object} show_blank={show_blank} size="tiny"/>}/>
          </Tooltip>
          :
            <Chip variant="outlined"   label={label} size="small" avatar={<ACSImage image_object={avatar_object} show_blank={show_blank} size="tiny"/>} />
          }
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

