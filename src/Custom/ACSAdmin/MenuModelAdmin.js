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

  const [selected_menu_type, setSelectedMenuType]  = useState();

  const [selected_menu_data, setSelectedMenu] = useState()
  const [selected_menu_item_data, setSelectedMenuItem] = useState()

  const handleMenuTypeChange = (menu_type) => (event, isExpanded) => {
      setSelectedMenuType(isExpanded ? menu_type : false);
  }

  function handleMenuTypeFilter(event, menu_data) {
      const menu_id = event.target.value
      if (menu_data && menu_id !== "_none_") {
        const select_data = menu_data.find(menu_data => menu_data.key === menu_id);    
        setSelectedMenu(select_data);
        setSelectedMenuItem(null);
      } 
      if (menu_id === "_none_") {
        setSelectedMenu(null);
      }
  }

  function handleMenuItemTypeFilter(event, menu_item_data) {
      const menu_item_id = event.target.value

      if (menu_item_data && menu_item_id !== "_none_") {
        const select_data = menu_item_data.find(menu_item_data => menu_item_data.key === menu_item_id);    
        setSelectedMenu(null);
        setSelectedMenuItem(select_data);
      } 
      if (menu_item_id === "_none_") {
        setSelectedMenuItem(null);
      }
  }


  function handleMenuData(menu_data) {
      setMenuData(menu_data)
      // update the selected data if hs been previously
      // chosen
      if (selected_menu_data) {
        const new_selected_menu_data = menu_data.find(menu_data => menu_data.key === selected_menu_data.key);    
        setSelectedMenu(new_selected_menu_data)
      }
      if (selected_menu_item_data) {
        const new_selected_menu_item_data = menu_item_data.find(menu_item_data => menu_item_data.key === selected_menu_item_data.key);    

        setSelectedMenuItem(new_selected_menu_item_data)
      }
  }

  function handleMenuItemData(menu_item_data) {
      setMenuItemData(menu_item_data)
      // update the selected data if hs been previously
      // chosen
      if (selected_menu_data) {
        const new_selected_menu_data = menu_data.find(menu_data => menu_data.key === selected_menu_data.key);    
        setSelectedMenu(new_selected_menu_data)
      }
      if (selected_menu_item_data) {
        const new_selected_menu_item_data = menu_item_data.find(menu_item_data => menu_item_data.key === selected_menu_item_data.key);    
        setSelectedMenuItem(new_selected_menu_item_data)
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
        <ACSSelectFilter label="Menu Type" key="menus" data={menu_data} onChange={handleMenuTypeFilter} object_type="menus" filter_name="menus"  
        value={selected_menu_data?selected_menu_data.key:"_none_"} select_value_field="key" select_display_field="pretty_name" any_display_label="-- Select --"  any_item={true}/>
      </div>
      <div style={{padding:"15px"}}>
      <ACSSelectFilter label="Menu Item" key="menu_items" data={menu_item_data} onChange={handleMenuItemTypeFilter} object_type="menu_items" filter_name="menus_items"  
      value={selected_menu_item_data?selected_menu_item_data.key:"_none_"} select_value_field="key" select_display_field="pretty_name" any_display_label="-- Select --"  any_item={true}/>

      </div>
      <div style={{padding:"15px"}}>  
        <ACSCreateButton  ButtonComponent={ButtonComponent} text="Add Menu Item" object_type="menu_items" action_props={{pretty_name:""}}/>
      </div>
     </Fragment>
    }
    </div>
    <div>
    {menu_data && selected_menu_data && !selected_menu_item_data &&
      <ACSObjectView data={selected_menu_data}  object_type="menus" id={selected_menu_data.id}/>
    }
    {menu_item_data && selected_menu_item_data && !selected_menu_data &&
      <ACSObjectView data={selected_menu_item_data}  object_type="menu_items" id={selected_menu_item_data.id}/>

    }
    {menu_data && Object.keys(menu_types).map((menu_type_key, index) => {
      const menu_type = menu_types[menu_type_key];
      return (<Accordion  expanded={selected_menu_type === menu_type_key} onChange={handleMenuTypeChange(menu_type_key)}>
        <AccordionSummary  expandIcon={<ExpandMoreIcon />}>
          {menu_type} 
        </AccordionSummary>
        <AccordionDetails style={{display:"flex", flexDirection:"column"}}> 
          {selected_menu_type === menu_type_key && Object.keys(menu_data).map((menu_data_key,index) => {
            const menu = menu_data[menu_data_key];
            if (menu.type !== menu_type_key) return null
            return (
            <Accordion >
              <AccordionSummary  expandIcon={<ExpandMoreIcon />}>
                {menu.pretty_name} {menu.type} 
              </AccordionSummary>
              <AccordionDetails > 
                {Object.keys(menu)}
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