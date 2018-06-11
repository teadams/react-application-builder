import React, { Component, Fragment} from 'react';
import {Snackbar, SnackbarContent, Button} from '@material-ui/core';
//import {Tab} from "material-ui/Tabs";
//import {CrudRow} from "./index.js"
import MUIDataTable from "../../mui-datatables/src";
import { MenuLink, EditButton, DeleteButton, CreateForm, Cell, SelectField} from "./index.js";
import axios from 'axios';
import * as meta from '../../Utils/meta.js';
import * as log from '../../Utils/log.js'

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

function getData (object_type, table_columns, object_attributes, filter_field, filter_id, callback )   {

  var data = [];
  var clean_data = [];
  var data_row_array = [];
  var clean_data_row_array = [];
  var api_response ={};
  var urltext = '/api/v1/' + object_type;
  if (filter_id) {
    urltext += "?filter_field="+filter_field+"&filter_id="+filter_id
  }
  log.val("urltext, filter_id, filter_field", urltext, filter_id, filter_field)
  axios({
   method: 'get',
   url: urltext,
 }).then(results => {
    //log.val('query results', results);

      results.data.map (row => {
          data_row_array =table_columns.map (field => {
            return(field.database_name+'//**//'+row[field.database_name])
          });
          clean_data_row_array =table_columns.map (field => {
              return(row[field.database_name])
          });
          data.push(data_row_array );
          clean_data.push(clean_data_row_array);
      })
    
      api_response.data = data;
      api_response.clean_data = clean_data;
      api_response.error = "";
      callback( api_response);
  }).catch(error => {
    api_response.data = "";
    api_response.clean_data = "";
    api_response.error = error;
    log.val('error response', error.response)
    log.val('in catch error', error.message)
    callback(api_response);
  })
}

class CrudTable extends Component {
  
  constructor(props) {
        super(props);
        this.handleRowsSelected = this.handleRowsSelected.bind(this);
        this.handleRowsDeleted  = this.handleRowsDeleted.bind(this);
  

        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleCreateEditOpen = this.handleCreateEditOpen.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleCSVDownload = this.handleCSVDownload.bind(this);
        this.handleFilterChange  = this.handleFilterChange.bind(this); 

        // change name to handleCellDataRender
        this.handleCustomRender = this.handleCustomRender.bind(this);
        this.handleEditRender   = this.handleEditRender.bind(this);
        this.handleDeleteRender = this.handleDeleteRender.bind(this);
        this.handleLinkRender = this.handleLinkRender.bind(this);
        this.handleClearNotice = this.handleClearNotice.bind(this);
        
        this.massageColumns = this.massageColumns.bind(this);

        var table_options = {};
        table_options.responsive = "scroll";
        table_options.onRowsSelect  = this.handleRowsSelected;
        table_options.onRowsDelete = this.handleRowsDeleted;
        table_options.filterType = 'multiselect';
        table_options.download = false

        this.state = {
            data: [],
            initial_load : true,
            table_columns: [],
            table_options: table_options,
            create_form_open: false,
            notice_open: false,
            notice_type:'error',
            notice_message : '',
            force_data_refresh: false
        }

  }

  
  static getDerivedStateFromProps(nextProps, prevState) {
    log.func("CrudTable: DerivedState", "next Props", nextProps)
    log.val ("next object_type, prev object_type", nextProps.object_type, prevState.object_type)
    if (nextProps.filter_id !== prevState.filter_id || nextProps.object_type != prevState.object_type) {
        // do not operation on state directlry. table_options object is in state becuase it is an object
        var temp_table_options = prevState.table_options;
        temp_table_options.selectableRows	=  nextProps.object_attributes.prevent_delete?false:true;
        log.val(" New Filter_id, seletable rows", nextProps.filter_id, temp_table_options.selectableRows);
        return {filter_id: nextProps.filter_id,
                table_options: temp_table_options}
      } else {
        return null
      }
  }
  
  
  massageColumns(object_fields, object_type) {
    log.func("massageColumns","object_type, object_fields", object_type, object_fields);
    var table_columns = [
      {name:"Edit", options:{
        "customRender" : this.handleEditRender,
        "filter"        : false
      }}]
      
    if (!meta.object(object_type).prevent_delete) {
          table_columns.push( {name:'Delete', options:{
            'customRender' : this.handleDeleteRender,
            "filter"        : false }})
      }
  
    
    table_columns =  table_columns.concat(object_fields.map((field, index) => {
      //    log.val("field, index", field, index);
       var table_column = {};
       table_column.name = field.pretty_name;
       table_column.database_id_column = field.name;
       table_column.database_name = field.name;
       table_column.valid_values = field.valid_values;
       table_column.references = field.references;
       table_column.menu_link = field.menu_link;
       table_column.menu_link_field = field.menu_link_field;
       table_column.menu_link_reference_field = field.menu_link_reference_field;
  

       table_column.options  = {};
       if (field.menu_link) {
         log.val("menu_link index", index);
          table_column.options.customRender = this.handleLinkRender;
      // } else if (table_column.edit && table_column.db) {
      //will add this back once we do not need the custom render split hack
      } else {
        
          log.val("adding custom render edit, db", table_column.edit, table_column.db);
          table_column.options.customRender = this.handleCustomRender;
       }
       log.val ("field", field)
       log.val("valid_valid, references, name, filter field", field.valid_values, field.references, field.name, this.props.filter_field)
       table_column.options.filter = (field.valid_values || (field.references && (field.name != this.props.filter_field))) ? true : false;
       log.val('option filter is' , table_column.options.filter)     
       table_column.options.sort = true;
  
       if(field.key || field.crud_hide_column) {
          table_column.options.display = false;
       }
       return table_column;
     }));
    return table_columns;
  }

  
  handleFilterChange = event => {
      log.func('handleFilterChange', "value", event.target.value)
       this.setState({ filter_id: event.target.value,
                      notice_open: false,
                      force_data_refresh: true});
   }
  
