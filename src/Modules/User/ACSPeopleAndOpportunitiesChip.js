import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import {ACSListController} from '../../ACSRenderEngine'
import {ACSChipObjectType, ACSObjectType} from '../../ACSLibrary'


import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';


function ACSPeopleAndOpportunitiesChip(props)  {
  const {object_type,  data:input_data, api_options, field_model, ...params} = props
  const {subsite_id} = api_options
  let list_group_by_chip = {}
  let need_api_options = field_model.need_api_options
  need_api_options.subsite_id = subsite_id 
  need_api_options.filter_join = "AND"

  const [data, setData] = useState(input_data); 
  const [need_data, setNeedData] = useState(null); 

  if (input_data && data!== input_data) {
        setData(input_data)
  }

  const onData = (api_results => {
    setData(api_results)
  })

//u.a(need_api_options)
  const onNeedData = (api_results => {
    setNeedData(api_results)
  })
  if (data && need_data !== null) {
    let roles_seen = []
    need_data.forEach(need => {
      const new_data = {}
      new_data.data_core_role = {}
      new_data.data_core_user = {}
      if (!roles_seen.includes(need.data_role_name.name)) {
        new_data.data_core_role[field_model.chip_group_by_object_type_key] = need.data_role_name.name 
        new_data.data_core_user.first_name = "Volunteers Needed"
        new_data.data_core_user.last_name = ""
        new_data.group_by_chip = "Volunteers Needed"
        new_data.variant = "default"
        new_data.color = "primary"
        new_data.show_blank_avatar = false
        roles_seen.push(need.data_role_name.name)
        list_group_by_chip[need.data_role_name.name] = new_data
        // in case we want to add items at end of grouping
        //data.push(new_data)
      } 
    })
  }


  return (
    <Fragment>
      <ACSObjectType  headless={true} object_type="nwn_project_need" api_options={need_api_options} onData={onNeedData} />
      <ACSObjectType data={input_data} headless={true} object_type={object_type} api_options={api_options} onData={onData}/>
      {data &&  
      <ACSChipObjectType {...params} list_group_by_chip={list_group_by_chip} data={data} field_model={field_model} object_type={object_type} api_options={props.api_options}/>}
    </Fragment>)
}

export default ACSPeopleAndOpportunitiesChip;

