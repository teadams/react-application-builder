import React from 'react';
//import { Button } from 'material-ui';
import {Button, Grid, ListItem, List, Typography} from '@material-ui/core'
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import axios from 'axios';


function getData (object_type, options, callback)   {
  var urltext = '/api/v1/' + object_type;
  if (options.id) {
    urltext += '/'+options.id
  }
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
            drill_data: [],
            item_data: "",
            selected_id: ''
        }  
        this.handleClick = this.handleClick.bind(this);

  }

  handleClick = (id, pretty_name) => {
    this.setState ({
        selected_id: id
    })
  }
    
  componentDidMount() {
      getData (this.props.object_type, "", (drill_data, error) => {
              this.setState({ drill_data: drill_data
            })})
} 

  componentDidUpdate(prevProps, prevState, snapshot) {
    //alert('did i update')
      if (prevState.selected_id !== this.state.selected_id) {

        getData (this.props.object_type, {id:this.state.selected_id}, (item_data, error) => { 
  //    alert('updated' + JSON.stringify(item_data) ); 
                this.setState({ item_data: item_data
              })}) 
      }
  }  


  render()  {
      const object_attributes = meta.object(this.props.object_type);
      const object_fields = meta.fields(this.props.object_type);
      const keys = meta.keys(this.props.object_type);
      //alert ('fields' + JSON.stringify(object_fields));
    //  alert ('item data is ' + JSON.stringify(this.state.item_data))

//      alert ('item data is ' + JSON.stringify(this.state.item_data.length))
      return (
        <Grid container sm={12}>
        <Grid item sm={2}>
        <Typography variant="headline" gutterBottom>
            {object_attributes.pretty_plural} 
        </Typography>
          <List component="nav">
          {this.state.drill_data && this.state.drill_data.map(row => {    
          return (
            <ListItem dense button onClick={() => this.handleClick(row[keys.key_id], row[keys.pretty_key_id])}>
                {(row[keys.key_id] === this.state.selected_id) ?
                    <Typography color='primary' variant='headline'> {row[keys.pretty_key_id]}</Typography>
                  : row[keys.pretty_key_id]
                }
            </ListItem> )
          })}

          </List>
        </Grid >
        <Grid sm={10}>
          <Typography variant="headline" gutterBottom>
              {this.state.item_data[keys.pretty_key_id]} 
          </Typography>
        
          <Grid container  sm={12} >
            {this.state.item_data && object_fields.map(field => {
                if (field.name != keys.key_id && field.name != keys.pretty_key_id) {
              //    alert('item keys field and row ' + JSON.stringify(keys) + '   ' +JSON.stringify(field) + ' ' + JSON.stringify(this.state.item_data))
                  return (<Grid item sm={6}>
                    <List component="nav">
                      <ListItem dense button>
                      {field.pretty_name} : {this.state.item_data[field.name]}
                        </ListItem>
                    </List>
                    </Grid>
                      )  
                }  
              })}
            </Grid>
        </Grid>
      </Grid>
    
     )
   }
}

export default DrillDown;
//export default withStyles(styles)(MenuLink);
