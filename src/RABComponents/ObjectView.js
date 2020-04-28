import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

function ObjectView(props)  {
  const {object_type,id,layout="list"} = props
  u.aa('hi')
}
export default ObjectView;

// const table_wrap = {field:"TableCell", field_set:"TableRow", list_body:"TableBody", list:"Table", header:"TableHeader", header_row:"TableRow"}
// const fragment_wrap = {field:"Fragment", field_set:"Fragment", list_body:"Fragment", list:"Fragment", header:"Fragment", header_row:"Fragment"}
// const list_wrap = {field:"ListItemText", field_set:"ListItem", list_body:"Fragment", list:"List", header:"Fragment", header_row:"Fragment"}
