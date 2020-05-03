import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import ACSField from './ACSField2.js'
//import {functional_components} from "./Functional"
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import useGetObjectList from '../Hooks/useGetObjectList';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function RenderACSRow(props) {
  //const ACSFieldMemo = React.memo(ACSField)
  const {object_type, field_list, id, data, api_options, ...params} = props
    if (data) {
      return ( <Fragment>
          {field_list.map(field_name => {
          return <ACSField  {...params} object_type={object_type} id={id} field_name={field_name} data={data} api_options={api_options}/>
          })}
        </Fragment>)
    }
}

export default RenderACSRow;
