import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {AuthContext, Auth, LoginForm} from '../../Modules/User/index.js';
import {ACSHeadlessObject} from '../../ACSLibrary';
import {ACSMenuController} from '../../ACSRenderEngine';

import _ from 'lodash/object'

import { Stepper, Step, StepLabel, StepButton, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import UIContext from '../../Template/UIContext';
import useGetModel from '../../Hooks/useGetModel'

const Wizard = (props) => {
  const [data_elements, setDataElements] = useState([0, props.data, undefined, props.id, undefined])
  const [current_step_number, data, id, transition_id, next_step_number] = data_elements 
  const {menu_model, items:steps, item_data:step_data, pretty_name:wizard_summary} = props

  const current_step_key = steps[current_step_number]
  const current_step_data = step_data[current_step_key]

  const {menu_component_name, pretty_name, summary, object_type} = current_step_data
  const {mode, ...wizard_props}= current_step_data.props;
  // XX?? move up a level
  const [steps_state, setStepsState] = useState(null)
  
  function handleFormClosed() {
    if (props.onClose) {
      props.onClose()
    } 
 }

  if (!steps_state) {
    let initial_step_state ={}
      steps.forEach((step,index) => {
      const {pretty_name, completed, available, subtitle, dependencies} = step_data[step]
      const {mode} = step_data[step].props

          initial_step_state[step] ={}
          initial_step_state[step].completed = completed?completed:false
          initial_step_state[step].subtitle = subtitle?subtitle:""
          initial_step_state[step].disabled = available?!available:true
          if (index === 0) {
            // first step is always availaable
            initial_step_state[step].disabled = false
          }

          if (["edit","view"].includes(mode) && !id) {
            // can not edit if there is no id 
            initial_step_state[step].disabled = true
          }
    })
    setStepsState(initial_step_state)
  }

  const handleStep = (step) => () => {
    setDataElements([step, data, id, null, next_step_number])
   };

   const WizardComponent = control.componentByName(menu_component_name);

   const handleStepSubmit = (event, result, form_values, inserted_id) => {
       let next_step_number = current_step_number + 1
       const current_steps = steps[current_step_number]
       let new_steps_state = _.merge({}, steps_state)
       new_steps_state[steps[current_step_number]].completed = true
       if (result === "created") {
         setDataElements([current_step_number, data, id, inserted_id, next_step_number])
       }  else {
        // XX right now assume every step gets new data
         setDataElements([current_step_number, data, id, id, next_step_number])
       }
       setStepsState(new_steps_state) 
   }
 
   // will refresh from the database each time.
   // do not cause flickering
   const handleOnData = (api_results) => {
       setDataElements([next_step_number, api_results, transition_id, undefined, undefined])
       let new_steps_state = _.merge({}, steps_state)
      // should follow dependency rules
       steps.forEach((step,index) => {
         new_steps_state[steps[index]].disabled = false
       })
       setStepsState(new_steps_state)
   }

   return (
     <Fragment>
       {transition_id && <ACSHeadlessObject id={transition_id} object_type={object_type}  onData={handleOnData}/>}
      <Dialog open={true} fullWidth={true} maxWidth="xl">
       <DialogTitle>{wizard_summary}</DialogTitle>
        <Stepper nonLinear alternativeLabel style={{padding:"0px 10px"}} activeStep={current_step_number}>  
         {steps.map ((step,index) => {
             const {pretty_name} = step_data[step]
             const step_state = steps_state?steps_state[step]:{}
             return (
               <Step key={pretty_name} completed={step_state.completed} disabled={step_state.disabled}><StepButton  onClick={handleStep(index)} optional={step_state.subtitle}>{pretty_name}</StepButton></Step>
             )
           })}
        </Stepper>
        <DialogContent dividers={false}>
           <DialogContentText>
         <div  >{pretty_name}: {summary}</div>
         </DialogContentText>
         <WizardComponent onSubmit={handleStepSubmit} data={data} object_type={object_type} id={id} onClose={handleFormClosed} row_delayed_auth={true} row_form={true} no_header={true} row_dialog_center={true} mode={mode}  {...wizard_props}/>
        </DialogContent>
        <DialogActions>
        {(!mode || mode === "view") && <Button  onClick={handleFormClosed} color="primary">
          Close
       </Button>}
      </DialogActions> 
        </Dialog>}
       </Fragment>
     ) 
} 

 function ACSWizard(props)  {
    return (
    <ACSMenuController {...props}>
        <Wizard another="test"/>
    </ACSMenuController>
    )
}
export default ACSWizard;
