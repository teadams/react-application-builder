import React, {Fragment} from 'react';
import MetaModelAdmin from './MetaModelAdmin';
import MenuModelAdmin from './MenuModelAdmin';
import AppParamAdmin from './AppParamAdmin';


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
    case "MenuModelAdmin":
      return  MenuModelAdmin;
    case "AppParamAdmin":
        return  AppParamAdmin;
    case "ACSTEST":  
      return ACSTest
      break;
    default:  {
      return
    }
  }
}
