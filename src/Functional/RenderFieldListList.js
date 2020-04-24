import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as utils from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import RenderFieldList from './RenderFieldList.js'

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import useGetObjectList from '../Hooks/useGetObjectList';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function RenderFieldListList(props) {
  // if data not in props, useEffect to retrieve it using ojbect_type, etc 
  // data will be the full results back from the database (object) 
  // data (for now) is all one object type
  // sections is an object, with each key being a section
      // field_names = array of field names
      // name - the pretty name of the section
  
  const {data, sections} = props
    if (data) {
     
      return ( <Fragment> 
                {Object.keys(sections).map(section_name => {
                  const section = sections[section_name]
                  return (<div>Section<RenderFieldList field_list={section.field_list} data={data}/></div>)
                })}
              </Fragment>)
    }
}

export default RenderFieldListList;
