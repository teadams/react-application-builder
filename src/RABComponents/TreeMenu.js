import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSListController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react'
import ACSField from '../Functional/ACSField2.js'
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

function TreeMenu(props)  {
  const {object_type, onClick, ...params} = props
  const field_list = [meta.keys(object_type).pretty_key_id]
  const [selected, setSelected] = React.useState([]);


  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    if (onClick) {
      onClick(nodeIds, event)
    }
  }

  function RenderTreeItem(props) {
    const {data, object_type, api_options={}} = props
    const {grouping_field=""} = api_options

    let field_name = meta.keys(object_type).pretty_key_id
    if (grouping_field && data.group_row) {
        field_name = grouping_field
    } 

    let label = ACSField({object_type:props.object_type, data:props.data, field_name:field_name, display:"text"})
    return (
      <TreeItem key={data.id} nodeId={data.id} label={label}>{props.children[1]}</TreeItem>
    )
  }

  const rab_component_model = {
          row:{components:{row_wrap:RenderTreeItem}},
          field:{component_names:{field_wrap:"Fragment", field:"Fragment"}},
    }

  const rab_component = {row_wrap:RenderTreeItem, field:Fragment, field_wrap:Fragment, row:Fragment}

  return (
     <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          // expanded={expanded}
          selected={selected}
          // onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
          >
          <ACSListController {...params}  rab_component_model={rab_component_model} object_type={props.object_type}  field_list={field_list}/>
    </TreeView>)
}

export default TreeMenu;