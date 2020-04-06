import React, { Component, Fragment} from 'react';
import {Chip, TextField, Paper, Button, Grid, ListItem, List,  Typography} from '@material-ui/core'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import TimePicker from 'material-ui-pickers/TimePicker'
import DateTimePicker from 'material-ui-pickers/DateTimePicker';
import format  from 'date-fns/format';
import axios from 'axios';

import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';

import update from 'immutability-helper';

import {ButtonExpandMore, SelectField, CrudTable, EditButton, MenuLink} from "../Layouts/index.js";

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
            // filter -- used as a filter
            // form_element - one form element (no form tags)- this component will not call server to update. Used for ObjectCreate
      // id - the value for the the key from this row (not required for view mode)
      //      in theory, this could be derived from data_object. However, I don't want to allow data object to only
      //      contain the field (for example, for filter fields)

      this.state = {
        value_changed: false
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleDateChange = this.handleDateChange.bind(this);
      this.handleSubmit  = this.handleSubmit.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.fileInput = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
      return true
      let prefix = ""
      let final_object_type = nextProps.object_type;
      let field = meta.field(nextProps.object_type, nextProps.field_name)
      let final_field = field
      if (field.field_object_type) {
        prefix = meta.reference_field(nextProps.object_type,field.field_object_type).name + "_"
        final_object_type = field.field_object_type
        final_field = meta.field(field.field_object_type, field.field_field_name)
     }
      if (nextState !== this.state) {
        return true
      } else if (nextProps.object_type !== this.props.object_type) {
        return true;
      } else if (nextProps.field_name != this.props.field_name) {
        return true;
      } else if (nextProps.data_object[prefix+final_field.name] !== this.props.data_object[prefix+final_field.name]) {
        return true;
      } else if (final_field.derived || final_field.dependent_field) {
        // a derived field may be influence by changes in other fields in data_object
        return true;
      } else {
        return false
      }
  }

  componentDidMount() {
    let { object_type, field_name} = this.props;
    let field = meta.field(object_type,field_name);
    let final_field = field;
    log.val('mount field name, data oboject ', field.name, this.props.data_object)
  //  alert ('field and data object ' + field.name + ' ' + JSON.stringify(this.props.data_object))
    let prefix = ""
    if (field.field_object_type) {
      // the data object will have everything prefixed by the 
      // name of the reference field pointing to this tables    
      prefix = meta.reference_field(object_type,field.field_object_type).name + "_"
      final_field = meta.field(field.field_object_type, field.field_field_name)
    //  alert ('prefix is ' + prefix)
    //  alert ('dta object is ' + JSON.stringify(this.props.data_object))
   }
    this.setState({value: this.props.data_object[prefix + final_field.name]})
  } 

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { data_object, id } = this.props;
    let {object_type, field_name } = this.props;
    let field = meta.field(object_type,field_name);
    let final_field= field
//          alert ('dta object is ' + JSON.stringify(this.props.data_object))
    log.val('update field name, data object', field.name, this.props.data_object)
    let prefix = "";
      if (field.field_object_type) {
        // the data object will have everything prefixed by the 
        // name of the reference field pointing to this tables    
          prefix = meta.reference_field(object_type,field.field_object_type).name + "_"
  //        alert ('prefix is ' + prefix)
          final_field = meta.field(field.field_object_type, field.field_field_name)
      //    alert ("state is " + JSON.stringify(this.state.value))
//           alert ("data object is " + JSON.stringify(this.props.data_object))
//           alert ("field is " + prefix+final_field.name)
      }

