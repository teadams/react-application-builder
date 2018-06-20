import React, { Component, Fragment} from 'react';

//import React from 'react';
//import { Button } from 'material-ui';
import {TextField, Paper, Button, Grid, ListItem, List,  Typography} from '@material-ui/core'
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import {SelectField, CreateForm, CrudTable} from "../Layouts/index.js";
import {ViewForm} from "./index.js";
 

class DrillDown extends React.Component {

  constructor(props) {
        super(props);
        this.state = {
            drill_data: [],
            selected_id: '',
            create_object_form: false,
            manage_object_type: ""
        }  
        this.handleClick = this.handleClick.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.loadDrill = this.loadDrill.bind(this);
  }
  
  handleClick = (id, pretty_name) => {
    this.setState ({
        selected_id: id,
        create_object_form: false,
        manage_object_type: ""
    })
  }
  // TODO - NAME?
   handleDataChange = value => {
    //  alert ("in drill data change")
      this.setState({ create_object_form: false, refresh_drill: true});
   };
  
  loadDrill()  {
    const grouping_field_name = this.props.grouping_field_name
    var options = {}
    if (grouping_field_name) {
      //  alert ('creating order by')
        const grouping_field = meta.field(this.props.object_type, grouping_field_name)
        if (grouping_field.references) {
          const grouping_object_type = grouping_field.references
          const grouping_keys = meta.keys(grouping_object_type)
      //    alert ('groupting object type and keys' + grouping_object_type + ' ' + JSON.stringify(grouping_keys))
          const order_by = grouping_object_type+'_'+grouping_keys.pretty_key_id
    //      alert ('order by is ' + JSON.stringify(order_by))
          options.order_by = order_by
        } else {
          options.order_by = this.props.object_type + "." +grouping_field_name
        }
   }

    data.getData (this.props.object_type, options, (drill_data, error) => {
            this.setState({ drill_data: drill_data, refresh_drill: false
    })})
  }

  componentDidMount() {
      this.loadDrill();
  } 

  componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.state.refresh_drill) {
        this.loadDrill();
      }
  }

  render()  {
      const object_attributes = meta.object(this.props.object_type);
      const object_fields = meta.fields(this.props.object_type);
      const keys = meta.keys(this.props.object_type);
    //  alert ("groping field is " + this.props.grouping_field_name)
      const grouping_field_name = this.props.grouping_field_name;
      var grouping_column = ""
      var current_grouping = ""
      var grouping_object_type = ""
    //  alert ('before render')
      if (grouping_field_name) {
          grouping_column =  meta.grouping_column(this.props.object_type, grouping_field_name)
      }
      //alert ('grouping column is ' + grouping_column)
//      alert (JSON.stringify(meta.section_fields (this.props.object_type,"")))

      return (
        <Grid container spacing="8" sm={12}>
        <Grid item sm={2}>
          <Paper style={{minHeight:600, padding:10}}>
            <Typography variant="headline" gutterBottom>
              {object_attributes.pretty_plural} 
            </Typography>
            <List component="nav">
              {this.state.drill_data && this.state.drill_data.map(row => {    
                if (grouping_field_name) { 
                  if (current_grouping != row[grouping_column].toString()) {
                      current_grouping = row[grouping_column].toString()
                      return(<Fragment>
                            <Typography style={{marginLeft:10}} align="left" variant="title">{ row[grouping_column].toString()}</Typography>
                            <ListItem dense button onClick={() => this.handleClick(row[keys.key_id], row[keys.pretty_key_id])}>
                              {(row[keys.key_id] === this.state.selected_id) ?
                                <Typography color='primary' variant='title'>{row[keys.pretty_key_id]} </Typography>
                                : <Typography variant="body2">{row[keys.pretty_key_id]}</Typography>
                              }
                              </ListItem>
                             </Fragment>
                            )
                  } else {
                    return(<ListItem dense button onClick={() => this.handleClick(row[keys.key_id], row[keys.pretty_key_id])}> 
                      {(row[keys.key_id] === this.state.selected_id) ?
                        <Typography color='primary' variant='title'>{row[keys.pretty_key_id]} </Typography>
                        : <Typography variant="body2">{row[keys.pretty_key_id]}</Typography>
                      }
                      </ListItem>)
                  }
                } else {
                  return (
                  <ListItem dense button onClick={() => this.handleClick(row[keys.key_id], row[keys.pretty_key_id])}>
                    {(row[keys.key_id] === this.state.selected_id) ?
                      <Typography color='primary' variant='headline'>{row["service_category_name"]} </Typography>
                      : <Typography>{row[keys.pretty_key_id]}</Typography>
                    }
                    </ListItem> )
                }
              })}
            </List>
            <Button  style={{marginBottom:10}} variant='outlined' size="small" color ="primary" onClick={()=> {this.setState({create_object_form: this.props.object_type, selected_id:""})}}>
                    Create {object_attributes.pretty_name}
            </Button>
            {grouping_object_type &&
              <Button  variant='outlined' size="small" color ="primary" onClick={()=> {this.setState({manage_object_type: grouping_object_type, selected_id:""})}}>
                      Manage   {meta.object(grouping_object_type).pretty_plural}
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
             />
            }
            {this.state.selected_id && 
              <ViewForm 
                  object_type = {this.props.object_type}
                  selected_id = {this.state.selected_id}
                  grouping_field_name = {this.props.grouping_field_name}
                  onDataChange = {this.handleDataChange}
              />}
            {this.state.manage_object_type && 
              <CrudTable object_type={this.state.manage_object_type}
              object_attributes={meta.object(this.state.manage_object_type)}
              object_fields={meta.fields(this.state.manage_object_type)}
              onDataChange= {this.handleDataChange}

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
