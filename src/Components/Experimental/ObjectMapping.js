import React, { Component, Fragment} from 'react';
import { FormGroup, FormControlLabel, Checkbox, Typography, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper } from '@material-ui/core';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';

import {Field} from "./index.js"
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

class ObjectMapping extends React.Component {
  constructor(props) {
    super(props);           
    // props are:
    // open
    // object_type, 
    // mapping_field_name - name of field that will provide the mapping_object_type and mapping_provided_field
    //     mapping_column is the side of the mapping that is known
    //    In the field meta for mapping_object_type,  there should be 2 fields with map_field:true.  
    //    mapping_provided_field will be one of then. The other will be selected in this UI.
    // mapping_field_value - the id of object_type and also value in mapping_provided_field
    // mapping_field_pretty_name - the pretty name of the known side of the mapping for UIs.
    //        This could be derived, but provided for optimization.

      this.state = {
          other_mapped_data: [],
          mapping_info: {}
    } 

      this.handleClose = this.handleClose.bind(this);
      this.handleCheckChange = this.handleCheckChange.bind(this);
      this.handleAdditionalChange = this.handleAdditionalChange.bind(this);
      this.handleAdditionalSubmit = this.handleAdditionalSubmit.bind(this);
    }

    handleAdditionalChange(id, name, value) {
        // TODO - NED to MAKE Immutable
        let new_state = this.state
        new_state.mapping_info[id][name] = value;
        this.setState(new_state);
    }

    handleAdditionalSubmit(id, name) {
// TODO - think about this?
//      const { object_type, mapping_field_name } = this.props;
//      const mapping_field = meta.field(object_type, mapping_field_name);
//      const mapping_object_type = mapping_field.mapping;
    }

  handleCheckChange = unmapped_field_id => event => {
    const { open, object_type, mapping_field_name, mapping_field_value, mapping_field_pretty_name, ...other } = this.props;
  
    const mapping_field = meta.field(object_type, mapping_field_name);
    const mapping_object_type = mapping_field.mapping;
    const mapped_field_name = mapping_field.mapped_field;
    const unmapped_field = meta.unmapped_field(mapping_object_type, mapped_field_name)
    const other_mapped_table = unmapped_field.references; 

    if (event.target.checked) {
      var data_object = Object();
      data_object[unmapped_field.name] = unmapped_field_id;
      data_object[mapped_field_name] = mapping_field_value;
      const mapping_id_name = [meta.keys(mapping_object_type).key_id]
      //alert ('data object for post is' + JSON.stringify(data_object))
      data.postData(mapping_object_type, data_object, {}, (data, error) => {
            if (error) {
              alert ('error is ' + error.message)
              return
            }
    
            const inserted_id = data.rows[0][meta.keys(mapping_object_type).key_id]
            //alert ("inseted is id " + inserted_id)
            //alert ("unmapped_filed_id is " + unmapped_field_id)
            log.val ('Mapping infor', this.state.mapping_info)
            log.val('this mapping info', this.state.mapping_info[unmapped_field_id])

        this.setState({mapping_info: update(this.state.mapping_info, {[unmapped_field_id]: {$set:{[mapping_id_name]:inserted_id}}})
        });
      })
    } else {
//  alert ('target ' + event.target.id)
        const  mapping_id_field = meta.keys(mapping_object_type).key_id
        let data_object = Object();
        data_object[mapping_id_field] = this.state.mapping_info[unmapped_field_id][mapping_id_field];
        data.deleteData(mapping_object_type, data_object, {}, (result, error) => {
              // todo - change to delete
              this.setState({mapping_info: update(this.state.mapping_info,{
                            $unset: [unmapped_field_id]})
              })
    })}
};

  handleClose(event) {
      this.props.onClose(this.props.mapping_field_name);
  };

  componentDidMount() {

    const { open, object_type, mapping_field_name, mapping_field_value, mapping_field_pretty_name, ...other } = this.props;
    const mapping_field = meta.field(object_type, mapping_field_name);
    const mapping_object_type = mapping_field.mapping;
    const mapped_field_name = mapping_field.mapped_field;
    const unmapped_field = meta.unmapped_field(mapping_object_type, mapped_field_name)
    const other_mapped_table = unmapped_field.references;  
    const key_id = meta.keys(other_mapped_table).key_id;
    var options = {}
    options.key_type = "key_id"

    data.getData (other_mapped_table, options, (other_mapped_data, error) => { 
          if (error) {
              alert ('error retrieving data ' + error.message)
          }
          this.setState({other_mapped_data: other_mapped_data, 
                        load_mapping_info:true})
    }) 
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      const { open, object_type, mapping_field_name, mapping_field_value, mapping_field_pretty_name, ...other } = this.props;
      const mapping_field = meta.field(object_type, mapping_field_name);
      const mapping_object_type = mapping_field.mapping;
      const mapping_key_id = meta.keys(mapping_object_type).key_id;
      const mapped_field_name = mapping_field.mapped_field;

      const unmapped_field = meta.unmapped_field(mapping_object_type, mapped_field_name)
    //  alert ("unmapped field is " + unmapped_field.name)

      if (this.state.other_mapped_data && this.state.load_mapping_info) {
    //    alert ("loading mapping data")
        var options = {}
        options.filter_field = mapped_field_name
        options.filter_id = this.props.mapping_field_value;
        options.key_type = "key_id"

        data.getData (mapping_object_type, options, (results, error) => {
              let mapping_info = {}
              results.map(row =>{
                mapping_info[row[unmapped_field.name]] = row; 
              })  
              this.setState({mapping_info:mapping_info, load_mapping_info:false})
        }) 
      }
  }  


