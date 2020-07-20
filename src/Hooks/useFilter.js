import React, {useState, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js';
import useGetModel from '../Hooks/useGetModel';
import {AuthContext} from '../Components/User';
import axios from 'axios';

import ACSSelectFilter from "../Filters/ACSSelectFilter.js"


const useFilter = (filters) => {
  const [filter_api_options, setFilterApiOptions] =useState({})
  const [final_filter_api_options, setFinalApiOptions] = useState({filter_field:[], filter_id:[]})
  const [last_filter_touched, setLastTouched] = useState("")

  const handleFilterChange = (event) => {
    const event_name = event.target.name 
    const event_value = event.target.value 
    const event_api_options = {filter_id:event_value}
    if (filter_api_options[event_name] !== event_api_options) {
        setLastTouched(event_name)
        setFilterApiOptions(filter_api_options=>({...filter_api_options,[event_name]:event_value}))
    }
  }

  let calc_filter_api_options = {filter_id:[], filter_field:[]}
  filters.forEach(filter => {
    if (filter_api_options[filter.name] && filter_api_options[filter.name]) {
      calc_filter_api_options.filter_field.push(filter.filter_field_name)
      calc_filter_api_options.filter_id.push(filter_api_options[filter.name])
    }
  })

  if (JSON.stringify(final_filter_api_options) !== JSON.stringify(calc_filter_api_options)) {
    setFinalApiOptions(calc_filter_api_options)
  }

  const FilterComponent = (props) => {
      return (filters.forEach(filter => {
              return (<ACSSelectFilter object_type={filter.object_type} filter_name={filter.name} field_name={filter.name} onChange={handleFilterChange}/>)
              }))
  }


  return {FilterComponent, handleFilterChange, final_filter_api_options, last_filter_touched}

}

export default useFilter;