import * as u from './utils.js'
import rab_component_models from '../Models/HealthMe/component.js'
import _ from 'lodash/object'
// building the library of dynamic componetns
import React, {Component,Fragment} from 'react';
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
import {Tab, Tabs, Menu, MenuItem, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

// precedence: low to high
// shell - defines structure and defaults for all
// default_component_for_layer - current list, row, field
// component_model - current component_running
// metadata_model - current object_type/field/etc (name?)
// input_props - current user input/result of upper layer
export function getFinalModel(level, input_props={}, metadata_model={}, component_model) {

  // XX could potentially determin metadata_model from 
  // object_type and field. then caller would not have to.
  // This would require getFinalModel to change to a React Function
  // (return string, one input object) and receive an object 
  // that would be mutated.
  // a little unconventional.  it would allow us encapsulate
  // the logic to get the proper model for things like refererence
  // field in this level below.
  let final_model = _.merge({},
                            rab_component_models.shell,
                            determineModelComponents(level,
                            rab_component_models[level]),  
                            
                            determineModelComponents(level,
                            buildRABModel(component_model)),

                            determineModelComponents(level, buildRABModel(metadata_model)),
 
                            determineModelComponents(level, buildRABModel(input_props))
                            )
  
  // only want a shallow merge! (state management in getObject/list)
  // Commenting out for now as it was getting in the 
  // way of debugging.  Want to do this in a clean way,
  // perhaps with a prefix and not blindly pass 
  // down everything
  //final_model[level].props = Object.assign(final_model[level].props, input_props)
  // XX should merge only this level bug
  determineModelComponents(level,final_model)

  return final_model

}

function buildRABModel(params) {
  /// XXBIG - items need completed
  /// but may have a better strategy to do this.

  if (!params) {return}
  return   _.merge({},     
      rab_component_models[params.rab_component_model_name], params.rab_component_model,
      { list:{names:{list:params.list_component},
              components:{},
              props:{}},
        row:{names:{}, components:{},props:{}},
        field:{names:{field:params.field_component},
              components:{}, 
              props:{onFieldClick:params.onFieldClick,
                     click_to_edit:params.field_click_to_edit,
                     mouseover_to_edit:params.field_mouseover_to_edit}}
      })
}

function determineModelComponents(level, model) {
  // similar to buildRABModel, this could be precalculate
  // on load of the metadata.  
  if (!model) {return null}
  Object.keys(model[level].names).forEach(name =>{
    if (model[level].names[name] && !model[level].components[name]) {
      model[level].components[name] = componentByName(model[level].names[name])
    }
    model[level].names[name] = undefined  
  })
  return model
}

export function componentByName(name) {
  const component = componentPicker(name)
    
  return component
  
}

function RABFragment(props) {
  return <Fragment/>
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
    case "Fragment": return RABFragment;
    case "AvatarUser":  return Text;
    default:  { 
      alert("Menu Model Issues - no component for " + name) 
      return Fragment;
    }
  }
}

