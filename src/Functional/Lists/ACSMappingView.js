import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js'
import * as control from '../../Utils/control.js';
import ACSObjectTypeView from './ACSObjectTypeView.js'
import ACSField from '../ACSField2.js'
import AuthContext from '../../Components/User/AuthContext';
import useGetModel from '../../Hooks/useGetModel.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import ACSListController from '../ACSListController.js'
import {Button, Tab, Tabs, Menu, MenuItem, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,Checkbox,TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions,} from '@material-ui/core';


function MappingHeaders(props) {
  return (
    <TableHead>
    <TableRow>
      <TableCell>Volunteer Needed?</TableCell>
      <TableCell>Role</TableCell>
      <TableCell>Role Summary</TableCell>
      <TableCell>Project Specific Needs</TableCell>
    </TableRow>
    </TableHead>
  )
}

function MappingRow(props) {
  const {data, object_type, api_options} = props
  const {mapping_name} = api_options
  const object_type_models = useGetModel("object_types")
  const object_model = object_type_models[object_type]
  const mapping_attributes = object_model[mapping_name]
  const {root_column, mapped_table, mapped_table_link, mapping_table_link, status_column, positive_status, negative_status}  = mapping_attributes
  const mapped_object_model = object_type_models[mapped_table]
  const TableCell = control.componentByName("TableCell")
  let default_checked = false
  if (data[status_column] === positive_status) {
      default_checked = true
  }
  const [checked, setChecked] = React.useState(default_checked);
  const [summary_data, setSummaryData] = React.useState(data[object_model.summary_key])
  function handleFieldChange(event) {
      setSummaryData(event.target.value);
  }

  function handleFormSubmit(event) {
    
    let submitted_object= {id:data.id}
    submitted_object[object_model.summary_key] = summary_data
    api.putData(object_type, submitted_object, {}, (result, error) => { 
      if (error) {
        alert ('error is ' + error.message)
      }
    })
  } 

  function handleCheckChanged(event) {
    const checked = event.target.checked
    setChecked(event.target.checked);
    let checked_object = {}
    if (checked) {
      checked_object[status_column] = positive_status
    } else {
      checked_object[status_column] = negative_status
    }
    if (data["id"]) {
        checked_object.id = data.id
        api.putData(object_type, checked_object, {}, (result, error) => { 
          if (error) {
            alert ('error is ' + error.message)
          }
        })
    } else {
        checked_object[mapping_table_link] = data[mapping_table_link][mapped_table_link]
        checked_object[root_column] = api_options.root_value 
        checked_object.subsite_id = api_options.subsite_id
        if (api_options.user_id) {
          checked_object.user_id = api_options.user_id
        }
        api.postData(object_type, checked_object, {}, (insert_result, error) => { 
          // XX user_id, subsite
          if (error) {
            alert ('error is ' + error.message)
          } else {
            const inserted_id = insert_result.rows[0][mapped_object_model.key_id] 
            u.a("create", inserted_id)
            data.id = inserted_id
//            context.setDirty();
          }
        })
    }
  }
  
  return (
  <Fragment>
   <TableCell><form>     
      <Checkbox
        checked={checked}
        onChange={handleCheckChanged}
        inputProps={{ 'aria-label': 'primary checkbox' }}/></form>
   </TableCell>
   <TableCell> Role {data[mapping_table_link][mapped_object_model.pretty_key_id]}</TableCell>
    <TableCell>{data[mapping_table_link][mapped_object_model.summary_key]}</TableCell> 
    <TableCell>{(data[status_column] === positive_status) && <form onSubmit={handleFormSubmit}>     
       <TextField
          multiline={true}
          rows={2}
          maxRows={2}
          fullWidth
          onBlur={handleFormSubmit}
          value={summary_data}
          name={data[object_model.summary_key]}
          onChange={handleFieldChange}
         />
      </form>}
  </TableCell>
  </Fragment>
  )
}

//      root_column:"core_subsite" 
//         - linked to root object, column stays the same
//      mapped_table:"core_role" 
//         -- Table that provides the values
//      mapped_table_link:"id",
//          -- column in mapped_table that links to the mapping_table
//      mapping_table_link:"role_name",
//          -- column in mapping_table that linkes to Mapped_table
//      status_colun 
//            -- Column indicating status
//      positive_status:"Recruiting"
//           -- Value indivating "true"
//      negative_status:"Filled"
//           -- Value indicating "no"
// ?? other columns to display

function ACSMappingView(props)  {
  const {object_type, dialog_open=true, root_value, mapping_name, api_options={}, ...params} = props
  const context = useContext(AuthContext)

  if (mapping_name) {
      // attribute to use for this mapping
      api_options.mapping_name = mapping_name
  }
  if (root_value) {
      api_options.root_value = root_value
  }
  if (!api_options.root_value) {
    // if not provided, use subsite context
    api_options.root_value = context.context_id
  }
  if (!api_options.root_value) {
      return null
  }
// XX move above
  function handleOnClose() {
    if (props.onClose) {
      props.onClose()
    }
  }


  const rab_component_model = { 
      list:{components:{
                    list_header:MappingHeaders},
            names:{header_wrap:"RABVoid", 
                  list_container:"TableContainer",
                  list_wrap:"Table",
                  list_header_wrap:"Fragment",
                  list_header:"Fragment",
            
                  body_wrap:"TableBody",
                  footer:"RABVoid",
                  list_pagination:"RABVoid"},
            props:{mode:"edit"}
      },
      row:{components:{
            row:MappingRow,
          },
          names:
            {form_wrap:"Fragment"}
          ,
          props: {
            mode:"edit",
            form:true,
            no_stripe:true,
          }
      },
      field:{names:{
            field_wrap:"Fragment"
          },
      }}


  return (  
  <Dialog fullWidth={true} open={dialog_open}  maxWidth="lg" aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Project Needs</DialogTitle>
      <DialogContent>
        <ACSListController {...params} rab_component_model={rab_component_model} list_mode="edit" mode="edit" object_type={object_type} api_options={api_options}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose}  color="primary">
         Close
       </Button>
      </DialogActions> 
    </Dialog> )
}
export default ACSMappingView;

