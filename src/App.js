import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {} from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import Template from "./Template/Template.js"
import {AuthContextProvider} from './Modules/User';
import ModelContextProvider from './Template/ModelContextProvider.js';
import UIContextProvider from './Template/UIContextProvider.js';

function App(props) {
  return      (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <ModelContextProvider>
      <AuthContextProvider>
        <UIContextProvider>
            <Template {...props}/>
        </UIContextProvider>
      </AuthContextProvider>
    </ModelContextProvider>
  </MuiPickersUtilsProvider>
  )
}

export default App;



