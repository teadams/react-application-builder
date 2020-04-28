import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSListController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

function Menu(props)  {
  const {object_type} = props

  const wrap = {field:"", field_set:"TableRow", list_body:"TableBody", list:"Table"}

  // Make the field list pretty key
  const field_list=["full_name"]
  return <ACSListController object_type={props.object_type} wrap={wrap} field_list={field_list}/>
}

export default Menu;