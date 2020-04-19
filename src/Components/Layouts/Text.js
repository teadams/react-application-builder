import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment} from 'react';
import {Paper, Typography} from '@material-ui/core';
//import * as meta from '../../Utils/meta.js'
import {Field} from "../Experimental"

class Text extends React.Component {
  constructor(props) {
        super(props);
  }

  render() {
    const data = {first_name:"Tracy", last_anme:"Adams", service_category_name:"Nail"}
    return (
      <Fragment>
        <Typography variant="headline">
         {this.props.title}
        </Typography>
        <Typography variant="body1" style={{padding:10}}>
         {this.props.text}
        </Typography>

      </Fragment>
    )
  }
}

export default Text;
