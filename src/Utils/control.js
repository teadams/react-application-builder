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
//import Text from "../Functional/Text/Text.js"
import RABHeaderAndBodyText from '../Functional/Text/RABHeaderAndBodyText.js'
import RABText from '../Functional/Text/RABText.js'
import Message from "../RABComponents/Message.js"
import ObjectTypeView from "../RABComponents/ObjectTypeView.js"
import Debug from '../Debug.js'
import User from '../Functional/Fields/User.js'
import ACSField from '../Functional/ACSField2.js'
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSListController.js'
import RABTextField from '../Functional/Fields/RABTextField.js'
import RABSelectField from '../Functional/Fields/RABSelectField.js'
import RABObjectPrettyName from '../Functional/Text/RABObjectPrettyName.js'
import RABObjectTypePrettyPlural from '../Functional/Text/RABObjectTypePrettyPlural.js'
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

  // To think about... if it is a list, definitely want the
  // row and field from the list to override the row/field default.
  // so I think we only want to apply the level model if it is the 
  // first one (when we move the timing to only do the current level).
  // Right now, it works because we calculate the highest level and then
  // it get threaded through input_props. The input props from the Menu 
  // and model_props are the same way.  We want them all to override
  // models from a lower level
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
  // XX  Want to do this in a clean way,
  // perhaps with a prefix and not blindly pass 
  // down everything. do want some flexibility
  // in being able to expand. (teporary fix uses
  // build RAB model but it is not generic.

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
              props:{object_type:params.object_type,
                     api_options:params.api_options,
                     field_list:params.field_list,
                     value:params.list_field_value,
                     autoFocus:params.list_autoFocus,
                     onSubmit:params.list_onSubmit,
                     onChange:params.list_onChange,
                     style:params.list_style,
                     prevent_edit:params.list_prevent_edit,
                     select_form_name:params.list_select_form_name,
                     select_key_field:params.list_select_key_field,
                     select_display_field:params.list_select_display_field}},
        row:{names:{}, components:{},props:{
              object_type:params.object_type,
              api_options:params.api_options,
              field_list:params.field_list,
              num_columns:params.num_columns,
              mode:params.row_mode?params.row_mode:params.mode,
              form:params.row_form
        }},
        field:{names:{field:params.field_component},
              components:{}, 
              props:{
                object_type:params.object_type,
                api_options:params.api_options,
                field_list:params.field_list,
                field_name:params.field_name,
                onFieldClick:params.onFieldClick,
                click_to_edit:params.field_click_to_edit,
                mouseover_to_edit:params.field_mouseover_to_edit,
                field_display:params.field_display,
                mode:params.field_mode,
                form:params.field_form,
                message:params.field_message}}
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

function RABTableContainer(props) {
  return(<TableContainer key={props.key_id}>{props.children}</TableContainer>)
}
function RABTable(props) {
  return(<Table onClick={props.onClick}  onMouseOver={props.onMouseOver} key={props.key_id}>{props.children}</Table>)
}

function RABTableBody(props) {
  return(<TableBody onClick={props.onClick}  onMouseOver={props.onMouseOver} key={props.key_id}>{props.children}</TableBody>)
}

function RABTableRow(props) {
  return(<TableRow onClick={props.onClick}  onMouseOver={props.onMouseOver}  key={props.key_id}>{props.children}</TableRow>)
}

function RABTableCell(props) {
  return(<TableCell  onClick={props.onClick}  onMouseOver={props.onMouseOver} colSpan={props.col_span} key={props.key_id}>{props.children}</TableCell>)
}

function RABFragment(props) {
  return <Fragment>{props.children}</Fragment>
}

function RABVoid(props) {
  return <Fragment/>
}

function componentPicker(name) {
  if (!name) {alert (name);return Fragment}
  switch (name) {
    case "ObjectView": return ObjectView
    case "RABHeaderAndBodyText": return RABHeaderAndBodyText;
    case "RABText": return RABText;
    case "Message": return Message;
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
    case "Table": return RABTable; 
    case "TableBody": return RABTableBody; 
    case "TableCell": return RABTableCell; 
    case "TableContainer": return RABTableContainer;
    case "TableFooter": return TableFooter; 
    case "TableHead": return TableHead;
    case "TablePagination": return TablePagination; 
    case "TableRow": return RABTableRow; 
    case "TreeItem": return TreeItem; 
    case "TreeView": return TreeView;
    case "Fragment": return RABFragment;
    case "User":  return User;
    case "RABTextField":  return RABTextField;
    case "RABSelectField":  return RABSelectField;
    case "RABVoid": return RABVoid;
    case "RABObjectPrettyName": return RABObjectPrettyName;
    case "RABObjectTypePrettyPlural": return RABObjectTypePrettyPlural;
    default:  { 
      alert("Menu Model Issues - no component for " + name) 
      return Fragment;
    }
  }
}

