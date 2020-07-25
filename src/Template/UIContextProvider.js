
import React, {useState, useContext, Fragment} from 'react';
import UIContext from './UIContext.js'
import { Popover, Button} from '@material-ui/core';
import * as u from '../Utils/utils.js'


function UIContextProvider(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [origin, setOrigin] = useState({anchorOrigin:{
    vertical: 'bottom',
    horizontal: 'right',
  },
  transformOrigin:{
    vertical: 'top',
    horizontal: 'right',
  }})

  const [dialog_open, setDialogOpen] = useState(null)
  const [PopupComponent, setPopupComponent] = useState(null)
  const handlePopupOpen = (event, Pcomponent) => {
      if (Pcomponent) {setPopupComponent(Pcomponent)}
      if (origin) {setOrigin(origin)}
      setAnchorEl(event.currentTarget);
    };
  
  const PopupC = (props) => {
        if (PopupComponent) {
          return (PopupComponent)
        } else {
          return null
        }
  }

  const handlePopupClose = () => {
      setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'acs-popover' : undefined;
    
  return (
    <UIContext.Provider
      value={{
      isDialogOpen: dialog_open,
      setDialogOpen: ()=> setDialogOpen(true),
      setDialogClosed:() => setDialogOpen(false),
      isOpen: open,
      setOrigin: (origin) => {setOrigin(origin)},
      setPopupComponent: (component) => {setPopupComponent(component)},
      open: (event, component) => handlePopupOpen(event, component, origin),
      close: () => handlePopupClose()
      }}>
        <Popover 
            id={id}
            open={open}
            anchorEl={anchorEl}
            children={<PopupC/>}
            onClose={handlePopupClose}
            anchorOrigin={origin.anchorOrigin}
            transformOrigin={origin.transformOrigin}
        >
        </Popover>
        {props.children}
     </UIContext.Provider>)
}

export default UIContextProvider