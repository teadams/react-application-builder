import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {Fragment} from 'react';
import {Paper, Typography, Avatar} from '@material-ui/core';
import * as u from '../../Utils/utils.js';
import useGetModel from '../../Hooks/useGetModel.js'

function ACSImage(props) {
  const {object_type, field_name, size="medium", fix="none", avatar="false"} = props
  const image_object = JSON.parse(props.image_object)
  function get_image_url (object_type, field_name, image_object) {
      if (image_object) {
        return (image_object.path+ "/" + image_object.name)
      } else {
        return ""
      }   
  }

  function get_image_dimensions (image_object, size="medium", fix="none") {
    // resizes the image 
    // image_object: contains the native height
    // and width attributes of the image.
    
    // size: standard sizes
    // tiny, small, medium (default),large
    
    // Fix: prop specifies resizing appraoch
    // fix = width  - Change the width to match standard_sizing. Change height proportionately
    // fix = height - change the height to match standard_sizing. Change width proportionaliy
    // fix = standard - apply standard sizing, with potnetial warping.
    // fix = none
        // To avoid warping, height and width
        // are resized by the same ratio.
        // Ensure neither hieght or width is 
        // bigger than the standard dimensions.
        // Image will be as big as possible.
        // One dimension will match standard,
        // the other will be short.
        
    // XX app_params
    let standard_sizing = {}
    standard_sizing.tiny =   {height:20, width:20}
    standard_sizing.small =  {height:50, width:50}
    standard_sizing.medium = {height:100, width:100}
    standard_sizing.large =  {height:300, width:300}
    
    let resized_dim = standard_sizing[size]
    // algorythm to resize approprialy so image
    // does not get warped
    if (image_object && fix !== "standard") {
      let height_ratio  = image_object.height / standard_sizing[size].height
      let width_ratio  = image_object.width /  standard_sizing[size].width
      if ( (fix === "none" && (height_ratio > width_ratio)) || (fix === "height") ) {
          resized_dim.height = Math.floor(image_object.height / height_ratio)
          resized_dim.width = Math.floor(image_object.width / height_ratio)
       } else {
         resized_dim.height = Math.floor(image_object.height / width_ratio)
         resized_dim.width = Math.floor(image_object.width / width_ratio)
       }
    }
    
    return resized_dim
  } 

//# size - tiny, smail, med, large
//# image object
//# object name
//# field name
  
  const image_url = get_image_url(object_type,field_name, image_object)

  let image_dim = {}
  if (image_object) {
    image_dim = get_image_dimensions(image_object,size,fix)
  } 

  if (avatar) {
      return (
        <Fragment>
        <Avatar style={ {'height':image_dim.height, 'width':image_dim.width}} src={image_url}/>
        </Fragment>
      )
  } else {
      return (
      <Fragment>
      <img  style={{ height:image_dim.height, width:image_dim.width}} src={image_url}/>
      </Fragment>)
    } 
}

export default ACSImage;
