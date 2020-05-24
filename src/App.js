import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, { Component, Fragment} from 'react';
import Template from "./Template.js"
import {AuthContextProvider} from './Components/User';
import * as meta from './Utils/meta.js'
import useGetModel from "./Hooks/useGetModel.js"

function App(props) {
  return      (
    <AuthContextProvider>
    <Template {...props}/>
   </AuthContextProvider>
  )
}

export default App;



