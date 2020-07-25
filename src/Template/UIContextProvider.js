
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

  const popup_open = Boolean(anchorEl);
  const popup_id = popup_open ? 'acs-popover' : undefined;
    
  return (
    <UIContext.Provider
      value={{
          dialog: {
            isDialogOpen: dialog_open,
            setDialogOpen: ()=> setDialogOpen(true),
            setDialogClosed:() => setDialogOpen(false),
          },
          popup: {
            isOpen: popup_open,
            setOrigin: (origin) => {setOrigin(origin)},
            setPopupComponent: (component) => {setPopupComponent(component)},
            open: (event, component) => handlePopupOpen(event, component, origin),
            close: () => handlePopupClose()
        }
      }}>
        {popup_open &&
        <Popover 
            id={popup_id}
            open={popup_open}
            anchorEl={anchorEl}
            children={<PopupC/>}
            onClose={handlePopupClose}
            anchorOrigin={origin.anchorOrigin}
            transformOrigin={origin.transformOrigin}
        ></Popover>}
        {props.children}
     </UIContext.Provider>)
}

export default UIContextProvider