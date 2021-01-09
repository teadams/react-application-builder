import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../../Utils/utils.js'
import {ACSListController} from '../../../ACSRenderEngine'

import React, {Fragment,useEffect} from 'react';

function ACSReferenceMapping(props)  {
  const {object_type, mode,  field_name, field_list, num_add=3, allow_add=true, allow_save=false,field_model, pretty_name,...params} = props

  if (["edit","create"].includes(mode)) {
    return (
    <Fragment>
    {pretty_name}
    {field_model.summary}
    </Fragment>)
  } else {
    return ( "VIEW")
  }
}
export default ACSReferenceMapping;


