// Copyright Teadams Holding Company, 2019

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState} from 'react';
import {IconButton} from '@material-ui/core';
import IconEdit from "@material-ui/icons/Edit";
import * as u from '../../Utils/utils.js'
import {ACSObjectView} from '../index.js'
import {Auth} from '../../Modules/User/index.js';

function ACSEditButton(props) {
  const {object_type, id, Component, action_props,  sections, field_list, data, dialog_size} = props
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


 return (
      <Fragment>
      <Auth auth_action="edit" object_type={object_type} prompt_login={false}>
        {Component?
        <Component text="here" onClick={handleOnClick}/>
        : <IconButton variant="fab" color="primary"  style={{ display:"inline"}} onClick={handleOnClick}>
        <IconEdit style={{height:15, width:15}}/>
        </IconButton>
        }
        {create_dialog  &&
        <ACSObjectView  object_type={object_type} data={data} id={id} mode="edit" row_form="true"  sections={sections} onSubmit={handleOnSubmit} onClose={handleOnClose} field_list={field_list} dialog_size={dialog_size} {...action_props} trace={true}/> }
      </Auth>
      </Fragment>
      )
}

export default ACSEditButton;
