import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../../Utils/utils.js'
import {ACSListController} from '../../../ACSRenderEngine'

import React, {} from 'react';


function ACSReferencesList(props)  {
  const {object_type,  ...params} = props
u.a(object_type,props.mode)
  return (<ACSListController {...params} list_mode="view" object_type={object_type} api_options={props.api_options}/> )
}
export default ACSReferencesList;

