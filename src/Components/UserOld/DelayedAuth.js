import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState} from 'react';
import Auth from "./Auth.jg"

function DelayedAuth(props) {
  const [auth_tag, setAuthTag] = useState(false)
  const {...auth_props, onClick} = props
  function handleOnClick(event) {
    setAuthTag(true)
  }
  
  function handleOnClose(event) {
    setAuthTag(false)
  }
    
  function handleOnClickAuth(event) {
    setAuthTag(false)
    if (onClick) {
        onClick()
    }
    }
    if (auth_tag) {
        return (<Auth {...auth_props} onAuthorized={handleOnClickAuth}  onClose={handleOnClose}/>)
    } else {
        return <Button onClick={handleOnClick}>{props.children}</Button>
    }
  }
}

export default DelayedAuth;
