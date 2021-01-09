import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../../Utils/utils.js'
import {ACSListController} from '../../../ACSRenderEngine'

import React, {Fragment,useEffect} from 'react';

function ACSReferenceMapping(props)  {
  const {object_type, mode,  field_name, field_list, num_add=3, allow_add=true, allow_save=false,field_model, valid_values, pretty_name,...params} = props

  if (["edit","create"].includes(mode)) {
u.a(valid_values)
    return (
    <Fragment>
    {pretty_name}
    {field_model.summary}
    {valid_values!=="transition" && valid_values.map(valid_value =>{
        return(valid_value.name)
    })}
    </Fragment>)
  } else {
    return ( "VIEW")
  }
}
export default ACSReferenceMapping;


