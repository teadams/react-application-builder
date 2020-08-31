import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {Fragment} from 'react';
import { Avatar} from '@material-ui/core';
//import * as u from '../../../../Utils/utils.js';

// special case 
// called directly (example from ACSFile) 
// Not part of the  List/Row/Field frameowrk

function get_image_url (image_object) {

    const image_base = (process.env.NODE_ENV ==="production")? "https://storage.googleapis.com/acs_full_stack/":"/"
    if (image_object && image_object.path && image_object.name) {
      if (process.env.NODE_ENV ==="production") {
        return (image_base  + image_object.path +"/"+ image_object.name)
      } else {
        return (image_base  + image_object.path +"-"+ image_object.name)
      }
    } else {
      return ""
    }     
}

function get_image_dimensions (size="medium" ) {
  let standard_sizing = {}
  standard_sizing.tiny =   {height:20, width:20}
  standard_sizing.small =  {height:30, width:30}
  standard_sizing.medium = {height:50, width:50}
  standard_sizing.medium_large = {height:150, width:150}
  standard_sizing.large =  {height:300, width:300}
  return standard_sizing[size]
} 


function ACSImageView(props) {
  const {size="medium", letters="",  avatar=true, img_src, show_blank=true} = props
  if (!show_blank && !img_src && !props.image_object) {
      return null
  }
  let style = Object.assign({},props.style)
  if (style && Object.keys(style).length === 0) {
    style = null
  }
  let image_object=""
  if (props.image_object) {
    try {
      //protecting from bad JSON format
      image_object = JSON.parse(props.image_object)
    } catch {}
  }

  const image_url = img_src?img_src:get_image_url(image_object)
  style = style?style:get_image_dimensions(size)

  let variant="circle"
  if (!avatar || avatar === "false") {
      variant = "square"
  }

  if (!image_url) {
      style.verticalAlign='textTop'
      return (<Avatar variant={variant} style={style}>{letters}</Avatar>)
  } else if (avatar && avatar !=="false") {
    return (
      <Avatar style={style} src={image_url}/>
    )
  } else {
      return (
      <Fragment>
      <img align='left' style={style} src={image_url}/>
      </Fragment>)
    } 
}

export default ACSImageView;
