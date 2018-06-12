import React from 'react';
//import { Button } from 'material-ui';
import {Button, Grid, ListItem, List, Typography} from '@material-ui/core'
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import axios from 'axios';


function getData (object_type, options, callback)   {
  var urltext = '/api/v1/' + object_type;
  axios({
   method: 'get',
   url: urltext,
 }).then(results => {
      callback(results.data,"");
  }).catch(error => {
    log.val('error response', error.response)
    log.val('in catch error', error.message)
    callback('', error);
  })
}


class DrillDown extends React.Component {

  constructor(props) {
        super(props);
        //selected pretty_name is for user experince
        // we can show the pretty name until the rest of the data loads
        this.state = {
            data: [],
            selected_id: '',
            selected_pretty_name: ''
        }  
        this.handleClick = this.handleClick.bind(this);

  }

  handleClick = (id, pretty_name) => {
    this.setState ({
        selected_id: id,
        selected_pretty_name: pretty_name
    })
  }
    
  componentDidMount() {
      getData (this.props.object_type, "", (data, error) => {
              this.setState({ data: data
            })})
} 
  
  render()  {
      const object_attributes = meta.object(this.props.object_type);
      const keys = meta.keys(this.props.object_type);

      return (
        <Grid container sm={12}>
        <Grid item sm={3}>
        <Typography variant="headline" gutterBottom>
            {object_attributes.pretty_plural} 
        </Typography>
          <List component="nav">
          {this.state.data && this.state.data.map(row => {
            return (
            <ListItem dense button onClick={() => this.handleClick(row[keys.key_id], row[keys.pretty_key_id])}>
                {(row[keys.key_id] === this.state.selected_id) ?
                    <Typography color='primary' variant='headline'> {row[keys.pretty_key_id]}</Typography>
                  : row[keys.pretty_key_id]
                }
            </ListItem> )
          })}

          </List>
        </Grid>
        <Grid sm={9}>
          <Typography variant="headline" gutterBottom>
              {this.state.selected_pretty_name} 
          </Typography>
          {this.state.selected_id}
        </Grid>
      </Grid>
    
     )
   }
}

export default DrillDown;
//export default withStyles(styles)(MenuLink);
