import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as utils from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import RenderFieldList from './RenderFieldList.js'
import useGetObject from '../Hooks/useGetObject';


import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import useGetObjectList from '../Hooks/useGetObjectList';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function FieldList(props) {
  const {object_type, id,   api_options} = props
  let {field_list} = props // will use object meta if not provided
  const [mode, setMode] = useState("view");
  let data = useGetObject(object_type, id, {}, props.data); 
  // Determin the field list to start withStyles
  if (!field_list) {
      field_list = Object.keys(meta.fields(object_type))
  }

  // Determine the Component

  if (data) {
    return ( <Fragment>
            <RenderFieldList object_type={object_type} id={id} field_list={field_list} data={data} api_options={api_options}/>
            </Fragment>)
    } else {
        return null
    }
}

export default FieldList;