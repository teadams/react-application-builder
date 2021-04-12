// Copyright Teadams Holding Company 2019
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import * as api from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { ListItem, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import * as meta from '../../Utils/meta.js';
import UserRoles from './UserRoles.js'
import {ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType} from '../../ACSLibrary'
import {ACSFilterController} from '../../ACSRenderEngine'
import AuthContext from '../../Modules/User/AuthContext';
import AddRoleForm from "./AddRoleForm.js"


function Membership(props) {
  const {id} = props
  const [members, setMembers] = useState([])
  const [member_api_options, setMemberAPIOptions] = useState([])

  const [current_member, setCurrentMember] = useState(null)

  const [add_dialog, setAddDialog] = useState(false);

  const context = useContext(AuthContext)

  const filters = [
    {label:"RoleNEW", name:"key", default_value:2, object_type:"core_role",  select_field_name:"name", filter_field_name:"core_role", any_display_label:"Any"},
    ]

  if (id && id !=context.context_id && id !== "context") {
    context.setContextId(id)
    return null
  }

  const handleAddRole = (props) => {
    setAddDialog(true)
  }

  const handleFilterChange = (props) => {
    const api_options = Object.assign({},props)
    api_options.filter_field.push("core_subsite")
    api_options.filter_id.push(context.context_id)
    api_options.filter_join="AND"
    setMemberAPIOptions(api_options)    
  }

  const handleMembersData=(props) => {
    setMembers(props)
  
  }
  const handleOnAddClose= event => {
    setAddDialog(false)
  }


  const handleOnClick = (event, member_data, index) => {
    setCurrentMember(member_data)
  }; 
  let member_name =""
  if (current_member) {
      member_name = current_member.first_name + " " + current_member.last_name
  }

  let  filter_style = {paddingRight:"40px"}

  return (
    <Fragment>
    <ACSObjectType onData={handleMembersData} headless={true} object_type="core_subsite_role" api_options={member_api_options}/>
    <div style={{display:"flex", flexDirection:"column"}}>
      <div style={{display:"flex", flexDirection:"row"}}>
        <div style={{display:"flex", alignSelf:"flex-end", width:"200px"}}>
        </div>
        <div style={{display:"flex", alignItems:"center"}}>
          <div style={{display:"flex", marginTop:"10px", alignItems:"center", marginRight:"25px"}}>
              <Typography color="primary" variant="subtitle1">Filter Members By:</Typography>
          </div>
        </div>
        <div style={{display:"flex", alignItems:"center"}}>
          <ACSFilterController filter_style={{paddingRight:"40px"}} label_width="50px" select_width="100px" label_direction="row" filter_direction="row" filters={filters} default_value={3} alingSelf="flex-start" label_direction="row" label_variant="subtitle1" onChange={handleFilterChange}/>
        </div>
        <div style={{display:"flex", marginTop:"10px",  alignItems:"center", marginRight:"10px"}}>
        <Button onClick={handleAddRole}  size="small" variant="outlined" color="primary" style={{margin:5, borderRadius: '12px'}}>Add a Member</Button>

        </div>
      </div>
      <div>
        <Divider/>
      </div>
      <div style={{display:"flex", flexDirection:"row"}}>
        <div style={{width:"200px"}}>
          <Typography color="primary" variant="subtitle1">Members</Typography>

          {context.context_id &&
            <Fragment>
              {members.map ((member_data,index) => {
                const member = member_data.data_core_user
                return (<ListItem  onClick={(event) => handleOnClick(event, member_data, index)} key={index} value={index} name={index}><ACSField image_size="tiny" object_type="core_subsite_role" data={member_data} field_name="core_user" /></ListItem>
)
              })}
            </Fragment>
          }
        </div>
          {current_member && 
            <div style={{display:"flex", alignItems:"flex-start"}}>
              <div style={{display:"flex", marginRight:"30px"}}> <ACSField object_type="core_subsite_role" data={current_member} field_name="core_user" />
              </div>
              <div  style={{display:"flex", alignItems:"center"}}>
            <UserRoles core_user={current_member.data_core_user.id} core_subsite={context.context_id}/>
              </div>
            </div>
          }
      </div>
    </div>
    {add_dialog && 
  <Dialog open={true}>
    <DialogTitle>Create Role</DialogTitle>
    <DialogContent>
    <AddRoleForm open={true} core_subsite={context.context_id}  onClose={handleOnAddClose} dialog_size="lg"/>
  
    </DialogContent>
  </Dialog>
    }

    </Fragment>

  )
}

//valid_values:"Applied, Accepted, Denied, Retired", default:"Accepted"

export default Membership
