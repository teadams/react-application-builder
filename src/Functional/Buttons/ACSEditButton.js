import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState} from 'react';
import {IconButton} from '@material-ui/core';
import IconEdit from "@material-ui/icons/Edit";
import * as u from '../../Utils/utils.js'
import ACSObjectView from '../Rows/ACSObjectView.js'

function ACSEditButton(props) {
  const {object_type, id, Component, layout, sections, field_list, dialog_size} = props
  const [create_dialog, setCreateDialog] = useState(false);

  const handleOnClick = event => {
    setCreateDialog(true)
    if (props.onClick) {
      props.onClick(event);
    }
  }
  const handleOnClose= event => {
    setCreateDialog(false)
    if (props.onClose) {
      props.onClose(event)
    }
  }

  const handleOnSubmit = (event,action, form_values, inserted_id) => {
    if (props.onSubmit) {
      props.onSubmit(event,action, form_values, inserted_id)
    }
  }


  const float=props.float?props.float:'none'
 return (
      <Fragment>
      {Component?
       <Component text="here" onClick={handleOnClick}/>
      : <IconButton variant="fab" color="primary"  style={{ display:"inline"}} onClick={handleOnClick}>
      <IconEdit style={{height:15, width:15}}/>
      </IconButton>
      }
      {create_dialog  &&
      <ACSObjectView object_type={object_type} id={id} row_mode="edit" row_form="true" layout={layout} sections={sections} onSubmit={handleOnSubmit} onClose={handleOnClose} field_list={field_list} dialog_size={dialog_size} /> }
      </Fragment>
      )
}

export default ACSEditButton;
