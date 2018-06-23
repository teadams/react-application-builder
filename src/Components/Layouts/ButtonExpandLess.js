import React from 'react';
import { IconButton, Button} from '@material-ui/core';
import IconExpandLess from "@material-ui/icons/ExpandLess";
import * as log from '../../Utils/log.js'

class ButtonExpandLess extends React.Component {

  constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
  }
  

  handleOnClick = event => {
    this.props.onClick(event, this.props.value);
  }

  render() {
      const float=this.props.float?this.props.float:'none'
      return (
      <Button variant="fab" color="primary"  style={{minHeight:20, height:20, width:20, float:float}} onClick={this.handleOnClick}>
      <IconExpandLess style={{height:15, width:15}}/>
      </Button>
      )
  }
}

export default ButtonExpandLess;
