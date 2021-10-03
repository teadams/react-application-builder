import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';

import { Accordion, AccordionSummary, AccordionDetails, Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ACSDrillDown from "../../ACSLibrary/Layouts/ACSDrillDown.js"
import {ACSSelectFilter, ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType, ACSCreateButton} from '../../ACSLibrary/index.js'



import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"
import AuthContext from '../../Modules/User/AuthContext';

const menu_types = {
  menu: "Menus",
  wizard: "Wizards",
  panel: "Panels"
}

function MenuModelAdmin(props) {
  const [menu_data, setMenuData] = useState();
  const [menu_item_data, setMenuItemData] = useState();

  // default state of false to comply with Accordaion State management
  const [selected_menu_type, setSelectedMenuType]  = useState(false);
  const [selected_menu_data, setSelectedMenuData] = useState(false);

  const [selected_menu_item_data, setSelectedMenuItemData] = useState()

  const handleMenuTypeChange = (menu_type) => (event, isExpanded) => {
      setSelectedMenuType(isExpanded ? menu_type : false);
  }

  const handleMenuChange = (new_selected_menu_id) => (event, isExpanded) => {
      if (isExpanded) {
        const new_selected_menu_data = menu_data.find(menu_data => menu_data.id === new_selected_menu_id);    
        setSelectedMenuData(new_selected_menu_data)
    } else {
        setSelectedMenuData(false);
    }
  }


  function handleMenuData(menu_data) {
      setMenuData(menu_data)
      // update the selected data if hs been previously
      // chosen
      if (selected_menu_data) {
        const new_selected_menu_data = menu_data.find(menu_data => menu_data.key === selected_menu_data.key);    
        setSelectedMenuData(new_selected_menu_data)
      }
      if (selected_menu_item_data) {
        const new_selected_menu_item_data = menu_item_data.find(menu_item_data => menu_item_data.key === selected_menu_item_data.key);    

        setSelectedMenuItemData(new_selected_menu_item_data)
      }
  }

  function handleMenuItemData(menu_item_data) {
      setMenuItemData(menu_item_data)
      // update the selected data if hs been previously
      // chosen
      if (selected_menu_data) {
        const new_selected_menu_data = menu_data.find(menu_data => menu_data.key === selected_menu_data.key);    
        setSelectedMenuData(new_selected_menu_data)
      }
      if (selected_menu_item_data) {
        const new_selected_menu_item_data = menu_item_data.find(menu_item_data => menu_item_data.key === selected_menu_item_data.key);    
        setSelectedMenuItemData(new_selected_menu_item_data)
      }
  }


  const ButtonComponent = Button

  return (
  <div style={{paddingLeft:"15px"}}>
    <ACSObjectType onData={handleMenuData} headless={true} object_type="menus" />
    <ACSObjectType onData={handleMenuItemData} headless={true} object_type="menu_items" />

    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>  
    {menu_data && menu_item_data &&
      <Fragment>
      <div style={{padding:"15px"}}>  
        <ACSCreateButton  ButtonComponent={ButtonComponent} text="Add Menu Item" object_type="menu_items" action_props={{pretty_name:""}}/>
      </div>
     </Fragment>
    }
    </div>
    <div>
    {menu_item_data && selected_menu_item_data && !selected_menu_data &&
      <ACSObjectView data={selected_menu_item_data}  object_type="menu_items" id={selected_menu_item_data.id}/>

    }
    {menu_data && Object.keys(menu_types).map((menu_type_key, index) => {
      const menu_type = menu_types[menu_type_key];
      return (<Accordion  expanded={selected_menu_type === menu_type_key} onChange={handleMenuTypeChange(menu_type_key)}>
        <AccordionSummary  expandIcon={<ExpandMoreIcon id={menu_type_key}/>}>
          {menu_type} 
        </AccordionSummary>
        <AccordionDetails style={{display:"flex", flexDirection:"column"}}> 
          {selected_menu_type === menu_type_key && menu_data.map((menu,index) => {
            if (menu.type !== menu_type_key  ) return null
            const expanded = selected_menu_data && menu.id === selected_menu_data.id
            return (
            <Accordion expanded={expanded} onChange={handleMenuChange(menu.id)} >
              <AccordionSummary  expandIcon={<ExpandMoreIcon id={menu.id}/>}>
                {menu.pretty_name}
              </AccordionSummary>
              <AccordionDetails > 
                {menu_data && selected_menu_data && menu.id === selected_menu_data.id &&
                  <ACSObjectView data={selected_menu_data}  object_type="menus" id={selected_menu_data.id}/>
                }

              </AccordionDetails>
            </Accordion>)
          })}
        </AccordionDetails>
      </Accordion>
      )})
    }
    </div>
  </div>
  )
}

export default MenuModelAdmin