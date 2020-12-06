import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import {ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType} from '../../ACSLibrary'

import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"
import useForm from "../../Hooks/useForm.js"
import useGenerateFieldList from "../../Hooks/useGenerateFieldList.js"

import AuthContext from '../../Modules/User/AuthContext';

// pass corrct values 
// investigate using userForm 
// pass in API 
// Pretty up

function EditRoleForm(props) {
  //XX TODO For now, assume the role info in id data
  const {data, id} = props


  function handleEditRoleSubmit(event) {
      handleClose(event)
  }


  let field_list = useGenerateFieldList("core_subsite_role", "", data, "edit", true)

  let {formAttributes, lastTouched, handleFormChange, handleFormSubmit} = useForm("core_subsite_role", "", data, handleEditRoleSubmit, "edit", true, {status:"Accepter"}, field_list)

  const core_subsite_role_object_meta = useGetModel("object_types", "core_subsite_role")
  const context = useContext(AuthContext)

  function handleClose(event) {
      if (props.onClose) {
        props.onClose(event)
      }
  }

  let width="sm"

  return   (
           <form onSubmit={handleFormSubmit}>
            <Grid container>
              <Grid item style={{padding:10}} sm={12}>
                  <ACSField
                  object_type = "core_subsite_role"
                  field_name = "core_role"  
                  mode="edit"
                  field_display="name_value"
                  form={false}
                  label_width="15%"
                  value={formAttributes[0]["core_role"]}
                  data={formAttributes[0]}
                  formAttributes={formAttributes}
                  disableUnderline={false}
                  handleFormChange={handleFormChange}
                  id = "core_role"
                  autoFocus={true}
                  key="core_role" key_id="core_role"
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item style={{padding:10}} sm={12}>
                <ACSField
                object_type = "core_subsite_role"
                field_name = "status"  
                mode="edit"
                value={formAttributes[0]["status"]}
                label_width="15%"
                field_display="name_value"
                form={false} 
                data={formAttributes[0]}
                formAttributes={formAttributes}
                disableUnderline={false}
                handleFormChange={handleFormChange}
                id = "status"
                autoFocus={false}            
                key="status" key_id="status"
              /> 
                </Grid>
              </Grid>
        <DialogActions>
            <Button onClick={handleFormSubmit} color="primary">
                 Submit
            </Button>
            <Button onClick={handleClose} color="primary">
                  Cancel
            </Button>
        </DialogActions>    
        </form>

    )
  
}

export default EditRoleForm;
