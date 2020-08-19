import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {AuthContext, Auth, LoginForm} from '../../Modules/User/index.js';
import {ACSHeadlessObject} from '../../ACSLibrary';

import { Stepper, Step, StepLabel, StepButton, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import UIContext from '../../Template/UIContext';
import useGetModel from '../../Hooks/useGetModel'

 function ACSWizard(props)  {
  const {wizard,  ...params} = props

  //const [data, setData] = useState(props.data)
  //const [id, setId] = useState()
//  const [transition_id, setTransitionId] = useState(props.id)
  const [data_elements, setDataElements] = useState([0, props.data, undefined, props.id, undefined])
  const [current_step_number, data, id, transition_id, next_step_number] = data_elements 

  const wizard_models = useGetModel("wizards")
  const wizard_model = wizard_models[wizard]
  const {steps, wizard_title} = wizard_model
  const current_step_name = steps[current_step_number]
  
  function handleFormClose() {
    if (props.onClose) {
      props.onClose()
    } 
  }

  const {component_name, title, instructions, object_type} = wizard_model[current_step_name]
  const {...wizard_props}= wizard_model[current_step_name].props;
  const WizardComponent = control.componentByName(component_name);
  const handleStepSubmit = (event, result, form_values, inserted_id) => {
      let next_step_number = current_step_number + 1
      if (result === "created") {
        setDataElements([current_step_number, data, id, inserted_id, next_step_number])
      }  else {
        setDataElements([current_step_number, data, id, id, next_step_number])
      }
  }

  // will refresh from the database each time.
  // do not cause flickering
  const handleOnData = (api_results) => {
      setDataElements([next_step_number, api_results, transition_id, undefined, undefined])
  }

  function handleButton (event) {
  }

//           <Step completed={true} disabled={false}> <StepButton  onClick={handleButton}> <StepLabel>Two</StepLabel></StepButton> </Step>
//           <Step completed={true}><StepLabel> What happens now </StepLabel> </Step>

// Headless
  return (
      <Fragment>
      {transition_id && <ACSHeadlessObject id={transition_id} object_type={object_type}  onData={handleOnData}/>}
       <Dialog open={true} fullWidth={true} maxWidth="xl">
        <DialogTitle>{wizard_title}</DialogTitle>
         <Stepper alternativeLabel style={{padding:"0px 10px"}} activeStep={current_step_number}>  
          {wizard_model.steps.map ((step,index) => {
              const {title} = wizard_model[step]
              return (
                <Step><StepLabel>{title}</StepLabel></Step>
              )
            })}
         </Stepper>
         <DialogContent dividers={false}>
            <DialogContentText>
          <div style={{fontSize:"22px"}}>{title}</div>
          <div>{instructions}</div>
          </DialogContentText>
          <WizardComponent onSubmit={handleStepSubmit} data={data} object_type={object_type} id={id} row_delayed_auth={true} row_form={true} no_header={true} row_dialog_center={true} onClose={handleFormClose} {...wizard_props}/>
         </DialogContent>
         </Dialog>}
      </Fragment>
      )
}
export default ACSWizard;
