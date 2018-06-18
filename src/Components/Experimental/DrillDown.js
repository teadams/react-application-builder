import React from 'react';
//import { Button } from 'material-ui';
import {TextField, Paper, Button, Grid, ListItem, List,  Typography} from '@material-ui/core'
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import axios from 'axios';
import {SelectField, CreateForm, CrudTable} from "../Layouts/index.js";
import {ViewForm} from "./index.js";
 


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
            selected_id: '',
        }  
        this.handleClick = this.handleClick.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);

  }
  

  handleClick = (id, pretty_name) => {
    this.setState ({
        selected_id: id,
        create_object_form: false,
        manage_object_type: ""
    })
  }

   handleDataChange = value => {
     console.log('in create close');
      this.setState({ create_object_form: false});
   };

  componentDidMount() {
      getData (this.props.object_type, "", (drill_data, error) => {
              this.setState({ drill_data: drill_data
      })})
} 


  render()  {
      const object_attributes = meta.object(this.props.object_type);
      const object_fields = meta.fields(this.props.object_type);
      const keys = meta.keys(this.props.object_type);
      //alert ('create about type ' + this.state.create_object_form)
    //  const id = this.state["form_"+meta.keys(this.props.object_type).key_id]
    //  const pretty_name_field = meta.pretty_name_column(this.props.object_type)
      return (
        <Grid container spacing="8" sm={12}>
        <Grid item sm={2}>
        <Paper style={{minHeight:600, padding:10}}>
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
          <Button  style={{marginBottom:10}} variant='outlined' size="small" color ="primary" onClick={()=> {this.setState({create_object_form: this.props.object_type, selected_id:""})}}>
                  Create {object_attributes.pretty_name}
          </Button>
          {this.props.grouping_object_type &&
            <Button  variant='outlined' size="small" color ="primary" onClick={()=> {this.setState({manage_object_type: this.props.grouping_object_type, selected_id:""})}}>
                    Manage {meta.object(this.props.grouping_object_type).pretty_plural}
          </Button>    
          }
          </Paper>
        </Grid >
        <Grid item sm={10}>
        <Paper id = "pretty_key" style={{minHeight:600, padding:10}}>
        {this.state.create_object_form && 
          <CreateForm
              object_type={this.props.object_type}
              object_fields={object_fields}
              object_attributes={object_attributes}
              open="true"
               onClose={this.handleDataChange}
//              id={this.state.form_edit_id}
           />
        }
        {this.state.selected_id && 
            <ViewForm 
                object_type = {this.props.object_type}
                selected_id = {this.state.selected_id}
            />}

        {this.state.manage_object_type && 
          <CrudTable object_type={this.state.manage_object_type}
          object_attributes={meta.object(this.state.manage_object_type)}
          object_fields={meta.fields(this.state.manage_object_type)}
          />
        }

        </Paper>
        </Grid>
      </Grid>


    
     )
   }
}

export default DrillDown;
//export default withStyles(styles)(MenuLink);
