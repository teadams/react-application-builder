import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as utils from '../Utils/utils.js';
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
  const {object_type, custom_display_field, grouping_field, parent_field, order_by_direction, order_by, LabelComponent} = props
  const [tree_data, setTreeData] = useState([]);

  useGetObjectList(object_type, props, (object_list_data, error) => {
    let tree_data = []
    let data_map = {}
    if (object_list_data) {
      object_list_data.forEach((row,i) => { 
            row._nodeId = row.id
            row._label =  <Label object_data={row}/>
            if (parent_field) {
                data_map[row.id] = i
                row.children = []
            }
      })
    }

    if (grouping_field) {
        tree_data = prepareGroupingData(object_list_data)
    } else if (parent_field) {
        tree_data = prepareHierarchyData(object_list_data,data_map)
    } else {
        tree_data = object_list_data
    }
    setTreeData(tree_data)
  });

  function Label(props) {    
      if (LabelComponent != undefined) {
        return <LabelComponent data={props.object_data} object_type={object_type}/>
      } else {
        return meta.get_display_value(object_type,custom_display_field, props.object_data)
      }
  }

  function prepareGroupingData(object_list_data) {
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

  function prepareHierarchyData(object_list_data, data_map) {
    let tree_data = []  
    object_list_data.forEach((row, i) => {
      const parent = row[parent_field]
      if (!parent) {
         tree_data.push(row)
      } else {
          let parent_row = object_list_data[data_map[parent]]
          parent_row.children.push(row)
      }
    })
    return tree_data
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

  if (tree_data) {
    return (
    <Fragment>
    <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}>
        {tree_data && <RenderTree nodes={tree_data}/>}  
    </TreeView>
    </Fragment>
    );
    } else {
        return null
    }
}

export default ObjectList;
