import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import * as u from '../../../Utils/utils.js'

import ACSYouTube from "../../Fields/ACSYouTube.js"
import ACSImage from "../../Fields/ACSYouTube.js"
import ACSField from "../../ACSField2.js"
import useGetModel from '../../../Hooks/useGetModel.js'


function ACSCommunicationRow(props) {
  const {data, object_type} = props
  const object_type_models = useGetModel("object_types")
  const object_model = object_type_models[object_type]
  const pretty_key_field = object_model.pretty_key_id
  const summary_field = object_model.summary_key
  const description_field = object_model.description_key
  const field_component_props = props.rab_component_model.field.props
  const {image_size, avatar} = field_component_props
  return (
    <Fragment>
      <Typography variant="subtitle1">
      <ACSField  {...props} field_name="name" key="name" />
      </Typography>
      <div >
      {data.image &&
          <ACSField  {...props}  field_name="image" key="image" />
      }
          <ACSField  {...props} field_name="body" key="body" />
        
      </div>
    </Fragment>
  )
}


export default ACSCommunicationRow