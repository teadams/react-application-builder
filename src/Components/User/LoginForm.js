import React, {Fragment} from 'react';
import {Grid, Paper, Typography, Divider, MenuItem, TextField, Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button } from '@material-ui/core';
import {MappingForm, Field} from "../Experimental/index.js"
import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import update from 'immutability-helper';
import AuthContext from './AuthContext';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);              
    this.state = {
      formValues: {},
    }   
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleSubmit(event) {
    data.getData ("nwn_user", {filter_id:this.state.formValues["email"], filter_field:"email"}, (user_data, error) => {
        alert ("end submit and " + JSON.stringify(user_data))
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
  }

  handleChange (field_name, value)  {
    //  alert ("process change " + field_name + " "  + value)
      this.setState({ formTouched:true, formValues: update(this.state.formValues,{
                  [field_name]: {$set: value}
                  }) });
  }

  render() {
  return   <Dialog fullWidth={true}  open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
            <form onSubmit={this.handleSubmit}>

            <Field object_type = "nwn_user"
              field_name = "email"  
              mode="form_element"
              data_object={this.state.formValues}
              disableUnderline={false}
              onChange={this.handleChange}
              id = "email"
            /> 
            <Field object_type = "nwn_user"
              field_name = "password"  
              mode="form_element"
              data_object={this.state.formValues}
              disableUnderline={false}
              onChange={this.handleChange}
              id = "email"
            /> 
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleSubmit} color="primary">
                 Submit
          </Button>
          <Button onClick={this.handleClose} color="primary">
                 Cancel
          </Button>
        </DialogActions>
      </Dialog>

  }
}

LoginForm.contextType = AuthContext;
export default LoginForm;
