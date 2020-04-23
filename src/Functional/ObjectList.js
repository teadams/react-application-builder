import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import useGetObjectList from '../Hooks/useGetObjectList';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


function ObjectList(props) {
  let parent_field = "parent_subsite"
  const {object_type, custom_display_field, grouping_field} = props
  let object_list_data = useGetObjectList(object_type, props);
  // for performnce, could have a call back to object_list_data and only calculate new ordering if there 
  // is a change

  if (object_list_data) {
    object_list_data.forEach(row => { 
          row._nodeId = row.id
          row._label =  <Label object_data={row}/>
    })
  }

  let tree_data = []
  
  function Label(props) {
      return meta.get_display_value(object_type,custom_display_field, props.object_data)
  }

  function prepareGroupingData() {
    if (!object_list_data) {
      return
    }
  
    let current_group_value = ""
    let current_group_node = {}
    let tree_data = []
    object_list_data.forEach((row, i) => {
      const row_grouping_value = meta.get_display_value(object_type,grouping_field, row)
      if (current_group_value != row_grouping_value) {
          let group_node = {}
          group_node._nodeId = row.id + "-grouping"
          group_node._label =  <Label object_data={row}/>
          group_node.children = [row]
          tree_data.push(group_node)
          current_group_value = row_grouping_value
          current_group_node = group_node 
      } else {
        current_group_node.children.push(row)
      }
    })
    return tree_data
  }

  function prepareHierarchyData() {
    if (!object_list_data) {
      return
    }

    let tree_data = []
    let tree_structure = {}
    object_list_data.forEach((row, i) => {
      const parent = row[parent_field]
      if (!parent) {
         row.children = []
         tree_data.push(row)
         tree_structure[row.id] = row
      } else {
          let parent_row = tree_structure[parent]
          row.children = []
          parent_row.children.push(row)
          tree_structure[row.id] = row
      }
    })
    return tree_data
  }


  // ** Render **


  if (grouping_field) {
      tree_data = prepareGroupingData()
  } else if (parent_field) {
      tree_data = prepareHierarchyData()
  } else {
      tree_data = object_list_data
  }
  
  

  function RenderTree(props) {
      const {nodes} = props
      return (
        <Fragment>
          {nodes.map(node => {
              return (<Fragment>
                        <TreeItem key={node._nodeId} nodeId={node._nodeId} label={node._label}>
                          {Array.isArray(node.children) && <RenderTree nodes={node.children}/>}
                        </TreeItem>
                      </Fragment>
              )
          })}
        </Fragment>)
  }


  return (<Fragment>
  <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}>
      {tree_data && <RenderTree nodes={tree_data}/>}  
  </TreeView>
  </Fragment>
  );
}

export default ObjectList;
