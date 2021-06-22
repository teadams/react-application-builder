import React, {Fragment} from 'react';
import MetaModelAdmin from './MetaModelAdmin';

function ACSTest(props) {
  return (
    <Fragment>THIS IS A TEST</Fragment>
  )
}

export default function ACSAdminComponentPicker(name) {
  if (!name) {return null}
  switch (name) {
    case "MetaModelAdmin":
      return  MetaModelAdmin;
    case "ACSTEST":  
      return ACSTest
      break;
    default:  {
      return
    }
  }
}
