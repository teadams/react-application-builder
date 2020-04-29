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

function NavMenu(props)  {
  const {object_type} = props
  const component_name = ""
  // const component_name = {field_wrap:"", field_set_wrap:"TableRow", list_body_wrap:"TableBody", list_wrap:"Table"}

  // Make the field list pretty key
  const field_list=["full_name"]
  return <ACSListController object_type={props.object_type} component_name={component_name} field_list={field_list}/>
}

export default NavMenu;