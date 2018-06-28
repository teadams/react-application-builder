import React from 'react';
import {  Grid, Paper, Typography, Divider, MenuItem, TextField, Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button } from '@material-ui/core';
import {SelectField} from "./index.js";
import axios from 'axios';
import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import update from 'immutability-helper';
import {MappingForm, Field} from "../Experimental/index.js"


class CreateForm extends React.Component {

  constructor(props) {
        super(props);           
        this.state = {
          formTouched: false,
          action: this.props.id?'Edit':'Create'
        }
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderField = this.renderField.bind(this);
  
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    log.func("Create Form: Derived State from Props", "nextProps",nextProps);
    const object_fields = meta.fields(nextProps.object_type)

    if (nextProps.object_type && nextProps.object_type != prevState.props_object_type) {
      var formValues = {};

      object_fields.map(field => {
          if (!field.key ) {
            if (field.name == nextProps.filter_field) {
              formValues[field.name] = nextProps.filter_id
            } else if (field.default) {
              formValues[field.name] = field.default
            } else {
              formValues[field.name] = ""
            }
          }
      })

      return {
        props_object_type : nextProps.object_type,
        action: nextProps.id?'Edit':'Create',
        formValues: formValues
      };
    } else {
      return null
    }
  }


  handleChange (field_name, value)  {
      this.setState({ formTouched:true, formValues: update(this.state.formValues,{
                  [field_name]: {$set: value}
                  }) });
  }

  handleSubmit(event) {
      if (this.state.formTouched) {
        if (!this.props.id) {
          data.postData(this.props.object_type, this.state.formValues, {}, (data, error) => { 
            if (error) {
                  alert ('error is ' + error.message)
            } else {
              var inserted_id = data.rows[0][meta.keys(this.props.object_type).key_id]  
              this.handleClose(event,'created', inserted_id);
            }
          })
        } else {
          data.putData(this.props.object_type, this.state.formValues, {}, (result, error) => { 
            if (error) {
                  alert ('error is ' + error.message)
            } else { 
              this.handleClose(event,'edited');
            }
          })
        }
      } else {
          this.handleClose(event);
      }
    }

  handleClose(event, action_text, inserted_id) {
    const object_fields = meta.fields(this.props.object_type)
    this.setState({ formValues: {}, formTouched:true})
    this.props.onClose(action_text?`${meta.object(this.props.object_type).pretty_name}  ` +action_text:'', inserted_id);
  };

  componentDidMount() {
    const object_fields = meta.fields(this.props.object_type)
    if (this.props.id) {
      data.getData (this.props.object_type, {id:this.props.id}, (item_data, error) => { 
              this.setState({ formValues: item_data, formTouched:true})
      })   
    }
  }


 componentDidUpdate(prevProps, prevState, snapshot) {
   const object_fields = meta.fields(this.props.object_type)
   if (this.props.id && !this.state.formTouched) {
     data.getData (this.props.object_type, {id:this.props.id}, (item_data, error) => { 
             this.setState({ formValues: item_data, formTouched:true})
     })  
   }
 }

  renderField(field) {
    return (
      <Field object_type = {this.props.object_type} 
        field_name = {field.name}  
        data_object={this.state.formValues}
        mode="form_element"
        disableUnderline={false}
        onChange={this.handleChange}
        id = {this.props.id}
      /> 
      )

//   if (!field.key && !field.menu_link && !field.derived) {
//       log.val('create form field', field);
  //    var dependent_value = ''
  //    if (field.dependent_field) {
  //        dependent_value = this.state.formValues[field.dependent_field]
//    }
//  open={this.props.open}

  }

  render() {
    const { onClose, object_type, open} = this.props;    
    const object_fields = meta.fields(object_type)
    if (!this.props.open) {
      return null;
    }

   const sections =this.props.sections?meta.sections(this.props.object_type,this.props.sections):meta.sections(this.props.object_type);
    const flex_direction= sections?"column":"row"


    return (
      <Dialog open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{this.state.action} {meta.object(object_type).pretty_name}</DialogTitle>
          <DialogContent>
            <DialogContentText>{meta.object(object_type).create_form_message}</DialogContentText>
              <form onSubmit={this.handleSubmit}>
              {sections && sections.map(section => {
                var section_fields = meta.section_fields(this.props.object_type, section.name)
                if (section_fields.length > 0) {
                  var field_render = (section_fields.map(field=>{
                        let grid_col = field.grid_col?field.grid_col:4
                        if (!field.key) { 
                          return (<Grid key={field.name} item style={{padding:10, boxBorder:"border-box"}} sm={grid_col}>
                                    {this.renderField(field)}
                                  </Grid>)
                        }
                  }))
                  return (
                     <Grid item style={{padding:10}} sm={12}>
                         <Paper style={{boxSizing:"border-box", padding:10, height:"100%"}}>
                           <Typography variant="title" > {section.title} </Typography>
                             <Divider style={{marginBottom:10}}/>
                           <Grid container >
                           {field_render}
                           </Grid>
                         </Paper>
                     </Grid>)
                } else {
                    return ""
                }
                })}
                {!sections && object_fields.map(field => {
                  let grid_col = field.grid_col?field.grid_col:4
                    if (!field.key) { 
                      return (<Grid key={field.name} item style={{padding:10, boxBorder:"border-box"}} sm={grid_col}>
                              {this.renderField(field)}
                            </Grid>)
                    }
                })}
              </form>
            </DialogContent>
            <DialogActions>
                 <Button onClick={this.handleSubmit} color="primary">
                   {this.state.action}
                 </Button>
                 <Button onClick={this.handleClose} color="primary">
                   Cancel
                 </Button>
            </DialogActions>
          </Dialog>
   );
  }
}

export default CreateForm;
