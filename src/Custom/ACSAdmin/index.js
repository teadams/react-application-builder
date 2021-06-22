import React, {Fragment} from 'react';

function ACSTest(props) {
  return (
    <Fragment>THIS IS A TEST</Fragment>
  )
}

export default function ACSAdminComponentPicker(name) {
  if (!name) {return null}
  switch (name) {
    case "ACSTEST":  
      return ACSTest
      break;
    default:  {
      return
    }
  }
}
