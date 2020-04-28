import React, {Fragment} from 'react';
import Debug from '../Debug.js'
import ObjectList  from './ObjectList.js';
import DrillDown  from './DrillDown.js';
import ACSField from './ACSField.js'
import ACSFieldSet from './ACSFieldSet.js'
import ACSList from './ACSList.js'
import RenderACSField from './RenderACSField.js'
import RenderACSFieldSet from './RenderACSFieldSet.js'
import RenderACSList from './RenderACSList.js'
import {Tab, Tabs, Menu, MenuItem, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

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
        ACSList:ACSList,
        RenderACSField:RenderACSField,
        RenderACSFieldSet:RenderACSFieldSet,
        NewDrillDown:NewDrillDown,
        AvatarUser:AvatarUser,
        Tab:Tab,
        Tabs:Tabs,
        Menu:Menu,
        MenuItem:MenuItem,
        MenuList:MenuList,
        List:List,
        ListItem:ListItem,
        ListItemAvatar:ListItemAvatar, 
        ListItemIcon:ListItemIcon, 
        ListItemSecondaryAction:ListItemSecondaryAction, 
        ListItemText:ListItemText, 
        ListSubheader:ListSubheader, 
        Table:Table, 
        TableBody:TableBody, 
        TableCell:TableCell, 
        TableContainer:TableContainer,
        TableFooter:TableFooter, 
        TableHead:TableHead,
        TablePagination:TablePagination, 
        TableRow:TableRow, 
        TreeItem:TreeItem, 
        TreeView:TreeView,
        Fragment:Fragment
}


export {
functional_components
}