  render () {
    if (!this.state.mapping_info || this.state.mapping_info.length===0) {
        return null
    }
    const { open, object_type, mapping_field_name, mapping_field_value, mapping_field_pretty_name,...other } = this.props;

    const mapping_field = meta.field(object_type, mapping_field_name);
    
    // information about the mapping
    const mapping_object_type = mapping_field.mapping;
    const mapped_field_name = mapping_field.mapped_field;
    const unmapped_field = meta.unmapped_field(mapping_object_type, mapped_field_name)

    let additional_fields = []
    if (mapping_field.mapping_include_additional_fields) {
        additional_fields = meta.mapping_additional_fields(mapping_object_type);
    }

    const other_mapped_table = unmapped_field.references;
    const other_mapped_keys = meta.keys(other_mapped_table)
    const other_mapped_pretty_field = meta.field(other_mapped_table, other_mapped_keys.pretty_key_id)

  //  alert ('other mapped keys is ' +JSON.stringify(other_mapped_keys)
    let grouping_column = ""
    let current_grouping = ""
//alert ('other mapped table is ' + other_mapped_table)
    if (mapping_field.grouping_field_name) {
      grouping_column =  meta.grouping_column_info(other_mapped_table, mapping_field.grouping_field_name)[0]
    } 
  // alert ('grouping column is ' + grouping_column)
    if (!open) {
      return "";
    }
    log.val ("mapping info", this.state.mapping_info)

    return (
      <Dialog open={this.props.open}  onClose={this.handleClose}  aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{mapping_field.pretty_name}: {mapping_field_pretty_name}</DialogTitle>
          <DialogContent>
            <DialogContentText>          </DialogContentText>       
            <Grid container>
          {this.state.other_mapped_data && 
            this.state.other_mapped_data.map(row => {
              let grouping_text = ""
              let id = row[other_mapped_keys.key_id]
              let label = meta.get_display_value(other_mapped_table,other_mapped_pretty_field.name, row)
              log.val('lable, id, mapping_info id', label, id, this.state.mapping_info[id])
              if(grouping_column && row[grouping_column] !== current_grouping) {
                grouping_text = row[grouping_column]
                current_grouping = row[grouping_column] 
              }
              let checkbox_fragment = <Grid item sm={4} style={{paddingTop:10, paddingBottom:10}}>
              <FormControlLabel style={{marginLeft:10}}
                control={
                   <Checkbox
                     checked={this.state.mapping_info[id]?true:false}
                     onChange={this.handleCheckChange(id)}
                     value={this.state.mapping_info[id]?true:false}
                     id = {this.state.mapping_info[id]}
                   />
                 }
                  label={label}
                />
              </Grid>
  
              return (
                <Fragment>
                {grouping_text &&
                  <Grid item sm={12}><br/>
                  <Typography variant="title">{grouping_text}</Typography>
                  </Grid>
                }
                {additional_fields.length == 0 ?
                    checkbox_fragment
                :
                <Grid container>                
                    {checkbox_fragment}
                        {this.state.mapping_info[id] && additional_fields.map(field=> {
                                return(<Grid item sm={4} style={{paddingTop:10, paddingBottom:10}}>
                                    <Field object_type = {mapping_object_type}
                                      field_name = {field.name}  
                                      data_object={this.state.mapping_info[id]}
                                      mode="form"
                                      disableUnderline={true}
                                      id = {this.state.mapping_info[id][meta.keys(mapping_object_type).key_id]}
                                      onChange={this.handleAdditionalChange}
                                      onBlur={this.handleAdditionalSubmit}
                                    />                                   
                                  </Grid>)                        
                        })}
                  </Grid>
                }
              </Fragment>)
            })}        
        </Grid>  
        </DialogContent>
      
            <DialogActions>
                 <Button onClick={this.handleClose} color="primary">
                   Close
                 </Button>
            </DialogActions>
      </Dialog>
   )
  }
}


export default ObjectMapping;
