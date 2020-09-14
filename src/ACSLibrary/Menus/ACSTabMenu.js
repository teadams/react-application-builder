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

import { Tabs, Tab, Stepper, Step, StepLabel, StepButton, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import UIContext from '../../Template/UIContext';
import useGetModel from '../../Hooks/useGetModel'

const TabMenu = (props) => {
  const {menu_model, items, item_data, prevent_content=false, onClick, open, orientation="horizontal",  default_index=0, num_visible_items} = props
  const [controlled_tab, setControlledTab] = useState(default_index)
  const [current_tab, setCurrentTab] = useState(default_index)
  const context = useContext(AuthContext)

  let current_tab_data
  if (default_index !== controlled_tab) {
      // tab was changed from parent
      setControlledTab(default_index)
      setCurrentTab(default_index)
      current_tab_data = item_data[items[default_index]]
  } else {
    current_tab_data = item_data[items[current_tab]]
  }

  const {menu_component_name, pretty_name, summary, description, object_type, mode, menu_item_summary_style, menu_item_description_style, id, dialog=false} = current_tab_data

  function handleClose() {
    if (props.onClose) {
      props.onClose()
    } 
 }
  const handleClick = (event, index) => {
    setCurrentTab(index)
    onClick(index)
  };

  let StyledTab = Tab
  let tabs_style={}
  if (orientation==="vertical") {
      StyledTab = withStyles({  wrapper: {alignItems:"flex-start" }, root:{paddingTop:0, paddingBottom:0, minHeight:0}})(Tab)
  }  

   const TabComponent = control.componentByName(menu_component_name);
   return (
     <Fragment>
    {(num_visible_items > 1 || !menu_model.hide_single_menu) &&
       <Tabs 
          value={current_tab}
          orientation={orientation}
          onChange={handleClick}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
//          style={tabs_style}
         > 

        {Object.keys(item_data).map ((item,index) => {
               const {pretty_name, summary,description, force_refresh=false, hidden=false} = item_data[item]
               if (hidden) {return null}
               return (<StyledTab  value={index} key={index}  label={pretty_name} />)
        })}

        </Tabs>
      }
      {!prevent_content && 
        <Fragment>
          {summary && <div style={menu_item_summary_style}>{summary}{description && <Fragment>:</Fragment>}</div>}
          {description && <div style={menu_item_description_style}> {description}</div>}

          {["edit","create"].includes(current_tab_data.props.mode) ?
            <TabComponent  onClose={handleClose} row_dialog_center={!dialog}   row_delayed_auth={true} object_type={object_type} id={id} row_form={true} form_open={open} open={open} {...current_tab_data.props}/>
          :
          <TabComponent  onClose={handleClose}  open={open} object_type={object_type} id={id} {...current_tab_data.props}/>}
        </Fragment>
      }
    
    </Fragment>
     ) 
} 

function ACSTabMenu(props)  {
    return (
    <ACSMenuController {...props}>
        <TabMenu/>
    </ACSMenuController>
    )
}
export default ACSTabMenu;
