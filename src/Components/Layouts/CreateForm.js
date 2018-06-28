import React from 'react';
import {  Grid, Paper, Typography, Divider, MenuItem, TextField, Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button } from '@material-ui/core';
import {SelectField} from "./index.js";
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';

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
    }
    return null
  }


  handleChange = name => event => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      this.state.formTouched = true;
      var temp_form_values = this.state.formValues;
      temp_form_values[name] = value;
      this.setState({ formValues: temp_form_values });
  }

  handleSubmit(event) {
      if (this.state.formTouched) {
        event.preventDefault();
        var data_object = Object();
        var data_object = this.state.formValues;
        if (!this.props.id) {
          var urltext = '/api/v1/' + this.props.object_type;
          axios({
            method: 'post',
            url: urltext,
            data: { data_object }
          }).then (result => {
              var inserted_id = result.data.rows[0][meta.keys(this.props.object_type).key_id]  
              this.handleClose(event,'created', inserted_id);
          });
        } else {
          var urltext = '/api/v1/' + this.props.object_type + '/' +this.props.id;
          axios({
            method: 'put',
            url: urltext,
            data: { data_object }
          }).then (result => {
              this.handleClose(event,'edited');
          });
        }
      } else {
          this.handleClose(event);
      }
    }

  handleClose(event, action_text, inserted_id) {
    const object_fields = meta.fields(this.props.object_type)
    var formValues = {};
    object_fields.map(field => {
        if (!field.key) {
          formValues[field.name] = ""
        }
    })
    this.props.onClose(action_text?`${meta.object(this.props.object_type).pretty_name}  ` +action_text:'', inserted_id);

  };

  componentDidMount() {
    const object_fields = meta.fields(this.props.object_type)

    if (this.props.id) {
       var urltext = '/api/v1/' + this.props.object_type + '/'+ this.props.id;
       axios({
        method: 'get',
        url: urltext,
      }).then(results => {
        var result_row = results.data;
        var formValues = {};
        object_fields.map(field => {
            if (!field.key) {
              formValues[field.name] = result_row[field.name];
            }
        })
         this.setState({ formValues: formValues, formTouched:true})
      });  
    }
  }


 componentDidUpdate(prevProps, prevState, snapshot) {
   log.func("CreateForm: DidUpdate", "props id", this.props.id)
   const object_fields = meta.fields(this.props.object_type)
   if (this.props.id && !this.state.formTouched) {
      var urltext = '/api/v1/' + this.props.object_type + '/'+ this.props.id;
      log.val("url text", urltext);
      axios({
       method: 'get',
       url: urltext,
     }).then(results => {
       var result_row = results.data;
       var formValues = {};
       object_fields.map(field => {
           if (!field.key) {
             formValues[field.name] = result_row[field.name];
           }
    
       })
        this.setState({ formValues: formValues, formTouched:true})
     });  
   }
 }

  renderField(field) {
      var disabled=false;
    // diable field
    // 1. if we are editing, but not allowed to edit 
    // 2. if we are creating and the field is not in the db
    if ( (field.prevent_edit && this.props.id) || 
      (field.not_in_db)
    ) {
      disabled = true
    }
    log.val("field, disabled", field.name, disabled)
   if (!field.key && !field.menu_link && !field.derived) {
//       log.val('create form field', field);
      var dependent_value = ''
      if (field.dependent_field) {
          dependent_value = this.state.formValues[field.dependent_field]
      }
      if (field.valid_values || field.references || field.data_type === "boolean" || (field.data_type === "integer" && field.input_type !== "text" || field.input_type === "color_picker")) {

        return <SelectField 
        key={field.name}           
        object_type={field.references}
        valid_values={field.valid_values}
        field={field}
        disabled = {disabled}
        form_object_type={this.props.object_type}
        dependent_value = {dependent_value}
        label={field.pretty_name}
        value={this.state.formValues[field.name]}
        open={this.props.open}
        onChange={this.handleChange(field.name)}
        style={{width:200, marginRight:20, marginBottom:20}}
        />
     } else {
    //  console.log('form values is ' + JSON.stringify(this.state.formValues));
    //   console.log('value of' +field.name)
    //   console.log(this.state.formValues[field.name]);
       return <TextField          
         id={field.name}
         key={field.name}
         label={field.pretty_name}
         type="text"
         disabled = {disabled}
         value={this.state.formValues[field.name]}
//                       value={this.state.formValues?this.state.formValues[field.name]:""}
         style={{width:200, marginRight:20, marginBottom:20}}
         onChange={this.handleChange(field.name)}
        />
     }
    }
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
              <form  noValidate autoComplete="off">
              {sections && sections.map(section => {
                var section_fields = meta.section_fields(this.props.object_type, section.name)
                if (section_fields.length > 0) {
                  var field_render = (section_fields.map(field=>{
                        return (this.renderField(field))
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
                  return (this.renderField(field))
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
