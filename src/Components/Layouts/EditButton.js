import React from 'react';
import { IconButton} from '@material-ui/core';
import EditIcon from "@material-ui/icons/Edit";
import * as log from '../../Utils/log.js'


class EditButton extends React.Component {

  constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
  }
  

  handleOnClick = event => {
    this.props.onClick(event, this.props.index);
  }

  render() {
      return (
      <IconButton size="small" style={{margin:0, height:'50%', width:'50%'}} onClick={this.handleOnClick}>
      <EditIcon style={{margin:0, height:18, width:18}}/></IconButton>
      )
  }
}

export default EditButton;
