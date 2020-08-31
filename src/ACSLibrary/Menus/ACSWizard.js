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

  const {menu_model, items:steps, item_data:step_data, pretty_name:wizard_summary, open=true} = props
  const context = useContext(AuthContext)

  const current_step_key = steps[current_step_number]
  const current_step_data = step_data[current_step_key]

  const {menu_component_name, pretty_name, summary, description, object_type, step_summary_style, step_description_style} = current_step_data
  const {mode, ...wizard_props}= current_step_data.props;
  // XX?? move up a level
  const [steps_state, setStepsState] = useState(null)
  
  function handleFormClose() {
    if (props.onClose) {
      props.onClose()
    } 
 }

  if (!steps_state) {
    let initial_step_state ={}
      steps.forEach((step,index) => {
      const {pretty_name, summary, description, completed, available, subtitle, force_refresh=true, dependencies} = step_data[step]
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

  const handleStep = (step, force_refresh) => () => {

    if (force_refresh) {
      setDataElements([current_step_number, data, id, id, step])
    } else {
      setDataElements([step, data, id, null, null])
    }
   };


   const WizardComponent = control.componentByName(menu_component_name);

   const handleStepSubmit = (event, result, form_values, inserted_id) => {
       let next_step_number = current_step_number + 1
       if (next_step_number >= steps.length) {
          handleFormClose()
          return
       }
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
       context.setDirty();
   }

   return (
     <Fragment>
       {transition_id && <ACSHeadlessObject id={transition_id} object_type={object_type}  onData={handleOnData}/>}
      <Dialog open={open} fullWidth={true} maxWidth="xl">
       <DialogTitle>{wizard_summary}</DialogTitle>
        <Stepper nonLinear alternativeLabel style={{padding:"0px 10px"}} activeStep={current_step_number}>  
         {steps.map ((step,index) => {
             const {pretty_name, summary,description, force_refresh=false} = step_data[step]
             const step_state = steps_state?steps_state[step]:{}
             return (
               <Step key={pretty_name} completed={step_state.completed} disabled={step_state.disabled}><StepButton  onClick={handleStep(index, force_refresh)} optional={step_state.subtitle}>{pretty_name}</StepButton></Step>
             )
           })}
        </Stepper>
        <DialogContent dividers={false}>
            <div style={step_summary_style}>{summary}{description && <Fragment>:</Fragment>}</div>
            {description && <div style={step_description_style}> {description}</div>}
            <p/>
         <WizardComponent onSubmit={handleStepSubmit} data={data} object_type={object_type} id={id} onClose={handleFormClose} row_delayed_auth={true} row_form={true} no_header={true} row_dialog_center={true} mode={mode}  delay_dirty={true} {...wizard_props}/>
        </DialogContent>
        <DialogActions>
        {(!mode || mode === "view") && <Button  onClick={handleFormClose} color="primary">
          Close
       </Button>}
      </DialogActions> 
        </Dialog>
       </Fragment>
     ) 
} 

function ACSWizard(props)  {
    return (
    <ACSMenuController {...props}>
        <Wizard/>
    </ACSMenuController>
    )
}
export default ACSWizard;
