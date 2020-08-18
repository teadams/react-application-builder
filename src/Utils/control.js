import * as u from './utils.js'
import rab_component_models from './component.js'
import _ from 'lodash/object'
// building the library of dynamic componetns
import React, {Component,Fragment} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

//import Text from "../Functional/Text/Text.js"
import RABHeaderAndBodyText from '../Functional/Text/RABHeaderAndBodyText.js'
import RABText from '../Functional/Text/RABText.js'
import Message from "../RABComponents/Message.js"

// Lists
import ACSObjectTypeView from "../Functional/Lists/ACSObjectTypeView.js"
import ACSChipObjectTypeView from "../Functional/Lists/ACSChipObjectTypeView.js"
import ACSMappingView from "../Functional/Lists/ACSMappingView.js"
import ACSPeopleAndOpportunitiesChip from "../Modules/User/ACSPeopleAndOpportunitiesChip.js"

import User from '../Functional/Fields/User.js'
import ACSAddress from '../Functional/Fields/ACSAddress.js'

import NWAProjectView from '../Components/NowWeAct/NWAProjectView.js'
import SubsiteApply from '../Components/NowWeAct/SubsiteApply.js'

// Engine
import ACSField from '../Functional/Fields/ACSField.js'
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSListController.js'

/// fields
import RABTextField from '../Functional/Fields/RABTextField.js'
import ACSURLField from '../Functional/Fields/ACSURLField.js'
import ACSYouTube from '../Functional/Fields/ACSYouTube.js'
import RABSelectField from '../Functional/Fields/RABSelectField.js'
import ACSFile from '../Functional/Fields/ACSFile.js'
import ACSReferencesField from '../Functional/Fields/ACSReferencesField.js'

