import React from 'react';
import { IconButton, Button} from '@material-ui/core';
import IconExpandMore from "@material-ui/icons/ExpandMore";
import * as log from '../../Utils/log.js'

class ButtonExpandMore extends React.Component {

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
      <IconExpandMore style={{height:15, width:15}}/>
      </Button>
      )
  }
}

export default ButtonExpandMore;
