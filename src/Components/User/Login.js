import React, {Fragment} from 'react';
import {Paper, Typography} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {Field} from "../Experimental"

const AuthContext = React.createContext('');

class Text extends React.Component {
  constructor(props) {
        super(props);
  }
  static contextType = AuthContext;

  render() {
    const data = {first_name:"Tracy", last_anme:"Adams", service_category_name:"Nail"}
    alert ("context is " + JSON.stringify(this.context))
    return (
      <Fragment>
        <Typography variant="headline">
         {this.props.title}
        </Typography>
        <Typography variant="body1" style={{padding:10}}>
         {this.props.text}
THIS IS THE LOGIN LINK
        </Typography>

      </Fragment>
    )
  }
}

export default Text;