//      alert ("prior and this object type "  + prevProps.object_type + " " + this.props.object_type)
//      alert ('this props data object ' + JSON.stringify(this.props.data_object))
      if (prevProps.id !== id || 
          prevProps.object_type !== object_type || 
          prevProps.data_object[prefix + final_field.name] !== this.props.data_object[prefix + final_field.name]) {
  //            alert ("updating state to " + this.props.data_object[prefix + final_field.name])
              if (this.props.data_object[prefix + final_field.name] !== undefined) {
                this.setState({value: this.props.data_object[prefix + final_field.name]})      
              } else {
                this.setState({value: ""})
              }
      }
  }  



  handleDateChange(date) {
//     alert ("on change")
    // callback is a workaround until DatePicker supports onBlur
      this.handleChange("",format(date, 'MM/DD/YYYY')
, true)
  }

  handleChange(event, value, submit_p) {
      //alert ("change " + event)
      if (event) {
        //alert ('event is ' + event.target)
        const target = event.target;
        value = target.type === 'checkbox' ? target.checked : target.value;
      }
//      alert ('handle change with ' + value)
      let prefix=""
      let object_type = this.props.object_type
      let field =  meta.field(this.props.object_type,this.props.field_name)
      let final_field = field
      if (field.field_object_type) {
        // the data object will have everything prefixed by the 
        // name of the reference field pointing to this tables    
          prefix = meta.reference_field(object_type,field.field_object_type).name + "_"
    //      alert ('prefix is ' + prefix)
          final_field = meta.field(field.field_object_type, field.field_field_name)
      //    alert ("state is " + JSON.stringify(this.state.value))
      //    alert ("data object is " + JSON.stringify(this.props.data_object))
      //    alert ("field is " + prefix+field.name)
      }

    if (submit_p) {
        this.setState({value:value, value_changed:true}, ()=>{this.handleSubmit(event)});
    } else {
      this.setState({value:value, value_changed:true});
    }
      this.props.onChange(prefix+final_field.name, value);
  }

  handleSubmit(event) {
    //alert ('handle submit')
    const { object_type, field_name, mode, id, data_object } = this.props;
    const field = meta.field(object_type,field_name);
      if (mode !== "form" && !this.state.form ) {
          return null
      }
      if (event) {
        event.preventDefault();
      }
      if (field.input_type == "image") {
        //alert ("looking at image")
        const image_data = new FormData();
        if (this.fileInput.current) {
        //alert (" file is " + JSON.stringify(this.fileInput.current.files))
          image_data.append('file', this.fileInput.current.files[0]);
          axios.post('/api/v1/upload/image/' + this.props.object_type + '/' + field.name + "/" + data_object[meta.keys(object_type).key_id]  , image_data)
          .then (result => { 
            
              console.log("FILE WAS UPLOADED" + JSON.stringify(result));
              if (this.props.onUploadFile) { 
                // as file upload is not controlled by React
                // we have to force a load of the data object 
                // get the new filepath, height, width
                this.props.onUploadFile();
              }
          }).catch(function (error) {
              console.log(error);
          });
        }
      } else if (this.state.value_changed) {
        let prefix=""
        let final_field = field
        let final_object_type = object_type
        let final_id =  id?id:data_object[meta.keys(object_type).key_id]
        if (field.field_object_type) {
          // the data object will have everything prefixed by the 
          // name of the reference field pointing to this tables    
            let reference_field = meta.reference_field(object_type,field.field_object_type)
            prefix = reference_field.name + "_"
      //      alert ('prefix is ' + prefix)
            final_object_type = field.field_object_type
            final_field = meta.field(field.field_object_type, field.field_field_name)
            final_id = data_object[prefix+meta.keys(final_object_type).key_id]
      //      alert ('final id is ' + final_id)
        //    alert ("state is " + JSON.stringify(this.state.value))
        //    alert ("data object is " + JSON.stringify(this.props.data_object))
        //    alert ("field is " + prefix+field.name)
        }
        var update_object = Object();
        update_object[final_field.name] = this.state.value;
        // if we want field in other tables to be updatable, change here
        update_object[meta.keys(final_object_type).key_id] = final_id
    //    alert ("final object type " + final_object_type)
    //    alert ("update object is " + JSON.stringify(update_object))

        data.putData(final_object_type, update_object, {}, (mapped_data, error) => { 
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
    const { data_object, object_type, field_name } = this.props;
    // meta.get_display_value will take references, dervived, etc. into consideration
    const field = meta.field(object_type, field_name)
    if (Object.keys(data_object).length == 0) {
      return null
    } else if (field.input_type) {
        let img_info = {}
        if (data_object[field_name]) {
          img_info =JSON.parse(data_object[field_name])
        }
    
        let image_url = "images" + "/" + object_type + "/" + field_name + "/" + img_info.name
        if (img_info.width) {
          return (<Fragment> <img width={img_info.width} height={img_info.height} alt={img_info.filename} title={img_info.filename} src={image_url}/> </Fragment>)
      } else {
          return ""
      }
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

  renderDate(object_type, field, prefix, options) {
    const { data_object } = this.props;
    const openToYearSelection = field.openToYearSelection?field.openToYearSelection:false
    return  (<MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          value={this.state.value}
          //autoOk={true}
          openToYearSelection={openToYearSelection}
          onBlur={this.handleSubmit}
          animateYearScrolling={true}
          invalidDateMessage=""
          invalidLabel=""
          label={field.pretty_name}
          onChange={this.handleDateChange}
  //        onClose={this.handleDateClose}
          showTodayButton={true}
          format="MM/DD/YYYY"
          leftArrowIcon="<"
          rightArrowIcon=">"
        />
         </MuiPickersUtilsProvider>)
  }

  renderDerived(object_type, field, prefix, options) {
    const { data_object } = this.props;

    return( <TextField    
      InputLabelProps={{shrink:true}}
      name={field.name}
      label={field.pretty_name}
      disabled={options.disabled?options.disabled:true}
      type="text"
      helperText={field.helper_text}
      value=  {this.getDisplayView(object_type,field,prefix)}
     style={{width:"90%"}}
    />)
  }

  renderReferencedBy(object_type, field, prefix, options) {
  //    alert('field is ' + JSON.stringify(field))
//meta.referencing_field(field.referenced_by, this.props.object_type)}
    // meta.referencing_field(referenced_by, referenced_to)
    // look at object referenced_by
    // find the field references that points to the original table

    return (
      <CrudTable object_type={field.referenced_by}
      object_attributes={meta.object(field.referenced_by)}
      object_fields={meta.fields(field.referenced_by)}
      filter_field ={meta.referencing_field(field.referenced_by, this.props.object_type).name}
      filter_id =  {this.props.data_object[prefix+meta.keys(this.props.object_type).key_id]}
      restricted_fields = {field.restricted_from_crud_fields}
    //  onDataChange= {this.handleDataChange}
       onMenuChange = {this.props.onMenuChange}
      />
    )
  }
  renderMenuLink(object_type, field, prefix, options) {
    return (
      <MenuLink text={field.name} menu_link_field={field.menu_link_field}  link_menu_index={field.menu_link} link_object_type={object_type}    filter_id={this.props.id} menu_link_reference_field={field.menu_link_reference_field}  onClick={this.props.onMenuChange} />
    )
  }

  renderMapping(object_type, field, prefix, options) {
    const disabled = options.disabled?options.disabled:false
    const { data_object } = this.props;
    return (
      <Fragment>
        <Typography style={{padding:0, border:0}}>{field.pretty_name} 
          <EditButton  size="small" onClick={()=>{this.props.onMappingClick(field.name)}} value={field.name}/>
        </Typography>
        {this.getDisplayView()}
      </Fragment>
    )
  }

 renderSelectField(object_type, field, prefix, options) {
    const disabled = options.disabled?options.disabled:false
    const disableUnderline = options.disableUnderline?options.disableUnderline:false
    const {open,  data_object} = this.props;

    return(
      <SelectField 
        key={data_object?data_object[prefix+meta.keys(object_type,field.name).key_id + '+' + field.name]:field.name}
        disabled={disabled}
        shrink="true"
        field={field}
        required = {this.props.filter_required}
        disableUnderline = {disableUnderline}
        value= {this.state.value}
        open={open?open:true}
        onBlur={this.handleSubmit}
        onChange={this.handleChange}
        style={{width:"100%"}}
      /> )
  }


  renderTextField(object_type, field, prefix, options) {
    const disabled = options.disabled?options.disabled:false
    const disableUnderline = options.disableUnderline?options.disableUnderline:false
    const {  data_object } = this.props;
    const multiline = (field.size=="large")?true:false
    let html_input_type = field["input_type"]=="password"?"password":field["input_type"]=="image"?"file":"text"
    // default type is "text"
    // -- override if there is a input_type of password as
    // part of the meta data
    // -- then override if there is a type in the pops
    html_input_type = this.props.type?this.props.type:html_input_type

  

    return (
      <TextField    
        InputLabelProps={{shrink:true}}
        id = {data_object[meta.keys(object_type,field.name).key_id + '+' + field.name]}
        autoFocus = {(this.props.mode=="view_click_form")?true:false}
        name={field.name}
        label={field.pretty_name}
        disabled={disabled}
        InputProps = {{disableUnderline:disableUnderline}}
        type={html_input_type}
        multiline={multiline}
        helperText={field.helper_text}
        value=  {this.state.value}
        onChange={this.handleChange}
        onBlur={this.handleSubmit}
        style={{width:"100%"}}
    />)
  }

  renderImageField(object_type, field, prefix, options) {
    const disabled = options.disabled?options.disabled:false
    const disableUnderline = options.disableUnderline?options.disableUnderline:false
    const {  data_object } = this.props;  
    

    return (
      <Fragment>
      <div>
       {this.getDisplayView()}&nbsp;
      </div> 
      <div>{field.pretty_name}
        <input     name={field.name} type="file" ref={this.fileInput} />
       <button type="submit">Upload</button>
      </div></Fragment>)
  }

  renderField(mode) {
      const {  field_name, data_object, disableUnderline, object_type } = this.props;
      let final_object_type = this.props.object_type;
      let field = meta.field(object_type,field_name);
      let final_field = field;
      let prefix = ""
      // role of renderField is to figure out the final object_type and field
      // that should be displayed
      if (field.field_object_type) {
        // the data object will have everything prefixed by the 
        // name of the reference field pointing to this tables    
        prefix = meta.reference_field(object_type,field.field_object_type)
        // object_type is another table
        final_object_type = field.field_object_type
        final_field = meta.field(field.field_object_type, field.field_field_name)
     }

      // for now, field in other tables are disabled. may be expanded later!!
      let  disabled =  (((field.system_controlled  || (field.prevent_edit && (this.props.action != "Create"))) && this.props.mode !== "filter") || field.derived || field.not_in_db ||  (field.field_object_type && !field.edit_p))?true:false
//      alert ("disabled for " + field.name + " is " + disabled + " plus  " + JSON.stringify(field))
      if (field.dependent_field) {
        if (!this.props.data_object[field.dependent_field]) {
               disabled = true;
            if (field.dependent_action ===  "visible") {
                return null
              }
        }
      } 
      let options = {disabled:disabled}
        
      if (final_field.data_type==="date") {
        return(this.renderDate(final_object_type, final_field,prefix))
      } else if (final_field.referenced_by) {
        return(this.renderReferencedBy(final_object_type, final_field,prefix))
      } else if (final_field.menu_link) {
        return(this.renderMenuLink(final_object_type, final_field,prefix))
      } else if(final_field.derived) {
        return(this.renderDerived(final_object_type, final_field, prefix, {disabled:disabled, disableUnderline:disableUnderline}))
      }  else if (final_field.mapping) { 
        return(this.renderMapping(final_object_type, final_field, prefix, {disabled:disabled, disableUnderline:disableUnderline}))
      } else if ( final_field.valid_values || final_field.references || final_field.data_type === "boolean" || (final_field.data_type === "integer" && (final_field.start_value !== undefined) && (final_field.end_value !== undefined)) || final_field.input_type === "color_picker") {
        return(this.renderSelectField(final_object_type, final_field, prefix, {disabled:disabled, disableUnderline:disableUnderline}))
      } else if (final_field.input_type == "image") {
          return(this.renderImageField(final_object_type, final_field, prefix, {disabled:disabled, disableUnderline:disableUnderline}))
      }  else {
        //alert ("final obbect type final field prefix" + final_object_type + " " + JSON.stringify(final_field) + " " + prefix)
        return(this.renderTextField(final_object_type, final_field, prefix, {disabled:disabled, disableUnderline:disableUnderline}))
    }
  }

  handleClick(event) {
    this.setState({form:true})
  
  }

// add onsubmit and name to form
  render()  {
    const { object_type, field_name, data_object, disableUnderline } = this.props;
    let field = meta.field(object_type,field_name);

    switch (this.props.mode) {
      case "form":  
        return (<form onSubmit={this.handleSubmit}>
              {this.renderField()} 
            </form>)
      case "view_click_form":
          return (
           this.state.form ? 
             <form>
              {this.renderField()} 
              </form>
            :  
              field.derived ?
                <div>sytem
                 {this.getDisplayView()}&nbsp;
                </div>  
                :
                <div onClick={this.handleClick}>
                  {this.getDisplayView()} &nbsp;
                </div>              
          )
      case "form_element":
        return (<Fragment>
                  {this.renderField()}
                </Fragment>) 
        break;
      case "filter":
          return (<Fragment>
                {this.renderField()}
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