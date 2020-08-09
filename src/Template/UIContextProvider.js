
import React, {useState, useContext, Fragment} from 'react';
import UIContext from './UIContext.js'
import { Popover, Button} from '@material-ui/core';
import * as u from '../Utils/utils.js'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
//    width: '400px',
  },
  paper: {
//      width: '600px',
  },
});

function UIContextProvider(props) {
  const classes = useStyles();
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
  const [DialogComponent, setDialogComponent] = useState(null)

  const handlePopupOpen = (event, Pcomponent) => {
      if (Pcomponent) {setPopupComponent(Pcomponent)}
      //if (origin) {setOrigin(origin)}
      setAnchorEl(event.currentTarget);
    };

  const handleDialogOpen = (event, Dcomponent) => {
      if (Dcomponent) {
        setDialogComponent(Dcomponent)
        setDialogOpen(true)
      }
  };
  
  const PopupC = (props) => {
        if (PopupComponent) {
          return (PopupComponent)
        } else {
          return null
        }
  }

  const DialogC = (props) => {
        if (DialogComponent) {
          return (DialogComponent)
        } else {
          return null
        }
  }

  const handlePopupClose = () => {
      setAnchorEl(null);
  };

  const handleDialogClose = () => {
      setDialogOpen(false);
  };


  const popup_open = Boolean(anchorEl);
  const popup_id = popup_open ? 'acs-popover' : undefined;
    
  return (
    <UIContext.Provider
      value={{
          dialog: {
            isOpen: dialog_open,
            open: (event, component)=> handleDialogOpen(event, component),
            close:() => handleDialogClose(),
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
          classes={{
             root: classes.root, // class name, e.g. `classes-nesting-root-x`
             paper: classes.paper, // class name, e.g. `classes-nesting-label-x`
           }}
            id={popup_id}
            open={popup_open}
            anchorEl={anchorEl}
            children={<PopupC/>}
            onClose={handlePopupClose}
            anchorOrigin={origin.anchorOrigin}
            transformOrigin={origin.transformOrigin}
        ></Popover>}
        {dialog_open &&
          <DialogC/>
        }
        {props.children}
     </UIContext.Provider>)
}

export default UIContextProvider