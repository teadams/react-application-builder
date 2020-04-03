import React, {Fragment} from 'react';
import {Grid, Paper, Typography, Divider, MenuItem, TextField, Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import {MappingForm, Field} from "../Experimental/index.js"
import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import update from 'immutability-helper';
import AuthContext from './AuthContext';
import {CreateForm} from "../Layouts/index.js";


class LoginForm extends React.Component {
  constructor(props) {
    super(props);              
    this.state = {
      formValues: {},
      activeTab: 0
    }   
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(event, index) {
    this.setState({activeTab: index})
  }

  handleCreateSubmit(event) {
      if (this.state.formValues.password != this.state.formValues.password_confirm) {
          alert ("password and password confirm do not match")
      } else {
        data.postData("nwn_user", this.state.formValues, {}, (result, error) => { 
          if (error) {
              alert ("there has been an error")
          } else { 
            var inserted_id = result.rows[0][meta.keys("nwn_user").key_id] 
            this.setState({ formValues: update(this.state.formValues,{
                        id: {$set: inserted_id}
                        })},
                        this.context.login(this.state.formValues)
            )  ;
          }
      })
    }
  }

  handleLoginSubmit(event) {
    data.getData ("nwn_user", {filter_id:this.state.formValues["email"], filter_field:"email"}, (user_data, error) => {
        if (user_data.length == 0) {
            alert ('user not found')
        } else {
          //  alert ('user infor is ' + JSON.stringify(user_data[0]["id"]))
          this.context.login(user_data[0])  
        }
    })
    // update context
    //close form
    // call the handle close from the props

  }

  handleClose(event) {
      this.props.handleClose(event)
  }

  handleChange (field_name, value)  {
    //  alert ("process change " + field_name + " "  + value)
      this.setState({ formTouched:true, formValues: update(this.state.formValues,{
                  [field_name]: {$set: value}
                  }) });
  }

  render() {
  return   (
    <Dialog fullWidth={true}  open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
    <Tabs 
      onChange={this.handleTabChange} 
      value={this.state.activeTab} 
      indicatorColor="primary"
      textColor="primary"
      >
      <Tab label="Login" />
      <Tab label="Create Account" />
    </Tabs>
    {this.state.activeTab == 0 &&
      <Fragment>
        <DialogTitle id="form-dialog-login">Login</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
           <form onSubmit={this.handleLoginSubmit}>
            <Grid container>
              <Grid item style={{padding:10}} sm={12}>
                  <Field object_type = "nwn_user"
                  field_name = "email"  
                  mode="form_element"
                  data_object={this.state.formValues}
                  disableUnderline={false}
                  onChange={this.handleChange}
                  id = "email"
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item style={{padding:10}} sm={12}>
                  <Field object_type = "nwn_user"
                  field_name = "password"  
                  mode="form_element"  
                  data_object= {this.state.formValues}
                  disableUnderline={false}
                  onChange={this.handleChange}
                  id = "password"
                  /> 
                </Grid>
              </Grid>
            </form>
        </DialogContent>
        <DialogActions>
            <Button onClick={this.handleLoginSubmit} color="primary">
                 Submit
            </Button>
            <Button onClick={this.handleClose} color="primary">
                  Cancel
            </Button>
        </DialogActions>
      </Fragment>
      }
      {this.state.activeTab == 1 &&
          <Fragment>
            <DialogTitle id="form-dialog-create-account">Create Account</DialogTitle>
            <DialogContent>
              <DialogContentText></DialogContentText>
              <form onSubmit={this.handleCreateSubmit}>
              <Grid container>
                <Grid item style={{padding:10}} sm={6}>
                    <Field object_type = "nwn_user"
                      field_name = "first_name"  
                      mode="form_element"
                      data_object={this.state.formValues}
                      disableUnderline={false}
                      onChange={this.handleChange}
                      id = "first_name"
                    /> 
                </Grid>
                <Grid item style={{padding:10}} sm={6}>
                    <Field object_type = "nwn_user"
                      field_name = "last_name"  
                      mode="form_element"
                      data_object={this.state.formValues}
                      disableUnderline={false}
                      onChange={this.handleChange}
                      id = "last_name"
                    /> 
                </Grid>
              </Grid>
              <Grid container>
                <Grid item style={{padding:10}} sm={12}>
                  <Field object_type = "nwn_user"
                    field_name = "email"  
                    mode="form_element"
                    data_object={this.state.formValues}
                    disableUnderline={false}
                    onChange={this.handleChange}
                    id = "email"
                  /> 
                </Grid>
              </Grid>
              <Grid container>
                <Grid item style={{padding:10}} sm={6}>
                 <Field object_type = "nwn_user"
                    field_name = "password"  
                    mode="form_element"
                    data_object={this.state.formValues}
                    disableUnderline={false}
                    onChange={this.handleChange}
                    id = "password"
                  /> 
                </Grid>
                <Grid item style={{padding:10}} sm={6}>
                  <Field object_type = "nwn_user"
                  field_name = "password_confirm"  
                  mode="form_element"
                  data_object={this.state.formValues}
                  disableUnderline={false}
                  onChange={this.handleChange}
                  id = "password_confirm"
                  />
                </Grid>
              </Grid>
          </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleCreateSubmit} color="primary">
                     Submit
                </Button>
                <Button onClick={this.handleClose} color="primary">
                      Cancel
                </Button>
            </DialogActions>
          </Fragment>
      }
      </Dialog>)
  }
}

LoginForm.contextType = AuthContext;
export default LoginForm;