  handleLinkRender(index, value, updateValue) {

    var cell_data = value.split('//**//');
    var database_name = cell_data[0];  
    log.func("handle link render","database_name, index, table_columns, data, has data", database_name, index, 
      this.state.table_columns, this.state.data, this.state.data[index])
      // Muidatatable calls this with an index that does not exist
    if (this.state.data[index]) {
      var column_options = this.state.table_columns.filter (col => {
          log.val("col database name, database name", col.database_name, database_name);
          if ( col.database_name === database_name) {
            return true
          } else {
            return false
          }
      });
      log.val("column opiotnes", column_options);
      column_options = column_options[0]
      var menu_link_index = this.state.id_index;
      log.val("column options, table_columns, menu_link_index", column_options, this.state.table_columns, menu_link_index);

      var link_id_value = "";
      // we have to parseint because of the crazy workaround to column number
      link_id_value = parseInt(this.state.data[index][menu_link_index].split('//**//')[1]);

      log.val("menu link field, final menu link index, data row, data", column_options.menu_link_field, menu_link_index, 
      this.state.data[index], this.state.data[index][menu_link_index]);

      log.val("finanl link, text", link_id_value, column_options.name)
      
      return <MenuLink text={column_options.name} menu_link_field={column_options.menu_link_field}  link_menu_index={column_options.menu_link} link_object_type={this.props.object_type}    filter_id={link_id_value} menu_link_reference_field={column_options.menu_link_reference_field}  onClick={this.props.filterOnChange} />
    } else {
      return ""
    }
  }
      
      
  handleCustomRender(index, value, updateValue) {

      const { object_attributes, object_fields} = this.props;
      const object_type  = this.props.object_type;
      const id_index = this.state.id_index;
      var id_column_name = object_attributes.id_column_name;
      if (this.state.data[index]) {
        var id_column_value = this.state.data[index][id_index].split('//**//')[1];
      }
      var cell_data = value.split('//**//');
      var column = cell_data[0];
      // broken for IE
      log.val('object-type, column', object_type, column)
      const field = meta.field(object_type, column)
      log.func("CUSTOM FIELD field", "field, table_columns", field, this.state.table_columns)
      return <Cell table_columns={this.state.table_columns} row={this.state.data[index]} value={cell_data[1]}  column={cell_data[0]} id_column_name={id_column_name} id_column_value={id_column_value} object_type={object_type} onUpdate={this.handleDataChange} onChange={this.handleClearNotice} field={field} />
  }
  
  handleEditRender(index, value, updateValue) {
      return <EditButton size="small" onClick={this.handleCreateEditOpen} index={index} row={this.state.data[index]}/>
  }
  
  handleDeleteRender(index, value, updateValue) {
      return <DeleteButton size="small" onClick={this.handleRowsDeleted} index={index}/>
  }
  
  handleRowsSelected(currentRowsSelected, rowsSelected)  {
    this.setState({  notice_message: '', notice_open:false});
  }

  handleRowsDeleted(deleted)  {
      const object_attributes = this.props.object_attributes;
      const id_index = this.state.id_index;
      const name_index = this.state.name_index;
      
      var deleted_names = [];
      deleted = deleted.map( x => {
      deleted_names.push (this.state.data[x][name_index].split('//**//')[1]); 
        return (this.state.data[x][id_index].split('//**//')[1]);
      })
      var urltext = '/api/v1/' + this.props.object_type + '/' + deleted.join(',');
    axios({
        method: 'delete',
        url: urltext,
      }).then (result => {
          if (result.data === "referential error") {
            this.handleDataChange(deleted_names.join(', ') +' not deleted because other data links to it.');            
          } else {
            this.handleDataChange(deleted_names.join(', ') +' Deleted');            
          }
      });
  }
  
