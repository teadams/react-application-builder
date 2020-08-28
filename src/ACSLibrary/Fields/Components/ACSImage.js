import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
//import * as u from '../../../Utils/utils.js';
import * as control from '../../../Utils/control.js';

import React, { Fragment} from 'react';
import { Button } from '@material-ui/core';
import ACSImageView from './Widgets/ACSImageView.js'
import useGetModel from '../../../Hooks/useGetModel.js'

function ACSImage(props) {
  const {mode, data, row_data, prevent_edit, image_size="tiny", image_size_list="tiny", field_name, field_models, pretty_key, pretty_name, data_field, formdata, object_type, formValues, disable_underline=false, onChange, autoFocus, avatar, fullWidth=true, custom_width, custom_height, data_type, components, img_style, list_img_style, display_field=props.field_name, references_field, form_field_name=props.field_name, field_model={},
  variant="outlined", required, helperText, placeholder
} = props

  const field_value = data[data_field]
  const object_type_model = useGetModel("object_types")[object_type]

  let letters = ""

  if (!field_value && data_type === "image") {
    const pretty_key = object_type_model.pretty_key_id

    const pretty_field_meta = field_models[object_type][pretty_key]
    const pretty_comp_name = pretty_field_meta.field_component
    const field_component = control.componentByName(pretty_comp_name?pretty_comp_name:"RABTextField")
    let pretty_name_text = ""
    if (data[pretty_key]) {
      pretty_name_text  = field_component({data:data, field_name:pretty_key, mode:"text"})
    }

    let word = ""
    if (pretty_name_text) {
      for (word of pretty_name_text.split(" ")) {
        letters += word.charAt(0)
      }
    }
  }
switch (mode) {
    case "edit":
    case "create":
      let img_exists = false 
      let img_src, img_name
      if (formValues && Object.keys(formValues).length>0 &&formValues[form_field_name]) {
        img_exists = true
        img_src = URL.createObjectURL(formValues[form_field_name])
        img_name = formValues[form_field_name].name

      }
      const border_style= {
        borderColor:"rgba(0, 0, 0, 0.24)",
        borderStyle: "solid",
        borderWidth: "1px",
        display:"flex",
        flexDirection:"row",
        padding:"10px",
        height:"100%",
        lineHeight:"1.1876em"
      }
      return (<Fragment>
        <div>
        {field_model.summary &&  <div style={{marginBottom:"5px"}}>{field_model.summary}</div>}
          <div style={border_style}>
            <div>
              {mode==="edit" && data_type === "image" && !img_exists &&
                <ACSImageView style={img_style} letters={letters} image_object={field_value} letters={letters} size={image_size} avatar={avatar} custom_width={custom_width} custom_height={custom_height}/>
              }
              { mode !== "edit" &&  data_type === "image" && !img_exists &&
              <Fragment>
                <ACSImageView style={img_style} letters={letters} img_src="" letters={letters} size={image_size} avatar={avatar} custom_width={custom_width} custom_height={custom_height}/>
              </Fragment>
              }
              {img_exists && 
              <Fragment>
                <ACSImageView style={img_style} letters={letters} img_src={img_src} letters={letters} size={image_size} avatar={avatar} custom_width={custom_width} custom_height={custom_height}/><br/>
                {img_name}
              </Fragment>
              }
            </div>
            <div style={{paddingLeft:"10px"}}>
               <label htmlFor={form_field_name}>
                {helperText} <br/>
                 <Button style={{marginTop:"10px"}} color="primary" variant="outlined" component="span">
                   Upload {pretty_name}
                 </Button>
                
               </label>    
               <input
                 style={{ display: "none" }}
                 id={form_field_name}
                 name={form_field_name}
                 key={form_field_name}
                 type="file"
                 onChange={onChange}
               />
            </div>
            </div>
          </div>
        </Fragment>
        )
      break
    case "csv":
      return '"'+field_value+'""'
      break
    case "list":
        return <ACSImageView style={list_img_style?list_img_style:img_style} letters={letters} image_object={field_value} size={image_size_list}   avatar={avatar}/>
      break
    default:
        return <ACSImageView style={img_style} letters={letters} avatar={avatar} image_object={field_value} size={image_size}/>
  }
}

export default ACSImage;
