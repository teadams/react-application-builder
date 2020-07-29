import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import {ACSFieldController} from '../../ACSRenderEngine/index.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';


 function ACSField(props)  {

u.a("field", props)
  return ( 
      <ACSFieldController {...props} />
  )
}
export default ACSField;
