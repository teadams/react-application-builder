import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {Link, Container, Box, Card, TableHead, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';
import useGetModel from '../../Hooks/useGetModel.js'
import ACSSelectFilter from './ACSSelectFilter.js'
// default_value, object_type, label, 
function ACSFilters(props) {
  const {filters, onChange} = props

  const [formValues, setFormValues] =useState({})
  const [api_options, setAPIOptions] = useState({filter_id:[], filter_field:[]})
  const handleFilterChange = (event) => {
    const event_name = event.target.name 
    const event_value = event.target.value 
    if (formValues[event_name] !== event_value) {
        setFormValues(formValues=>({...formValues,[event_name]:event_value}))
    }
  }

  
  let new_api_options = {filter_id:[], filter_field:[]}
  filters.forEach(filter => {
    if (formValues[filter.name]) {
        new_api_options.filter_field.push(filter.filter_field_name)
        new_api_options.filter_id.push(formValues[filter.name])
    }
  })
//  u.a(api_options, new_api_options)

  if (JSON.stringify(new_api_options) !== JSON.stringify(api_options)) {
      setAPIOptions(new_api_options)
      if (onChange) {
        onChange(new_api_options)
      }
  }
      
  return (
   <Fragment>
   {filters.map(filter => {
       return (
         <ACSSelectFilter key={filter.name} object_type={filter.object_type} filter_name={filter.name} field_name={filter.name}  onChange={handleFilterChange}/>)
     })}
   </Fragment>
   )

}

export default ACSFilters;

