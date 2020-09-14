import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {AuthContext, Auth, LoginForm} from '../../Modules/User/index.js';
import {ACSHeadlessObject} from '../../ACSLibrary';
import {ACSMenuController} from '../../ACSRenderEngine';
import { withStyles } from '@material-ui/core/styles';

import _ from 'lodash/object'

import { List, ListItem, Tabs, Tab, Stepper, Step, StepLabel, StepButton, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import UIContext from '../../Template/UIContext';
import useGetModel from '../../Hooks/useGetModel'

const ListMenu = (props) => {
  const {menu_model, items, item_data, prevent_content=false, onClick, open, orientation="horizontal",  default_index=0, num_visible_items} = props

  const [current_item, setCurrentItem] = useState(default_index)
  const current_item_data = item_data[items[current_item]]

  const {menu_component_name, pretty_name, summary, description, object_type, mode, menu_item_summary_style, menu_item_description_style, id, dialog=false} = current_item_data

  function handleClose() {
    // CLOSE THE DIALOG?
    if (props.onClose) {
      props.onClose()
    } 
 }
  const handleOnClick = (event, item, index) => {
    setCurrentItem(index)
    onClick(index)
  };

   const ListComponent = control.componentByName(menu_component_name);
   return (
     <Fragment>
    {(num_visible_items > 1 || !menu_model.hide_single_menu) &&
       <List> 
        {Object.keys(item_data).map ((item,index) => {
               const {pretty_name, summary,description, force_refresh=false, hidden=false} = item_data[item]
               if (hidden) {return null}
               return (<ListItem onClick={(event) => handleOnClick(event, item, index)} key={index} value={item} name={item}>{pretty_name}</ListItem>)
        })}
        </List>
      }
    <Dialog open={open} fullWidth={true} maxWidth="xl">
    <DialogTitle>Test Title</DialogTitle>

    </Dialog>
    </Fragment>
     ) 
} 

function ACSListMenu(props)  {
    return (
    <ACSMenuController {...props}>
        <ListMenu/>
    </ACSMenuController>
    )
}
export default ACSListMenu;
