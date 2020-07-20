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
  //XX could get default select field by object type from proc?
  const {filters, handleFilterChange} = props
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

