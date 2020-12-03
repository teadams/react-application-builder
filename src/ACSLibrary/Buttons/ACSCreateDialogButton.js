// Copyright Teadams Holding Company, 2019

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {IconButton} from '@material-ui/core';
import IconCreate from "@material-ui/icons/Add";
import * as u from '../../Utils/utils.js'
import {Auth, AuthContext} from '../../Modules/User/index.js';
import useGetModel from '../../Hooks/useGetModel.js'

function ACSCreateDialogButton(props) {

  const {object_type, id, ButtonComponent, DialogComponent, layout, sections, field_list, dialog_size, action_props, auth_action="create", row_mode, row_form, require_authorization=true} = props

  const [create_dialog, setCreateDialog] = useState(false);
  const context = useContext(AuthContext)
  const context_id = context.context_id
  const object_model = useGetModel("object_types", object_type)
  if (object_model.with_context && !context_id && object_type !== "core_subsite" && object_model.extends_object !== "core_subsite") {
    return null
  }
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
      <Auth require_authorization={require_authorization} auth_action={auth_action} object_type={object_type} prompt_login={false}>
      {ButtonComponent?
       <ButtonComponent text="here" onClick={handleOnClick}/>
      : <IconButton variant="fab" color="primary"  style={{ display:"inline"}} onClick={handleOnClick}>
      <IconCreate style={{height:15, width:15}}/>
      </IconButton>
      }
      {create_dialog  &&
      <DialogComponent object_type={object_type} id={id} row_mode={row_mode} row_form={row_form} layout={layout} sections={sections} onSubmit={handleOnSubmit} onClose={handleOnClose} field_list={field_list} dialog_size={dialog_size} {...action_props}/> }
      </Auth>
      </Fragment>
      )
}

export default ACSCreateDialogButton;
