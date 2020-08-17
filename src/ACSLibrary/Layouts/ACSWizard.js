import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';

import {ACSRowController} from '../../ACSRenderEngine/index.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
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
  
  return (<WizardComponent row_form={true} onClose={handleFormClose} {...wizard_props}/>)
}
export default ACSWizard;
