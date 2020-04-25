import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as utils from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import Field from './Field.js'

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import useGetObjectList from '../Hooks/useGetObjectList';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function RenderFieldList(props) {
  // if data not in props, useEffect to retrieve it using ojbect_type, etc 
  // data will be the full results back from the database (object) 
  // field_list is an array of fields to show (array)
  const {data, field_list} = props
    if (data) {
      return ( <Fragment>
          {field_list.map(field => {
          return (<div> FL <Field field_name={field} data={data}/></div>)
          })}
        </Fragment>)
    }
}

export default RenderFieldList;
