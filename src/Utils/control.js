import ObjectView from "../RABComponents/ObjectView.js"
import NavMenu from "../RABComponents/NavMenu.js"
import DrillDown from "../RABComponents/DrillDown.js"
import FieldView from "../RABComponents/FieldView.js"
import TreeMenu from "../RABComponents/TreeMenu.js"
import Text from "../RABComponents/Text.js"
import ObjectTypeView from "../RABComponents/ObjectTypeView.js"



export function componentByName(name) {
  switch (name) {
    case "ObjectView": return ObjectView;
    case "Text":return Text
    case "NavMenu":return NavMenu
    case "DrillDown":return DrillDown
    case "FieldView":return FieldView
    case "TreeMenu":return TreeMenu
    case "ObjectTypeView":return ObjectTypeView
  }
}

export function getFinalModel(level, {...component_models}) {


}