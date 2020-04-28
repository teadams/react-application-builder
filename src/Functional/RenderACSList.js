import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as a from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import ACSRowController from './ACSRowController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Chseckbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableBody, Table } from '@material-ui/core';

function RenderACSList(props) {

  const {object_type, field_list, data, api_options, list_component, ...params} = props
    if (data) {
      return ( 
          <Fragment>
          {data.map(row => {
          return <ACSRowController {...params}  object_type={props.object_type} id={data.id} field_list={props.field_list} data={row} api_options={props.api_options} />
          })}
        </Fragment>)
    } else {
        return <div/>
    }
}

export default RenderACSList;
