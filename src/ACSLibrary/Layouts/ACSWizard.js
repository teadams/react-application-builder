import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import {ACSRowController} from '../../ACSRenderEngine/index.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {AuthContext, Auth, LoginForm} from '../../Modules/User/index.js';

import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import UIContext from '../../Template/UIContext';
import useGetModel from '../../Hooks/useGetModel'

 function ACSWizard(props)  {
  const {wizard, ...params} = props
  const [data, setData] = useState(props.data)
  const wizard_models = useGetModel("wizards")
  const wizard_model = wizard_models[wizard]
  const steps = wizard_model.steps
  const [current_step, setCurrentStep] = useState(steps[0])
  const dialog = useContext(UIContext).dialog
  let {form_open=props.row_form} = props
  if (!props.onClose) {
      form_open=dialog.isOpen
  }

  function handleFormClose() {
    if (props.onClose) {
      props.onClose()
    } else {
      dialog.close()
    }
  }

  const component_name = wizard_model[current_step].component;
  const {...wizard_props}= wizard_model[current_step].props;
  const WizardComponent = control.componentByName(component_name);
  
  //<Dialog fullWidth={true} maxWidth={dialog_size} open={Boolean(props.open)} onClose={handleOnClose} aria-labelledby="form-dialog-title">
  //<DialogTitle id="form-dialog-title">{form_title?form_title:(u.capitalize(props.mode) + u.capitalize(object_type_pretty_name))}</DialogTitle>
//    <Auth auth_action="create" object_type="core_subsite" onClose={onClose} data={data}>

  return (
      <Dialog open={true} fullWidth={true} maxWidth="xl">
        <DialogTitle> THISI S TEH TITLE</DialogTitle>
        <WizardComponent row_delayed_auth={true}  row_form={true} no_header={true} row_dialog_center={true} onClose={handleFormClose} {...wizard_props}/>
      </Dialog>
      )
}
export default ACSWizard;
