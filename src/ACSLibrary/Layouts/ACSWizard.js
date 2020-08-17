import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import {ACSRowController} from '../../ACSRenderEngine/index.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {AuthContext, Auth, LoginForm} from '../../Modules/User/index.js';

import { Stepper, Step, StepLabel, StepButton, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import UIContext from '../../Template/UIContext';
import useGetModel from '../../Hooks/useGetModel'

 function ACSWizard(props)  {
  const {wizard,id,  ...params} = props


  const [data, setData] = useState({id:55})

  const wizard_models = useGetModel("wizards")
  const wizard_model = wizard_models[wizard]
  const {steps, wizard_title} = wizard_model

  const [current_step_number, setCurrentStepNumber] = useState(0)
  const current_step_name = steps[current_step_number]
  function handleFormClose() {
    if (props.onClose) {
      props.onClose()
    } 
  }
  const {component_name, title, instructions, object_type} = wizard_model[current_step_name]
  const {...wizard_props}= wizard_model[current_step_name].props;
  const WizardComponent = control.componentByName(component_name);

  //<Dialog fullWidth={true} maxWidth={dialog_size} open={Boolean(props.open)} onClose={handleOnClose} aria-labelledby="form-dialog-title">
  //<DialogTitle id="form-dialog-title">{form_title?form_title:(u.capitalize(props.mode) + u.capitalize(object_type_pretty_name))}</DialogTitle>
//    <Auth auth_action="create" object_type="core_subsite" onClose={onClose} data={data}>
  function handleButton (event) {
  }
  return (
      <Fragment>
      <Dialog open={true} fullWidth={true} maxWidth="xl">
        <Stepper activeStep={current_step_number}>  
          <Step> <StepLabel>One</StepLabel> </Step>
          <Step completed={true} disabled={false}> <StepButton  onClick={handleButton}> <StepLabel>Two</StepLabel></StepButton> </Step>
          <Step completed={true}><StepLabel> What happens now </StepLabel> </Step>
        </Stepper>
        <DialogContent>
          <div style={{fontSize:"22px"}}>{wizard_title}</div>
          {title}
          {instructions}
          <WizardComponent data={data} object_type={object_type} id={id} row_delayed_auth={true} row_form={true} no_header={true} row_dialog_center={true} onClose={handleFormClose} {...wizard_props}/>
    </DialogContent>
        </Dialog>
    
      </Fragment>
      )
}
export default ACSWizard;
