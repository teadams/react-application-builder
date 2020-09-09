import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {AuthContext, Auth, LoginForm} from '../../Modules/User/index.js';
import {ACSHeadlessObject} from '../../ACSLibrary';
import {ACSMenuController} from '../../ACSRenderEngine';

import _ from 'lodash/object'

import { Stepper, Step, StepLabel, StepButton, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import UIContext from '../../Template/UIContext';
import useGetModel from '../../Hooks/useGetModel'

const TabMenu = (props) => {
  const [current_tab, setCurrentTab] = useState(0)
  const {menu_model, items, item_data, open=true} = props
  const context = useContext(AuthContext)
  const current_tab_data = item_data[current_tab]
  const {menu_component_name, pretty_name, summary, description, object_type, step_summary_style, step_description_style} = current_tab_data
  
  function handleFormClose() {
    if (props.onClose) {
      props.onClose()
    } 
 }

  // What tab looks at permissions

  const handleClick = (index) => () => {
    setCurrentTab(index)
    // parent 
  };

   const TabComponent = control.componentByName(menu_component_name);


   return (
     <Fragment>
      {items.map ((item,index) => {
             const {pretty_name, summary,description, force_refresh=false} = item_data[item]
             return (<Fragment>{pretty_name}{index}</Fragment>
             )
           })}
      Tab component
      <TabComponent  {...current_tab_data}/>
    
    </Fragment>
     ) 
} 

function ACSTabMenu(props)  {
    return (
    <ACSMenuController {...props}>
        <TabMenu {...props}/>
    </ACSMenuController>
    )
}
export default ACSTabMenu;
