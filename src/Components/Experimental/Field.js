import React, { Component, Fragment} from 'react';
import {Chip, TextField, Paper, Button, Grid, ListItem, List,  Typography} from '@material-ui/core'

import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';

import update from 'immutability-helper';

import {SelectField, EditButton} from "../Layouts/index.js";

class Field extends React.Component {

  constructor(props) {
        super(props)
      //props 
      // object_type
      // field_name
      // data_object - object containing data set. Used to determine value, derived, and dependent fields
      // mode 
            // text - text only
            // form - full form, this component will call server to update. Used for ObjectView
            // view_click_form - initial view is text, then on click changes to form. used    
            //     for pretty_name field on ObjectView.  Potentially use for table cells
            // form_element - one form element (no form tags)- this component will not call server to update. Used for ObjectCreate
      // id - the value for the the key from this row (not required for view mode)
      //      in theory, this could be derived from data_object. However, I don't want to allow data object to only
      //      contain the field (for example, for filter fields)

      this.state = {
        value_changed: false
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit  = this.handleSubmit.bind(this);
      this.handleClick = this.handleClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
      if (nextState !== this.state) {
        return true;
      } else if (nextProps.object_type !== this.props.object_type) {
        return true;
      } else if (nextProps.field_name != this.props.field_name) {
        return true;
      } else if (nextProps.data_object[this.props.field_name] !== this.props.data_object[this.props.field_name]) {
        return true;
      } else if (meta.field(nextProps.object_type, nextProps.field_name).derived ||
        meta.field(nextProps.object_type, nextProps.field_name).dependent_field) {
        // a derived field may be influence by changes in other fields in data_object
        return true;
      } else {
        return false
      }
  }

  componentDidMount() {
    const { object_type, field_name} = this.props;
    const field = meta.field(object_type,field_name);
    this.setState({value: this.props.data_object[field_name]})
  } 

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { object_type, field_name, data_object, id } = this.props;
    const field = meta.field(object_type,field_name);
      if (prevProps.id !== id || 
          prevProps.object_type !== object_type || prevProps.data_object[field_name] !== this.props.data_object[field_name]) {
              this.setState({value: this.props.data_object[field_name]})
      }
  }  

  handleChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      this.setState({value:value, value_changed:true});
      this.props.onChange(this.props.field_name, value);
  }

  handleSubmit(event) {

    const { object_type, field_name, mode, id, data_object } = this.props;
    const field = meta.field(object_type,field_name);
      if (mode !== "form" && !this.state.form ) {
          return null
      }
      event.preventDefault();
      if (this.state.value_changed) {
        var update_object = Object();
        update_object[field_name] = this.state.value;
        update_object.id = id?id:data_object[meta.keys(object_type).key_id]
        data.putData(object_type, update_object, {}, (mapped_data, error) => { 
          if (error) {
                alert ('error is ' + error.message)
          } else {
            this.setState({value_changed:false, form:false})
            if (this.props.onSubmit) {
              this.props.onSubmit(this.props.field_name)
            }
          }
        })
      } else {
          this.setState({form:false})
      }
  }

  getDisplayView() {
    const { object_type, field_name, data_object } = this.props;
    const field = meta.field(object_type,field_name);
    //alert ("data object is " +JSON.stringify(this.props.data_object))
    if (Object.keys(data_object).length == 0) {
      return null
    } else if (!field.mapping) {
      return(meta.get_display_value(object_type, field_name, data_object))
    } else if (!this.state.value) {
        // mapping data is not loaded yet
        return null
    } else {
      const unmapped_field = meta.unmapped_field(field.mapping, field.mapped_field)
      return (this.state.value.map(row=>{
        let chip_label = meta.get_display_value(field.mapping,unmapped_field.name, row)
        return (
            <Chip style={{marginRight:10}} label={chip_label}/>
        )
      }))
    }
  }

  renderDerived(options) {
    const { object_type, field_name, data_object } = this.props;
    const field = meta.field(object_type,field_name);
    return( <TextField    
      InputLabelProps={{shrink:true}}
      name={field.name}
      label={field.pretty_name}
      disabled={true}
      type="text"
      helperText={field.helper_text}
      value=  {this.getDisplayView()}
     style={{width:"90%"}}
    />)
  }

  renderMapping(options) {
    const disabled = options.disabled?options.disabled:false
    const { object_type, field_name, data_object } = this.props;
    const field = meta.field(object_type,field_name);
    return (
      <Fragment>
        <Typography style={{padding:0, border:0}}>{field.pretty_name} 
          <EditButton  size="small" onClick={()=>{this.props.onMappingClick(field.name)}} value={field.name}/>
        </Typography>
        {this.getDisplayView()}
      </Fragment>
    )
  }

 renderSelectField(options) {
    const disabled = options.disabled?options.disabled:false
    const disableUnderline = options.disableUnderline?options.disableUnderline:false
    const { object_type, field_name, data_object } = this.props;
    const field = meta.field(object_type,field_name);
    return(
// pass in object type of form, dependent value
// Post in object_type and FIeld... not all the details
    <SelectField 
      key={field.name}    
        disabled={disabled}
        object_type={field.references}
        valid_values={field.valid_values}
        shrink="true"
        field={field}
        disableUnderline = {disableUnderline}
        helperText={field.helper_text}
        form_object_type={this.props.object_type}
        label={field.pretty_name}
        value= {this.state.value}
        open="true"
        onBlur={this.handleSubmit}
        onChange={this.handleChange}
        style={{width:"100%"}}
      /> )
  }


  renderTextField(options) {
    const disabled = options.disabled?options.disabled:false
    const disableUnderline = options.disableUnderline?options.disableUnderline:false
    const { object_type, field_name, data_object } = this.props;
    const field = meta.field(object_type,field_name);
    const multiline = (field.size=="large")?true:false
    return (
      <TextField    
        InputLabelProps={{shrink:true}}
        id = {data_object[meta.keys(object_type,field_name).key_id + '+' + field_name]}
        autoFocus = {(this.props.mode=="view_click_form")?true:false}
        name={field.name}
        label={field.pretty_name}
        disabled={disabled}
        InputProps = {{disableUnderline:disableUnderline}}
        type="text"
        multiline={multiline}
        helperText={field.helper_text}
        value=  {this.state.value}
        onChange={this.handleChange}
        onBlur={this.handleSubmit}
        style={{width:"100%"}}
    />)
  }

  renderField() {
      const { object_type, field_name, data_object, disableUnderline } = this.props;
      const field = meta.field(object_type,field_name);
      let disabled = false;
      if (field.dependent_field) {
        if (!this.props.data_object[field.dependent_field]) {
               disabled = true;
            if (field.dependent_action ===  "visible") {
                return null
              }
        }
      } 

      if (field.derived) {
        return(this.renderDerived({disabled:disabled, disableUnderline:disableUnderline}))
      }  else if (field.mapping) { 
        return(this.renderMapping({disabled:disabled, disableUnderline:disableUnderline}))
      } else if ( field.valid_values || field.references || field.data_type === "boolean" || (field.data_type === "integer" && field.input_type !== "" || field.input_type === "color_picker")) {
        return(this.renderSelectField({disabled:disabled, disableUnderline:disableUnderline}))
      } else {
        return(this.renderTextField({disabled:disabled, disableUnderline:disableUnderline}))
    }
  }

  handleClick(event) {
    this.setState({form:true})
  
  }

// add onsubmit and name to form
  render()  {
    const { object_type, field_name } = this.props;
    const field = meta.field(object_type,field_name);
    const disabled =  (field.prevent_edit || field.derived || (field.not_in_db))?true:false
    let options = {disabled:disabled}

    switch (this.props.mode) {
      case "form":
        return (<form>
                {this.renderField(options)} 
              </form>)
        break;
      case "view_click_form":
          return (
           this.state.form ? 
              <form>
                {this.renderField(options)} 
              </form>
            :  
              field.derived ?
                <div>
                  {this.getDisplayView()}&nbsp;
                </div>  
                :
                <div onClick={this.handleClick}>
                  {this.getDisplayView()} &nbsp;
                </div>              
          )
      case "form_element":
        return (<Fragment>
                  {this.renderField(options)}
                </Fragment>) 
        break;
      default :
        return (<Fragment>
                {this.getDisplayView()} 
              </Fragment>)
        break
      }
  }

}

Field.defaultProps = {
    mode: 'text'
  };

export default Field;