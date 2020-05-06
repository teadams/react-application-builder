import * as u from './utils.js'
import rab_component_model from '../Models/HealthMe/component.js'
// building the library of dynamic componetns
import React, {Fragment} from 'react';
import ObjectView from "../RABComponents/ObjectView.js"
import NavMenu from "../RABComponents/NavMenu.js"
import DrillDown from "../RABComponents/DrillDown.js"
import FieldView from "../RABComponents/FieldView.js"
import TreeMenu from "../RABComponents/TreeMenu.js"
import Text from "../RABComponents/Text.js"
import ObjectTypeView from "../RABComponents/ObjectTypeView.js"
import Debug from '../Debug.js'
import ACSField from '../Functional/ACSField2.js'
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSListController.js'
import RenderACSField from '../Functional/RenderACSField.js'
import RenderACSRow from '../Functional/RenderACSRow.js'
import RenderACSList from '../Functional/RenderACSList.js'
import {Tab, Tabs, Menu, MenuItem, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';


export function getFinalModel(level, {...component_models}) {
  let final_model = rab_component_model.shell
  return final_model[level]

}

export function componentByName(name) {
  const component = componentPicker(name)
  return component
  
}

function componentPicker(name) {
  if (!name) {alert (name);return Fragment}
  switch (name) {
    case "ObjectView": return ObjectView
    case "Text": return Text;
    case "NavMenu": return NavMenu;
    case "DrillDown": return DrillDown;
    case "FieldView": return FieldView;
    case "TreeMenu": return TreeMenu;
    case "ObjectTypeView": return ObjectTypeView;
    case "Debug": return Debug;
    case "ACSField": return ACSField;
    case "ACSRowController": return ACSRowController;
    case "ACSListController": return ACSListController;
    case "RenderACSField": return RenderACSField;
    case "RenderACSRow":  return RenderACSRow;
    case "RenderACSList": return RenderACSList;
    case "Tab": return Tab;
    case "Tabs": return Tabs;
    case "Menu": return Menu;
    case "MenuItem": return MenuItem;
    case "MenuList": return MenuList;
    case "List": return List;
    case "ListItem": return ListItem;
    case "ListItemAvatar": return ListItemAvatar; 
    case "ListItemIcon": return ListItemIcon;
    case "ListItemSecondaryAction": return ListItemSecondaryAction; 
    case "ListItemText": return ListItemText;
    case "ListSubheader": return ListSubheader; 
    case "Table": return Table; 
    case "TableBody": return TableBody; 
    case "TableCell": return TableCell; 
    case "TableContainer": return TableContainer;
    case "TableFooter": return TableFooter; 
    case "TableHead": return TableHead;
    case "TablePagination": return TablePagination; 
    case "TableRow": return TableRow; 
    case "TreeItem": return TreeItem; 
    case "TreeView": return TreeView;
    case "Fragment": return Fragment;
    default:  { 
      alert("Menu Model Issues - no component for " + name) 
      return Fragment;
    }
  }
}

