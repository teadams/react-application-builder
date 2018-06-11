import React from 'react';
//import { Button } from 'material-ui';
import {Button} from '@material-ui/core'
import * as log from '../../Utils/log.js'
//import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

class NavMenuLink extends React.Component {

  constructor(props) {
        super(props);  
        this.handleClick = this.handleClick.bind(this);
  }

  handleClick = event => {
      log.func("link handle click","link_menu_index, filter_id, menu link field, link_object_type, menu_link_reference_field", 
        this.props.link_menu_index, this.props.filter_id, this.props.menu_link_field, this.props.link_object_type, this.props.menu_link_reference_field)
      this.props.onClick(event, this.props.index)
  }
    
  render()  {
//      const { classes } = this.props;
      return <Button style={{textAlign:'left', padding:3, minWidth:0, minHeight:0, textTransform:'none'}} onClick={this.handleClick}>{this.props.text}</Button>                 
   }
}

export default NavMenuLink;
//export default withStyles(styles)(MenuLink);
