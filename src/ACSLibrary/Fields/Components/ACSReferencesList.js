import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../../Utils/utils.js'
import {ACSListController} from '../../../ACSRenderEngine'

import React, {} from 'react';


function ACSReferencesList(props)  {
  const {object_type, mode,  ...params} = props
  if (["edit","create"].includes(mode)) {
    return (<ACSListController {...params} no_header={true} list_pagination={false} list_mode="list_edit" row_form={true} field_click_to_edit={false} num_add={3} allow_add={true} object_type={object_type} api_options={props.api_options}/> )
  } else {
    return (<ACSListController {...params} list_mode="list"  no_header={true} list_pagination={false}  field_click_to_edit={false} object_type={object_type} api_options={props.api_options}/> )
  }
}
export default ACSReferencesList;


