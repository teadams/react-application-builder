import Debug from '../Debug.js'
import ObjectList  from './ObjectList.js';
import DrillDown  from './DrillDown.js';
import Field from './Field.js'
import RenderField from './RenderField.js'
import RenderFieldList from './RenderFieldList.js'
import RenderFieldListList from './RenderFieldListList.js'
import NewDrillDown from './NewDrillDown.js'


const functional_components = {
        ObjectList:ObjectList,
        FDrillDown:DrillDown,
        Debug:Debug,
        Field:Field,
        RenderField:RenderField,
        RenderFieldList:RenderFieldList,
        RenderFieldListList:RenderFieldListList,
        NewDrillDown:NewDrillDown

}


export {
functional_components
}