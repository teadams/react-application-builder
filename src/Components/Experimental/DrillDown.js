import React from 'react';
//import { Button } from 'material-ui';
import {Button, Grid} from '@material-ui/core'
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';

class DrillDown extends React.Component {

  constructor(props) {
        super(props);  
  }

  handleClick = event => {
  }
    
  render()  {
      const object_attributes = meta.object(this.props.object_type);
      return <Grid container sm={12}>
        <Grid item sm={3}>
          {object_attributes.pretty_plural}
        </Grid>
        <Grid sm={9}>
          RIGHT
        </Grid>
      </Grid>
   }
}

export default DrillDown;
//export default withStyles(styles)(MenuLink);
