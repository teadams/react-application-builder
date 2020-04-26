import React from 'react';
import Debug from '../Debug.js'
import ObjectList  from './ObjectList.js';
import DrillDown  from './DrillDown.js';
import ACSField from './ACSField.js'
import ACSFieldSet from './ACSFieldSet.js'

import RenderACSField from './RenderACSField.js'
import RenderACSFieldSet from './RenderACSFieldSet.js'
//import RenderACSFieldSetList from './RenderACSFieldSetList.js'
import NewDrillDown from './NewDrillDown.js'
import AvatarUser from './AvatarUser.js'

const ACSFieldMemo = React.memo(ACSField)

const functional_components = {
        ObjectList:ObjectList,
        FDrillDown:DrillDown,
        Debug:Debug,
        ACSField:ACSField,
        ACSFieldMemo:ACSFieldMemo,
        ACSFieldSet:ACSFieldSet,
        RenderACSField:RenderACSField,
        RenderACSFieldSet:RenderACSFieldSet,
    //    RenderACSFieldSetList:RenderACSFieldSetList,
        NewDrillDown:NewDrillDown,
        AvatarUser:AvatarUser,
}


export {
functional_components
}