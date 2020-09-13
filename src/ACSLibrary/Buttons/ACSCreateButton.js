import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {IconButton} from '@material-ui/core';
import IconCreate from "@material-ui/icons/Add";
import * as u from '../../Utils/utils.js'
import * as control from '../../Utils/control.js'
import {Auth, AuthContext} from '../../Modules/User/index.js';
import useGetModel from '../../Hooks/useGetModel.js'

function ACSCreateButton(props) {

  const {object_type, ButtonComponent, layout, sections, field_list, dialog_size, action_props, auth_action="create", require_authorization=true, text="", menu="ObjectView"} = props
  const [create_dialog, setCreateDialog] = useState(false);
  const context = useContext(AuthContext)
  const context_id = context.context_id
  const object_model = useGetModel("object_types", object_type)
  const menu_model =  useGetModel("menus")

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
    handleOnClose(event)
  }

// get menu, menu can get the component
  const selected_menu_model = menu_model.menu_items[menu]
  const component_name = selected_menu_model.menu_component_name
  let ActionComponent = control.componentByName(component_name)
  const { ...menu_props} = selected_menu_model



 return (
      <Fragment>
      <Auth require_authorization={require_authorization} auth_action={auth_action} object_type={object_type} prompt_login={false}>
      {ButtonComponent?
       <ButtonComponent text={text} onClick={handleOnClick}/>
      : <IconButton variant="fab" color="primary"  style={{ display:"inline"}} onClick={handleOnClick}>
      <IconCreate style={{height:15, width:15}}/>
      </IconButton>
      }
      {create_dialog  &&
      <ActionComponent test="foo" row_delayed_auth={true} object_type={object_type} num_columns={1} mode="create" row_form="true" layout={layout} sections={sections} onSubmit={handleOnSubmit} onClose={handleOnClose} field_list={field_list} dialog_size={dialog_size}   {...menu_props}  {...action_props} mode="create"/> }
      </Auth>
      </Fragment>
      )
}

export default ACSCreateButton;
