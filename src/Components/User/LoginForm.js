import React, {Fragment} from 'react';
import {  Grid, Paper, Typography, Divider, MenuItem, TextField, Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button } from '@material-ui/core';
import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);      
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleSubmit(event) {
  }
  handleClose(event) {
  }

  render() {
  return   <Dialog fullWidth={true}  open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>Login Now</DialogContentText>
            <form onSubmit={this.handleSubmit}>
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

export default LoginForm;
