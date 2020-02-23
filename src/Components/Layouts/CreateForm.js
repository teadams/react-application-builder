import React, {  Fragment} from 'react';
import {  Grid, Paper, Typography, Divider, MenuItem, TextField, Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button } from '@material-ui/core';
import {SelectField} from "./index.js";
import axios from 'axios';
import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import update from 'immutability-helper';
import {MappingForm, Field} from "../Experimental/index.js"
import {AuthContext, LoginForm} from '../index.js';


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
    // function is to clear the form when
    // we are looking at a new object type or object
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
        //  alert ('form touched')
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
    this.props.onClose(action_text?`${meta.object(this.props.object_type).pretty_name}  ${action_text}`:'', inserted_id);
  };

  initializeData() {
    if (this.props.id) {
      // editing an ojbect
      data.getData (this.props.object_type, {id:this.props.id}, (item_data, error) => { 
            this.setState({ formValues: item_data, formTouched:true})
      })   
    } else if (this.context.user) {
      // if we are in create mode, the field
      // references a user, and the user is logged in
      // prefill with the current user
      const object_fields = meta.fields(this.props.object_type)
      object_fields.map(field => {
          if (field.references == "nwn_user" && field.use_context) {
            ///alert ("fild name " + field.name)
            this.setState({ formTouched:true, formValues: update(this.state.formValues,{
                        [field.name]: {$set: this.context.user.id}
                        }) });
          }
      });   
    }
  }
  componentDidMount() {
    //const object_fields = meta.fields(this.props.object_type)
    this.initializeData();
  }

 componentDidUpdate(prevProps, prevState, snapshot) {
   //const object_fields = meta.fields(this.props.object_type)
   if (!this.state.formTouched) {
     // this is a change other than a change to the form
     // For example a new object_type
      this.initializeData();
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
  }

  render() {

    const { onClose, object_type, open} = this.props;    
    const object_fields = meta.fields(object_type)
    if (!this.props.open) {
      return null;
    }
  // By default, show all sections
  //  If there are specific sections in the props, show those
   const sections =this.props.sections?meta.sections(this.props.object_type,this.props.sections):meta.sections(this.props.object_type);
    
  const flex_direction= sections?"column":"row"
  
   // used to determine the size of the dialog.
  // gridCol_scale will be used to show less fields per row in smaller dialogs
   const section_longest_length = meta.section_longest_length(this.props.object_type, this.props.sections,"form")
   const maxWidth = (section_longest_length > 4 || (sections && sections.length>2))?'md':'sm'
   const gridCol_scale = (maxWidth == 'sm')?3:1

    // Authorization
    // See if the user is allowed to create this object_type 

    //alert ("object type and context "  + JSON.stringify(meta.object(object_type)) + " " + JSON.stringify(this.context.user))
    // for now, just User is implemented
    // Later this will expand to include SiteAdmin priv
    if (meta.object(object_type).create_priv  && !this.context.user) {
        return (<Fragment>
              <LoginForm open="true" />
              </Fragment>)
    } else {
      return (
      <Dialog fullWidth={true} maxWidth={maxWidth} open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{this.state.action} {meta.object(object_type).pretty_name}</DialogTitle>
          <DialogContent>
            <DialogContentText>{meta.object(object_type).create_form_message}</DialogContentText>
              <form onSubmit={this.handleSubmit}>
              {sections && sections.map(section => {
                let section_fields = meta.section_fields(this.props.object_type, section.name, "form")
                if (section_fields.length > 0) {
                  var field_render = (section_fields.map(field=>{
                        let grid_col = field.grid_col?field.grid_col:4
                        grid_col = grid_col * gridCol_scale
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
                {!sections && 
                  <Grid container>
                  {meta.section_fields(this.props.object_type, "", "form").map(field => {
                    let grid_col = field.grid_col?field.grid_col:4
                    grid_col = grid_col * gridCol_scale
                    if (!field.key) { 
                      return (<Grid key={field.name} item style={{padding:10, boxBorder:"border-box"}} sm={grid_col}>
                              {this.renderField(field)}
                            </Grid>)
                    }})}
                    </Grid>
                  }
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
}

CreateForm.contextType = AuthContext;
export default CreateForm;