  handleCreateEditOpen(event, index) {
   // alert ('index is ' + JSON.stringify(index));
    log.func("CrudTable: HandleCreateEditOpen", 'Props', this.props);
    // log.val("keys", meta.keys(this.props.object_type));
    // const id_index = meta.keys(this.props.object_type).key_id;   
    // log.val("Id index", id_index);
     const object_attributes = this.props.object_attributes;
     const id_index = this.state.id_index;
    // log.val("id index", id_index);
  //    log.val("data cell ", this.state.data[index][id_index]);
     var form_edit_id = (index>=0)?this.state.data[index][id_index].split('//**//')[1]:"";
     if (form_edit_id === "null") {
       form_edit_id = ""
     }
//     alert ('form edit id is ' +form_edit_id)
     log.val('form edit id ', form_edit_id);
    this.setState({
      create_form_open: true,
      notice_message: '',
      notice_open:false,
      form_edit_id: form_edit_id
    });
  };


  componentDidMount() {
    log.func("CrudTable: DidMount")
    const object_fields = this.props.object_fields;
    const object_attributes = this.props.object_attributes;
    // Ideally, we would put this in DerviveStateFromProps,but it has no access to this, which 
    // is needed to link the appropriate render functions
    var table_columns = this.massageColumns(object_fields, this.props.object_type);
    var id_column_name = meta.id_column(this.props.object_type); 
    var name_column_name = meta.pretty_key_field(this.props.object_type).name;
    var id_index;
    var name_index = ""
  //  log.func('looking for indexes name_column_name','name_column_name, id_column_name',name_column_name, id_column_name)
    table_columns.map((column, index) => {
    //  log.val("column, index", column, index)
      if (column.database_id_column === id_column_name) {
        id_index = index;
      } else if (column.database_id_column === name_column_name) {
        name_index = index;
      }
    })
    //log.val("id_index, name_index", id_index, name_index)
    
    getData (this.props.object_type, table_columns, object_attributes, this.props.filter_field, this.state.filter_id, (results) => {
          
          this.setState({ data: results.data,
                          clean_data: results.clean_data,
                          id_index: id_index,
                          name_index: name_index,
                          notice_message: (results.error)?"Problem Retrieving Data From Server":"",
                          notice_open:(results.error)?true:false,
                          notice_type:"error",
                          table_columns: table_columns,
                          initial_load: false
          })
    })
  }

 componentDidUpdate(prevProps, prevState, snapshot) {
   log.func("Crud Table COmponent did update")
    var id_index = this.state.id_index;
    var name_index = this.state.name_index;
  //  log.func("Crud Table COmponent did update", "id_index,name_index", id_index, name_index)
    
    // setting up new object so do not change state directly
    var new_table_columns = this.state.table_columns;
    log.val("new table columns, prev prop type, new object type", new_table_columns, prevProps.object_type, this.props.object_type)
  
    if (this.props.object_type !== prevProps.object_type) {
      const object_fields = this.props.object_fields;
      const object_attributes = this.props.object_attributes;
        var new_table_columns = this.massageColumns(this.props.object_fields, this.props.object_type);
    //    log.val('after massage table is ', new_table_columns);
        var id_column_name = meta.id_column(this.props.object_type); 
        var name_column_name = meta.pretty_key_field(this.props.object_type);

      new_table_columns.map((column, index) => {
           if (column.database_id_column === id_column_name) {
                id_index= index;
          } else if (column.database_id_column === name_column_name) {
                name_index = index;
          }
      })
    }
    if (this.props.object_type !== prevProps.object_type ||
       this.state.force_data_refresh) {  
      getData (this.props.object_type, new_table_columns, this.state.object_attributes, this.props.filter_field, this.state.filter_id, (results) => {
        var notice_message = this.state.force_data_refresh?this.state.notice_message:'';
        var notice_open = this.state.force_data_refresh?true:false;
        var notice_type = "success";
        if (results.error) {
          notice_message = "Problem Retrieving Data From Server";
          notice_open = true;
          notice_type = "error";
        } 
    
            this.setState({ data: results.data,
                            clean_data: results.clean_data,
                            id_index: id_index,
                            name_index: name_index,
                            table_columns: new_table_columns?new_table_columns:this.state.table_columns,
                            iniital_load: false,
                            force_data_refresh:false,
                            notice_message: notice_message,
                            notice_open: notice_open,
                            notice_type: notice_type
              })
      })
    }
      
 }


// Rename - handleDataChange
 handleDataChange = value => {
   console.log('in create close');
    this.setState({ notice_message: value,
                  notice_open: value?true:false,
                  notice_type: "success",
                  create_form_open: false, 
                  force_data_refresh: true,
                  form_edit_id: ''});
 };
 
