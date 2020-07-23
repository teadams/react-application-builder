import React, {  useState} from 'react';
import PopupContext from './PopupContext.js'
import { Popover} from '@material-ui/core';

function PopupContextProvider(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [PopupComponent, setPopupComponent] = useState(null)
  const handlePopupOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
  const handlePopupClose = () => {
      setAnchorEl(null);
  };

    
  const open = Boolean(anchorEl);
  const id = open ? 'acs-popover' : undefined;
    
  return (
    <PopupContext.Provider
      value={{
      setPopupComponent: (component) => {setPopupComponent(component)},
      popupOpen: (event) => handlePopupOpen(event),
      popupClose: () => handlePopupClose()
      }}>
        <Popover 
            id={id}
            open={open}
            anchorEl={anchorEl}
            children={<PopupComponent/>}
            onClose={handlePopupClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
        >
        </Popover>
        {props.children}
     </PopupContext.Provider>)
}

export default PopupContextProvider