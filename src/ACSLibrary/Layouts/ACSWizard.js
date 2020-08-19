import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {AuthContext, Auth, LoginForm} from '../../Modules/User/index.js';
import {ACSHeadlessObject} from '../../ACSLibrary';
import _ from 'lodash/object'


import { Stepper, Step, StepLabel, StepButton, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import UIContext from '../../Template/UIContext';
import useGetModel from '../../Hooks/useGetModel'

 function ACSWizard(props)  {
  const {menu,  ...params} = props
  //const [data, setData] = useState(props.data)
  //const [id, setId] = useState()
//  const [transition_id, setTransitionId] = useState(props.id)
  const [data_elements, setDataElements] = useState([0, props.data, undefined, props.id, undefined])
  const [current_step_number, data, id, transition_id, next_step_number] = data_elements 
  const wizard_models = useGetModel("menus")
  const wizard_model = wizard_models.menus[menu]
  const {items:steps, title} = wizard_model
  const current_step_name = steps[current_step_number]
  const {menu_component_name, label, header_text, object_type} = wizard_models.menu_items[current_step_name]
  const {mode, ...wizard_props}= wizard_models.menu_items[current_step_name].props;

//wizard_model.steps.
  const [steps_state, setStepsState] = useState(null)
  
  if (!steps_state) {
    let initial_step_state ={}
      steps.forEach((step,index) => {
      const {label, completed, available, subtitle, dependencies} = wizard_models.menu_items[step]
      const {mode} = wizard_models.menu_items[step].props

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

  function handleFormClosed() {
    if (props.onClose) {
      props.onClose()
    } 
  }

  const WizardComponent = control.componentByName(menu_component_name);
  const handleStepSubmit = (event, result, form_values, inserted_id) => {
      let next_step_number = current_step_number + 1
      const current_steps = steps[current_step_number]
      let new_steps_state = _.merge({}, steps_state)
      new_steps_state[steps[current_step_number]].completed = true

          
      if (result === "created") {
        setDataElements([current_step_number, data, id, inserted_id, next_step_number])
        steps.forEach((step,index) => {
          new_steps_state[steps[index]].disabled = false
        })
      }  else {
        setDataElements([current_step_number, data, id, id, next_step_number])
      }

      setStepsState(new_steps_state)
  }

  // will refresh from the database each time.
  // do not cause flickering
  const handleOnData = (api_results) => {
      setDataElements([next_step_number, api_results, transition_id, undefined, undefined])
  }


  return (
      <Fragment>
      {transition_id && <ACSHeadlessObject id={transition_id} object_type={object_type}  onData={handleOnData}/>}
       <Dialog open={true} fullWidth={true} maxWidth="xl">
        <DialogTitle>{title}</DialogTitle>
         <Stepper nonLinear alternativeLabel style={{padding:"0px 10px"}} activeStep={current_step_number}>  
          {steps.map ((step,index) => {
              const {label} = wizard_models.menu_items[step]
              const step_state = steps_state?steps_state[step]:{}
              return (
                <Step key={label} completed={step_state.completed} disabled={step_state.disabled}><StepButton  onClick={handleStep(index)} optional={step_state.subtitle}>{title}</StepButton></Step>
              )
            })}
         </Stepper>
         <DialogContent dividers={false}>
            <DialogContentText>
          <div >{header_text}</div>
          </DialogContentText>
          <WizardComponent onSubmit={handleStepSubmit} data={data} object_type={object_type} id={id} onClose={handleFormClosed} row_delayed_auth={true} row_form={true} no_header={true} row_dialog_center={true} mode={mode}  {...wizard_props}/>
         </DialogContent>
         <DialogActions>
         {mode === "view" && <Button  onClick={handleFormClosed} color="primary">
           Close
        </Button>}
       </DialogActions> 
         </Dialog>}
      </Fragment>
      )
}
export default ACSWizard;
