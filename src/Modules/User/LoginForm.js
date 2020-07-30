import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {Grid, Paper, Typography, Divider, MenuItem, TextField, Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import ACSField from "../../Functional/Fields/ACSField.js"
import RABTextField from "../../Functional/Fields/RABTextField.js"

import * as api from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"

import update from 'immutability-helper';
import AuthContext from './AuthContext';

function LoginForm(props) {
  const [activeTab, setActiveTab] = useState(0)
  const [formValues, setFormValues] = useState({email:"", credential:"", credential_confirm:"", first_name:"", last_name:""})
  const core_user_object_meta = useGetModel("object_types", "core_user")
  const context = useContext(AuthContext)
  function handleTabChange(event, index) {
    setActiveTab(index)
  }

  function handleCreateSubmit(event) {
      if (!formValues.credential) {
        alert ("Please type in a password")
      } else if (formValues.credential != formValues.credential_confirm) {
          alert ("password and password confirm do not match")
      } else {
        api.createAccount( formValues,  (result, error) => { 
          if (error) {
              alert ("there has been an error")
          } else { 
            var inserted_id = result[core_user_object_meta.key_id] 
            const user_data = Object.assign(formValues, {id:inserted_id})
            context.login(user_data)
            if (props.onLogin) {
              props.onLogin()
            }   

          }
          })
      }
  }

  function handleLoginSubmit(event) {
    let data_object = {}
    data_object.email = formValues["email"]
    data_object.credential = formValues["credential"]

    api.login ( data_object,  (user_data, error) => {
        if (!user_data.email_match) {
            alert ('email not found')
        } else if (!user_data.password_match) {
            alert ("password is not correct")
        } else {
          context.login(user_data)
          if (props.onLogin) {
            props.onLogin()
          }   
        }
    })
    // update context

  }

  function handleClose(event) {
      if (props.onClose) {
        props.onClose(event)
      }
  }

  const handleChange = ((event) => {
    event.persist();
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormValues(formValues => ({...formValues, [event.target.name]:value}));
  })

  return   (
    <Dialog fullWidth={true}  open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
    <Tabs 
      onChange={handleTabChange} 
      value={activeTab} 
      indicatorColor="primary"
      textColor="primary"
      >
      <Tab label="Login" />
      <Tab label="Create Account" />
    </Tabs>
    {activeTab === 0 &&
      <Fragment>
        <DialogTitle id="form-dialog-login">Login</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
           <form onSubmit={handleLoginSubmit}>
            <Grid container>
              <Grid item style={{padding:10}} sm={12}>
                  <ACSField
                  object_type = "core_user"
                  field_name = "email"  
                  field_mode="edit"
                  field_display="name_value"
                  field_form={false}
                  label_width="15%"
                  value={formValues["email"]}
                  data={formValues}
                  formValues={formValues}
                  disableUnderline={false}
                  handleFormChange={handleChange}
                  id = "email"
                  autoFocus={true}
                  key="email" key_id="email"
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item style={{padding:10}} sm={12}>
                <ACSField
                object_type = "core_credential"
                field_name = "credential"  
                field_mode="edit"
                label_width="15%"
                field_display="name_value"
                field_form={false} 
                data={formValues}
                formValues={formValues}
                disableUnderline={false}
                handleFormChange={handleChange}
                id = "credential"
                autoFocus={false}            
                key="credential" key_id="credential"
              /> 
                </Grid>
              </Grid>
            </form>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleLoginSubmit} color="primary">
                 Submit
            </Button>
            <Button onClick={handleClose} color="primary">
                  Cancel
            </Button>
        </DialogActions>
      </Fragment>
      }
      {activeTab === 1 &&
          <Fragment>
            <DialogTitle id="form-dialog-create-account">Create Account</DialogTitle>
            <DialogContent>
              <DialogContentText></DialogContentText>
              <form onSubmit={handleCreateSubmit}>
              <Grid container>
                <Grid item style={{padding:10}} sm={6}> 
                    <ACSField
                    object_type = "core_user"
                    field_name = "first_name"  
                    field_mode="create"
                    field_display="name_value"
                    field_form={false}
                    value={formValues["first_name"]}
                    data={formValues}
                    formValues={formValues}
                    disableUnderline={false}
                    handleFormChange={handleChange}
                    id = "first_name"
                    autoFocus={true}
                    key="first_name" key_id="first_name"
                  />

                </Grid>
                <Grid item style={{padding:10}} sm={6}>
                <ACSField
                object_type = "core_user"
                field_name = "last_name"  
                field_mode="create"
                field_display="name_value"
                field_form={false}
                value={formValues["last_name"]}
                data={formValues}
                formValues={formValues}
                disableUnderline={false}
                handleFormChange={handleChange}
                id = "last_name"
                key="last_name" key_id="last_name"
              />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item style={{padding:10}} sm={12}>
                <ACSField
                object_type = "core_user"
                field_name = "email"  
                field_mode="create"
                field_display="name_value"
                field_form={false}
                value={formValues["email"]}
                data={formValues}
                formValues={formValues}
                disableUnderline={false}
                handleFormChange={handleChange}
                id = "email"
                key="email" key_id="email"
              />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item style={{padding:10}} sm={6}>
                <ACSField
                object_type = "core_credential"
                field_name = "credential"  
                field_mode="create"
                field_display="name_value"
                field_form={false} 
                data={formValues}
                formValues={formValues}
                disableUnderline={false}
                handleFormChange={handleChange}
                id = "credential"
                autoFocus={false}            
                key="credential" key_id="credential"
              /> 
                </Grid>
                <Grid item style={{padding:10}} sm={6}>
                <ACSField
                object_type = "core_credential"
                field_name = "credential_confirm"  
                field_mode="edit"
                field_display="name_value"
                field_form={false} 
                data={formValues}
                formValues={formValues}
                disableUnderline={false}
                handleFormChange={handleChange}
                id = "credential_confirm"
                autoFocus={false}            
                key="credential_confirm" key_id="credential_confirm"
              /> 
                </Grid>
              </Grid>
          </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCreateSubmit} color="primary">
                     Submit
                </Button>
                <Button onClick={handleClose} color="primary">
                      Cancel
                </Button>
            </DialogActions>
          </Fragment>
      }
    </Dialog>)
  
}

export default LoginForm;
