import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import ACSObjectTypeView from "../../Functional/Lists/ACSObjectTypeView.js"
import useForm from '../../Hooks/useForm';
import useGetObject  from '../../Hooks/useGetObject';
import ACSRowController from '../../Functional/ACSRowController.js'
import RABSelectField from '../../Functional/Fields/RABSelectField.js'
import ACSField from '../../Functional/ACSField2.js'
import ObjectView from '../../RABComponents/ObjectView.js'
import NWAProjectSummary from '../../Components/NowWeAct/NWAProjectSummary.js'
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField

, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {Link, Container, Box, Card, TableHead, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';
import useGetModel from '../../Hooks/useGetModel.js'


// default_value, object_type, label, 
function ACSTextFilter(props) {
  //XX could get default select field by object type from proc?
  const {default_value, object_type, label, field_name, filter_name=props.object_type, onChange, api_options} = props
  const [value, setValue]= useState(default_value)
 
  const handleChange = (event) => {
    const event_value=event.target.value
    if (value !== event_value) {
        setValue(event_value)
    }
  }

  const handleSubmit = (event) => {
    if (event) {
        event.preventDefault();
    }
    let text_event = {}
    text_event.target = {name:field_name, value:value}
    if (onChange) {
      onChange(text_event)
    }
  }

  return (<Fragment>
    <form onSubmit={handleSubmit}>
      <TextField 
      autoFocus={false}
      name={field_name} 
      key={field_name}
      fullWidth={false}
      disabled={false}
//      onBlur={props.onFieldBlur}
      value={value}
      onChange={handleChange}/>
    </form>
    </Fragment>
  )
}

export default ACSTextFilter;

