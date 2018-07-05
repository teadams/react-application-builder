import React from 'react';
import {  TextField} from '@material-ui/core';
import axios from 'axios';
import {SelectCell} from "./index.js";
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';


class Cell extends React.Component {

  constructor(props) {
        super(props);  
        this.state = {
          clicked : false,
          value_changed: false,
          value : this.props.value
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDBUpdate = this.handleDBUpdate.bind(this);

  }

  handleClick () {
      console.log('handling click with value ' + this.state.value);
      if (this.state.value === null) {
        console.log('setting value to null')
        this.setState({ clicked:true, value:""});
      } else { 
        this.setState({ clicked:true});
      }
      this.props.onChange();
  }
    
  
  handleSubmit = event => {
  //  console.log('in cell hande submit');
      event.preventDefault(); 
      this.handleDBUpdate();
  }
  
  handleDBUpdate() {
    if (this.state.value_changed) {
      //  console.log('updating cell in db')
        var data_object = Object();
            data_object[this.props.column] = this.state.value;
            var urltext = '/api/v1/'+this.props.object_type +'/'+ this.props.id_column_value;
            axios({
              method: 'put',
              url: urltext,
              data: { data_object }
            }).then (result => {
              console.log(result);
              this.setState({ clicked:false, value_changed:false});
              var pretty_cell_name = meta.field(this.props.object_type, this.props.column).pretty_name;
              log.val("CELLCHANGED table columns, column", this.props.table_columns, this.props.column)
              this.props.onUpdate(pretty_cell_name + ' changed');
            });
    } else {
      //console.log('state did not change, closing');
      this.setState({ clicked:false});
    }
  }
  
  handleChange = event => {  
      this.setState({ value: event.target.value, value_changed: true });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevProps !== this.props) {
          this.setState({ value: this.props.value,
                          clicked: false })
      }
      if (this.props.field.valid_values || this.props.field.references) {
        if (this.state.value_changed ) {
            console.log('forcing a blur couse we just changed the select')
            this.handleDBUpdate();
          }
      }
  }


  render() {
//    alert ('state of clicked is ' + this.state.clicked)
    if (this.state.clicked && !this.props.field.prevent_edit && !this.props.field.not_in_db) { 
        //  alert ('editable field ' + JSON.stringify(this.props.field))
            if (this.props.field.valid_values || this.props.field.references) {
        //        alert ("select cell")
                 return (<form onSubmit={this.handleSubmit} > 
                 <SelectCell
                 autoFocus={true}
                 open={this.state.clicked}
                 value = {this.state.value}
                 object_type={this.props.object_type}
                 table_columns = {this.props.table_columns}
                 field={this.props.field}
                 row={this.props.row}
                 onChange={this.handleChange}
                 onBlur={this.handleSubmit}
                 style={{width:200, marginRight:20, marginBottom:20}}
                 />
                 </form>)
              } else {
              return (<form onSubmit={this.handleSubmit}>  
                      <TextField
                    autoFocus={true}
                    id = "inline_field"
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                    onBlur={this.handleSubmit}
                   />
              </form> )
              }
      } else {
      //  console.log(' in Cell state values is ' + this.state.value)
        if (this.state.value === "null" ||!this.state.value) {
          return   <div style={{ width:'100%', margin:0, padding:0}} onClick={this.handleClick}>&nbsp;</div>          

        } else {
        //  console.log ('click be with value ' + this.state.value);
          return  <div style={{ margin:0, padding:0}} onClick={this.handleClick}>{this.state.value}</div>          
        }
      }
   }
}

export default Cell;
