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
function ACSSelectFilter(props) {
  //XX could get default select field by object type from proc?
  const {default_value, object_type, label, field_name, filter_name=props.object_type, onChange} = props
  const [value, setValue]= useState(default_value)
 
  const handleChange = (event) => {
      // form touched
    const event_value=event.target.value
    if (value !== event_value) {
        setValue(event_value)
    }
u.a("value", event_value)
    if (onChange) {
      onChange(event)
    }
  }
  // filter consolator
  // Display the filters (array of filters)
  // form values
  let api_options = {filter_id:[], filter_field:[], filter_join:"AND", referenced_by:[]}
  if (field_name && field_name !== "_none_") {
    api_options.filter_id.push(value)
    api_options.filter_field.push("type")
  }

  return (
    <RABSelectField object_type = {object_type}
        mode="edit" form="true"
        add_none="Any"
        form_field_name={filter_name}
        value = {value}
        name = {filter_name}
        style = {{width:"90%"}}
        onChange={handleChange}
        noLabel= {true}
        disable_underline={false}
      />
  )
}

export default ACSSelectFilter;

