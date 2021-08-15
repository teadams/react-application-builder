import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import ACSDrillDown from "../../ACSLibrary/Layouts/ACSDrillDown.js"
import {ACSSelectFilter, ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType, ACSCreateButton} from '../../ACSLibrary/index.js'



import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"
import AuthContext from '../../Modules/User/AuthContext';


function MenuModelAdmin(props) {
  const [menu_data, setMenuData] = useState();
  const [menu_item_data, setMenuItemData] = useState();

  const [selected_menu_data, setSelectedMenu] = useState()
  const [selected_menu_item_data, setSelectedMenuItem] = useState()

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
        setSelectedMenu(select_data);
        setSelectedMenuItem(null);
      } 
      if (menu_item_id === "_none_") {
        setSelectedMenu(null);
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
      </div>
      <div style={{padding:"15px"}}>  
      </div>
     </Fragment>
    }
    </div>
    <div>
    {menu_data && selected_menu_data && !selected_menu_item_data &&
      <ACSObjectView data={selected_menu_data}  object_type="menus" id={selected_menu_data.id}/>
    }
    {menu_data && selected_menu_item_data && !selected_menu_data &&
      <ACSObjectView data={selected_menu_data}  object_type="menus" id={selected_menu_data.id}/>
    }
    </div>
  </div>
  )
}

export default MenuModelAdmin