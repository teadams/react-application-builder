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

class MenuLink extends React.Component {

  constructor(props) {
        super(props);  
        this.handleClick = this.handleClick.bind(this);
  }

  handleClick = event => {
      log.func("link handle click","link_menu_index, filter_id, menu link field, link_object_type, menu_link_reference_field", 
        this.props.link_menu_index, this.props.filter_id, this.props.menu_link_field, this.props.link_object_type, this.props.menu_link_reference_field)
      this.props.onClick(event, this.props.link_menu_index, this.props.filter_id, this.props.menu_link_field, this.props.link_object_type, this.props.menu_link_reference_field)
  }
    
  render()  {
//      const { classes } = this.props;
      return <Button style={{margin:0, padding:3, fontSize:10}} variant="outlined" color="primary" size="small" onClick={this.handleClick}>{this.props.text}</Button>                 
   }
}

export default MenuLink;
//export default withStyles(styles)(MenuLink);