// rows
import ACSObjectView from '../Functional/Rows/ACSObjectView.js'
import RABObjectPrettyName from '../Functional/Text/RABObjectPrettyName.js'
import RABObjectTypePrettyPlural from '../Functional/Text/RABObjectTypePrettyPlural.js'
import {Tab, Tabs, Menu, MenuItem, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

// layouts
import ACSMap from '../Functional/Lists/ACSMap.js'
import ACSMapAndFilter from '../Functional/Layouts/ACSMapAndFilter.js'
import {ACSWizard} from '../ACSLibrary/index.js'

const useStyles = makeStyles({
  table_cell: {
    padding: "4px"
  },
});

// precedence: low to high
// shell - defines structure and defaults for all
// default_component_for_layer - current list, row, field
// component_model - current component_running
// metadata_model - current object_type/field/etc (name?)
// input_props - current user input/result of upper layer
export function getFinalModel(level, input_props={}, metadata_model={}, component_model, override_meta_model=false, trace=false) {

  // XX could potentially determin metadata_model from 
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
  let final_model
  if (override_meta_model) {
  // imput parameters will prevail
    final_model = _.merge({},
                            rab_component_models.shell,
                            determineModelComponents(level,
                            rab_component_models[level]),  
                            
                            determineModelComponents(level,
                            component_model),

                            determineModelComponents(level, buildRABModel(metadata_model)),
 
                            determineModelComponents(level, buildRABModel(input_props))
                            )
  } else {
    // objevt or field meta model will prevail
    final_model = _.merge({},
                            rab_component_models.shell,
                            determineModelComponents(level,
                            rab_component_models[level]),  
                            
                            determineModelComponents(level,
                            component_model),

                            determineModelComponents(level, buildRABModel(input_props)),
                            determineModelComponents(level, buildRABModel(metadata_model))
                            )
 
  }


  // only want a shallow merge! (state management in getObject/list)
  // XX  Want to do this in a clean way,
  // perhaps with a prefix and not blindly pass 
  // down everything. do want some flexibility
  // in being able to expand. (teporary fix uses
  // build RAB model but it is not generic.

  determineModelComponents(level,final_model)

  return final_model

}

function buildRABModel(params, trace) {
  // if "built, retern"
  if (!params || params.built) {return}

  let flexible_params_model = _.merge({},rab_component_models.empty)
  Object.keys(params).forEach(param_name=> {
    const param_name_split = param_name.split("_")
    switch (param_name_split[0]) {
      case "field":
        if (param_name !== "field_model") {
          flexible_params_model.field.props[ param_name_split.slice(1).join("_")] = params[param_name]
        }
        break;
      case "row":
        flexible_params_model.row.props[ param_name_split.slice(1).join("_")] = params[param_name]
        break;
      case "list":
        flexible_params_model.list.props[ param_name_split.slice(1).join("_")] = params[param_name]
        break
    }

//    if (params.field_name === "email") {
//      u.a(param_name, params_model.field)
//    }
  })
  const fixed_params_model = {built:true,
                list:{names:{list:params.list_component},
                components:{},
                props:{object_type:params.object_type,
                       api_options:params.api_options,
                       field_list:params.field_list,
                }},
          row:{names:{}, components:{},props:{
                object_type:params.object_type,
                api_options:params.api_options,
                id:params.id,
                field_list:params.field_list,
                layout:params.layout,
                dialog_size:params.dialog_size,
                num_columns:params.num_columns,
                mode:params.row_mode?params.row_mode:params.mode,
          }},
          field:{names:{field:params.field_component},
                components:{}, 
                props:{
                  object_type:params.object_type,
                  api_options:params.api_options,
                  field_list:params.field_list,
                  field_name:params.field_name,
                  form_field_name:params.form_field_name,
                  onFieldClick:params.onFieldClick,
              }}
          }


  return   _.merge({},    
      rab_component_models[params.rab_component_model_name], params.rab_component_model, fixed_params_model, flexible_params_model)
}


function determineModelComponents(level, model) {
  // similar to buildRABModel, this could be precalculate
  // on load of the metadata.  
  if (!model) {return null}
  Object.keys(model[level].names).forEach(name =>{
    if (model[level].names[name] && !model[level].components[name]) {
      model[level].components[name] = componentByName(model[level].names[name],"control")
    }
    model[level].names[name] = undefined  
  })
  return model
}

export function componentByName(name) {
  const component = componentPicker(name)
    
  return component
  
}

function ACSTagWrap(props) {
  const {tag:Tag} = props  
  return(<Tag style={props.tag_style} key={props.key_id}>{props.children}</Tag>)
}

function RABTableContainer(props) {
  let style
  if (props.width) style={width:props.width}
  return(<TableContainer style={style} key={props.key_id}>{props.children}</TableContainer>)
}

function RABTable(props) {
  return(<Table style={{width:"100%"}} size="small" onClick={props.onClick}  onMouseOver={props.onMouseOver} key={props.key_id}>{props.children}</Table>)
}

function RABTableBody(props) {
  return(<TableBody onClick={props.onClick}  onMouseOver={props.onMouseOver} key={props.key_id}>{props.children}</TableBody>)
}

function RABTableRow(props) {
  const useStyles = makeStyles({
    root: {
      '&:nth-of-type(even)':{backgroundColor:"#D4D5DC"}
    }
  });

  const classes = useStyles();
  const className = props.no_stripe?"":classes.root
  
  return(<TableRow onClick={props.onClick}  onMouseOver={props.onMouseOver} className={className} key={props.key_id}>{props.children}</TableRow>)
}


function RABTableCell(props) {
  const classes = useStyles();
  const {emphasis, cell_style} = props

  
  return(<TableCell classes={{root:classes.table_cell}} onClick={props.onClick} style={{verticalAlign:"top"}} onMouseOver={props.onMouseOver}  key={props.key_id}>{props.children}</TableCell>)
}

function RABFragment(props) {
  return <Fragment>{props.children}</Fragment>
}

function RABVoid(props) {
  return <Fragment/>
}

function componentPicker(name, source="not provided") {
  if (!name) {alert ("No component provided in componentPicker:source "+ source);return Fragment}
  switch (name) {
    case "RABHeaderAndBodyText": return RABHeaderAndBodyText;
    case "RABText": return RABText;
    case "Message": return Message;
    case "ACSObjectTypeView": return ACSObjectTypeView;
    case "ACSMappingView": return ACSMappingView;
    case "ACSChipObjectTypeView": return ACSChipObjectTypeView;
    case "ACSField": return ACSField;
    case "ACSObjectView": return ACSObjectView;
    case "ACSRowController": return ACSRowController;
    case "ACSListController": return ACSListController;
    case "ACSPeopleAndOpportunitiesChip": return ACSPeopleAndOpportunitiesChip;
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
    case "ACSTagWrap": return ACSTagWrap;
    case "TableFooter": return TableFooter; 
    case "TableHead": return TableHead;
    case "TablePagination": return TablePagination; 
    case "TableRow": return RABTableRow; 
    case "TreeItem": return TreeItem; 
    case "TreeView": return TreeView;
    case "Fragment": return RABFragment;
    case "User":  return User;
    case "ACSAddress":  return ACSAddress;
    case "RABTextField":  return RABTextField;
    case "ACSURLField":  return ACSURLField;
    case "RABSelectField":  return RABSelectField;
    case "ACSFile":  return ACSFile;
    case "ACSReferencesField" : return  ACSReferencesField;
    case "ACSYouTube":  return ACSYouTube;
    case "RABVoid": return RABVoid;
    case "RABObjectPrettyName": return RABObjectPrettyName;
    case "RABObjectTypePrettyPlural": return RABObjectTypePrettyPlural;
    case "ACSMap": return ACSMap;
    case "ACSMapAndFilter": return ACSMapAndFilter;
    case "ACSWizard": return ACSWizard;
    case "NWAProjectView": return NWAProjectView;
    case "SubsiteApply": return SubsiteApply;
    default:  { 
      alert("Menu Model Issues - no component for " + name) 
      return Fragment;
    }
  }
}

