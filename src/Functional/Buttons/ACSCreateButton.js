import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {IconButton} from '@material-ui/core';
import IconCreate from "@material-ui/icons/Add";
import * as u from '../../Utils/utils.js'
import ACSObjectView from '../Rows/ACSObjectView.js'
import {Auth, AuthContext} from '../../Components/User/index.js';
import useGetModel from '../../Hooks/useGetModel.js'

function ACSCreateButton(props) {

  const {object_type, Component, layout, sections, field_list, dialog_size, auth_action="create"} = props
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

  const float=props.float?props.float:'none'

 return (
      <Fragment>
      <Auth auth_action={auth_action} object_type={object_type} prompt_login={false}>
      {Component?
       <Component text="here" onClick={handleOnClick}/>
      : <IconButton variant="fab" color="primary"  style={{ display:"inline"}} onClick={handleOnClick}>
      <IconCreate style={{height:15, width:15}}/>
      </IconButton>
      }
      {create_dialog  &&
      <ACSObjectView object_type={object_type} row_mode="create" row_form="true" layout={layout} sections={sections} onSubmit={handleOnSubmit} onClose={handleOnClose} field_list={field_list} dialog_size={dialog_size} /> }
      </Auth>
      </Fragment>
      )
}

export default ACSCreateButton;
