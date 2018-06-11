import React from 'react';
import { IconButton} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import * as log from '../../Utils/log.js'


class DeleteButton extends React.Component {

  constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick = event => {
//    alert ('deled is ' + JSON.stringify(this.props))
    var deleted = [];
    deleted.push(this.props.index);
    this.props.onClick(deleted);
  }

  render() {
      return (
      <IconButton size="small"  style={{margin:0, height:'50%', width:'50%'}} onClick={this.handleOnClick}>
      <DeleteIcon style={{margin:0, height:18, width:18}}  /></IconButton>
      )
  }
}

export default DeleteButton;
