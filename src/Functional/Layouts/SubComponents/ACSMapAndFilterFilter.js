import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../../Utils/utils.js'
import * as meta from '../../../Utils/meta.js';
import * as api from '../../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import ACSObjectTypeView from "../../../Functional/Lists/ACSObjectTypeView.js"
import ACSObjectView from '../../../Functional/Rows/ACSObjectView.js'
import ACSFilters from "../../../Functional/Filters/ACSFilters.js"

import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {Link, Container, Box, Card, TableHead, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';



function ACSFinder(props) {
  //XX could get default select field by object type from proc?
  const {UpperLeftNavagationComponent, data:props_data=[], object_type="core_subsite", toggleFilterView, filter_form_values, setFilterFormValues} = props

  const {more_field_list=["summary", "leader", "description", "address"], list_field_list=["more", "name","summary","address"]} = props

  const [form_touched, setFormTouched] = useState(false)
  const [data, setData] = useState(props_data)
  const [show_details, setShowDetails] = useState(false)
  const [active_data, setActiveData] = useState("")

  function handleDetailsClose(event) {
      setActiveData("")
  }

  function HandleMoreInfo (props) {
      function handleSetActiveData(event) {
        setActiveData(props.data)
      }
      return (<Link name={props.data} onClick={handleSetActiveData}>Details</Link>)
  }
  
  const field_models = {[object_type]:{
                        more:{pretty_name:"More",
                          rab_component_model:{field:{components:{field:HandleMoreInfo}}}
                          }
                        }}

  function loadData(api_options="") {
    api.getData(object_type, api_options, (api_data, error) => {
      setData(api_data)
      setFormTouched(true)
    })
  }

  const handleFilterChange = (api_options, filter_form_values) => {
      if (setFilterFormValues) {
        setFilterFormValues(filter_form_values)
      }
      loadData(api_options)
  }
  return (
    <Fragment>
      {active_data && <Dialog fullWidth={true} open={true}  onClose={handleDetailsClose}>
        <DialogContent>
              <ACSObjectView data={active_data} field_list={more_field_list} object_type={object_type} mode="view" num_columns={1}  />
              <DialogActions>
                <Button onClick={handleDetailsClose} color="primary">Close</Button>
              </DialogActions>  
        </DialogContent>
      </Dialog>}
      <div  style={{ display:"block"}}>
      <UpperLeftNavagationComponent onChange={toggleFilterView} text={props.text} object_type={props.object_type} layout={props.layout} sections={props.sections} dialog_size={props.dialog_size} onSubmit={props.handleCreateMarkerSubmit} filter_view={props.filter_view}/>
      </div>
      <div style={{paddingLeft:20, paddingRight:40, paddingTop:10,  display:'flex', width:'100%'}}>       
        <div style={{display:'flex', paddingRight:40}}>
          <ACSFilters filters={props.filters} label_direction="row" default_filter_values={filter_form_values} label_variant="subtitle1" onChange={handleFilterChange}/>
        </div>
        <div style={{width:"70%"}}>
          {form_touched && data !== "" && data.length ===0 &&
          <Card variant="outlined" style={{padding:30,backgroundColor:"#DDDDDD"}}>
            There are no results that meet your criteria.
          </Card>
          }
          {data.length ===1 &&
          <Card variant="outlined" style={{padding:30,backgroundColor:"#DDDDDD"}}>
          <ACSObjectView data={data[0]} field_list={more_field_list} object_type={object_type} mode="view" num_columns={1}  />
          </Card>}
          {data.length >1 &&
            <ACSObjectTypeView data={data} field_click_to_edit={false} rab_component_model={{list:{names:{header_wrap:"RABVoid"}}}} field_models={field_models} field_list={list_field_list} object_type={object_type} mode="view" num_columns={1}  />
          }
         </div>
     </div>
  
  </Fragment>)
}


//export default withStyles(styles, { withTheme: true })(VolunteerNew);
export default ACSFinder;

