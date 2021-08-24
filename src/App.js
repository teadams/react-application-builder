import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {} from 'react';

import * as u from './Utils/utils.js'
import Template from "./Template/Template.js"
import {AuthContextProvider} from './Modules/User';
import ModelContextProvider from './Template/ModelContextProvider.js';
import UIContextProvider from './Template/UIContextProvider.js';
import { DragDropContext } from 'react-beautiful-dnd';

function App(props) {
  return      (
    <DragDropContext>
      <ModelContextProvider>
        <AuthContextProvider>
          <UIContextProvider>
              <Template {...props}/>
          </UIContextProvider>
        </AuthContextProvider>
      </ModelContextProvider>
    </DragDropContext>
  )
}

export default App;



