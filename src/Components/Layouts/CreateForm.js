import React from 'react';
import {  Grid, Paper, Typography, Divider, MenuItem, TextField, Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button } from '@material-ui/core';
import {SelectField} from "./index.js";
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';


class CreateForm extends React.Component {

  constructor(props) {
      log.func("create form constructor");
        super(props);           
      //  alert('this props id is '+ this.props.id)
        //props
        // object_type - type of object 
        // section - limit to sections in the form
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
//    log.val('next object name, prev object name', nextProps.object_type, prevState.props_object_type)
    if (nextProps.object_type && nextProps.object_type != prevState.props_object_type) {
      log.log('changing state formValue')
      var formValues = {};

      nextProps.object_fields.map(field => {
  
          if (!field.key ) {
            if (field.name == nextProps.filter_field) {
              log.func("Passed in filter id","field, filter_field, filter_id", field, nextProps.filter_field, nextProps.filter_id)
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
//      alert('handle change in form ' +name + ' value' + event.target.value)
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      this.state.formTouched = true;
      var temp_form_values = this.state.formValues;
      temp_form_values[name] = value;
      log.func("Form Handle Change", "form values", temp_form_values);
      this.setState({ formValues: temp_form_values });
  }

  handleSubmit(event) {
      if (this.state.formTouched) {
        event.preventDefault();
        var data_object = Object();
        var data_object = this.state.formValues;
        console.log ('form to send db ' + JSON.stringify(data_object));

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
    var formValues = {};
    this.props.object_fields.map(field => {
        if (!field.key) {
          formValues[field.name] = ""
        }
    })
//    this.setState({formTouched:false, formValues:formValues, id:''});
    // this will change once we change the form to use the context
    this.props.onClose(action_text?`${this.props.object_attributes.pretty_name}  ` +action_text:'', inserted_id);

  };

  componentDidMount() {
    log.func("CreateForm: DidMount", "props", this.props)
    if (this.props.id) {
      //TODO - Consolodate the db call
       var urltext = '/api/v1/' + this.props.object_type + '/'+ this.props.id;
       log.val("url text", urltext);
       axios({
        method: 'get',
        url: urltext,
      }).then(results => {
        log.val('results, data', results, results.data)
        var result_row = results.data;
        log.val("result_row", result_row);
        var formValues = {};
        this.props.object_fields.map(field => {
            if (!field.key) {
              formValues[field.name] = result_row[field.name];
            }
        })
          log.func("Create form Setting state with form values", "formvalue", formValues)
         this.setState({ formValues: formValues, formTouched:true})
      });  
    }
  }


 componentDidUpdate(prevProps, prevState, snapshot) {
   log.func("CreateForm: DidUpdate", "props id", this.props.id)
   if (this.props.id && !this.state.formTouched) {
      var urltext = '/api/v1/' + this.props.object_type + '/'+ this.props.id;
      log.val("url text", urltext);
      axios({
       method: 'get',
       url: urltext,
     }).then(results => {
       var result_row = results.data;
       var formValues = {};
       this.props.object_fields.map(field => {
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
    const { onClose, object_type, object_fields, object_attributes, ...other } = this.props;

   const sections =this.props.sections?meta.sections(this.props.object_type,this.props.sections):meta.sections(this.props.object_type);
//  const sections = meta.sections(this.props.object_type)
//    alert ('sections is ' + JSON.stringify( sections))
    const flex_direction= sections?"column":"row"

    log.func("Create form: render","open", this.props.open);
    if (!this.props.open) {
      return "";
    }
//    log.val("rendering form, disabled id", disabled)
    return (
      <Dialog open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{this.state.action} {object_attributes.pretty_name}</DialogTitle>
          <DialogContent>
            <DialogContentText>{object_attributes.create_form_message}</DialogContentText>
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
//                    alert ('in the else')
                  return (this.renderField(field))
//                      return "text"
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
