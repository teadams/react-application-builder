import Debug from '../Debug.js'
import ObjectList  from './ObjectList.js';
import DrillDown  from './DrillDown.js';
import Field from './Field.js'
import RenderFieldList from './RenderFieldList.js'
import RenderFieldListList from './RenderFieldListList.js'
import NewDrillDown from './NewDrillDown.js'


const functional_components = {
        ObjectList:ObjectList,
        FDrillDown:DrillDown,
        Debug:Debug,
        Field:Field,
        RenderFieldList:RenderFieldList,
        RenderFieldListList:RenderFieldListList,
        NewDrillDown:NewDrillDown

}


export {
functional_components
}