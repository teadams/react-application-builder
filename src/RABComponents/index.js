import React, {Fragment} from 'react';
import ObjectView from "./ObjectView.js"
import NavMenu from "./NavMenu.js"
import DrillDown from "./DrillDown.js"
import FieldView from "./FieldView.js"
import TreeMenu from "./TreeMenu.js"
import Text from "./Text.js"
import ObjectTypeView from "./ObjectTypeView.js"



const rab_components = { 
          ObjectView:ObjectView,
          Text:Text,
          NavMenu:NavMenu,
          DrillDown:DrillDown,
          FieldView:FieldView,
          TreeMenu:TreeMenu,
          ObjectTypeView:ObjectTypeView
}

export {
  rab_components
}