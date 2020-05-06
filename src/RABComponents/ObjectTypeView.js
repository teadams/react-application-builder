import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import FieldView from './FieldView.js'
import {functional_components} from "../Functional/index.js"
import ACSField from '../Functional/ACSField2.js'
import RenderACSField from '../Functional/RenderACSField.js'
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSListController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {Tab, Tabs, Menu, MenuItem, Paper, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,Typography} from '@material-ui/core';
import useGetModel from "../Hooks/useGetModel.js"
import AuthContext from '../Components/User/AuthContext';


function ObjectTypeView(props)  {
  const {object_type, api_options, ...params} = props
  const rab_component_name = {list_wrap_body:"Table", row_wrap:"TableRow", field_wrap:"TableCell"}
  return (<ACSListController {...params} rab_component_name={rab_component_name} object_type={object_type} api_options={api_options}/> )
}
export default ObjectTypeView;