 handleClearNotice = () => {
   this.setState({notice_message:"", notice_open:false});
 }

 handleCSVDownload = () => {
    const { object_fields, object_type} = this.props;
    const { clean_data } = this.state;
    
    console.log('clean data is ' + clean_data);
    const CSVHead = object_fields.reduce((soFar, column) => soFar + '"' + column.pretty_name + '",', "").slice(0, -1) + "\r\n";
    console.log ('head is ' + CSVHead + 'DONE');
    var col_slice =   meta.object(object_type).prevent_delete?1:2
    const CSVBody = clean_data.reduce((soFar, row) => {
        return (soFar + '"' + row.slice(col_slice).join('","') + '"\r\n')}
        , []
      ).trim();
      
      console.log('body is ' + CSVBody);
    
      const csv = `${CSVHead}${CSVBody}`;
      const blob = new Blob([csv], { type: "text/csv" });
      const dataURI = `data:text/csv;charset=utf-8,${csv}`;
     
      const URL = window.URL || window.webkitURL;
      const downloadURI = typeof URL.createObjectURL === "undefined" ? dataURI : URL.createObjectURL(blob);
     
      let link = document.createElement("a");
      link.setAttribute("href", downloadURI);
      link.setAttribute("download", object_type + ".csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.handleClearNotice();
  };
  

 handleFileUpload(event) {
     event.preventDefault();
     this.handleClearNotice();

     console.log('in file upload');
     const data = new FormData();
     
     data.append('file', this.fileInput.files[0]);
     data.append('filename', 'test filename');
     axios.post('/api/v1/upload/' + this.props.object_type , data)
     .then (result => { 
        console.log("FILE WAS UPLOADED" + JSON.stringify(result));        
        document.getElementById("upload-form").reset();
        this.handleDataChange(result.data);

      }).catch(function (error) {
        document.getElementById("upload-form").reset();
        console.log(error);
      });
      // TODO rename proc
  }
   
 render() {
  // log.func("crud render",'object_attributes, object_type, notice_open', this.props.object_attributes, this.props.object_type, this.state.notice_open);
 //alert('props ' + JSON.stringify(this.props))

    return (
        <Fragment>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={6000}
          onClose={this.handleClearNotice}
         open={this.state.notice_open}>
         <SnackbarContent
          message={this.state.notice_message}
          style = {{backgroundColor:this.state.notice_type=="error"?"red":"green"}}
          />
         </Snackbar>
         
        <form>
          <Button  style={{marginTop:0, marginBottom:5, marginLeft:10, marginRight:10}}  variant='outlined' size="medium" color ="primary" onClick={this.handleCreateEditOpen}>
                  Create {this.props.object_attributes.pretty_name}
          </Button>
            
        {this.state.create_form_open &&
        <CreateForm
            object_type={this.props.object_type}
            object_fields={this.props.object_fields}
            object_attributes={this.props.object_attributes}
            open={this.state.create_form_open}
            onClose={this.handleDataChange}
            id={this.state.form_edit_id}
            filter_field={this.props.filter_field}
            filter_id={this.state.filter_id}
         />
       }
      
         {this.props.filter_field &&
             <SelectField 
             key="filter"
             object_type={this.props.filter_object_type} 
             label={this.props.filter_label}
             value={this.state.filter_id}
             open="true"
             onChange={this.handleFilterChange}
             style={{width:200,  marginBottom:20}}
             />
         }
         </form>
         
         <MUIDataTable
           title={this.props.object_attributes.pretty_plural}
           data={this.state.data}
           columns={this.state.table_columns}
           options={this.state.table_options}
          />
          
          <form name='upload-form' id='upload-form'>
          <Button variant="raised" style={{margin:10}} onClick={this.handleCSVDownload} component="span">
            Download
          </Button>
        <label  htmlFor="button-file">
            <Button variant="raised" style={{margin:10}} component="span">&nbsp;&nbsp;&nbsp;Upload&nbsp;&nbsp;&nbsp;</Button>
          </label>
        <input
          accept="image/*"
          id="button-file"
          style= {{display: 'none', margin:20}}
          ref={input => {
            this.fileInput = input;}}
          onChange={this.handleFileUpload}
          type="file"
        />
        </form>
         
        
      </Fragment>
    )
  }
}

export default CrudTable;
