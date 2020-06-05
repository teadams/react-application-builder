import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React, {Fragment} from 'react';
import {Paper, Typography, Avatar} from '@material-ui/core';
import * as u from '../../Utils/utils.js';
import useGetModel from '../../Hooks/useGetModel.js'

// special case 
// called directly (example from ACSFile) 
// Not part of the  List/Row/Field frameowrk
function ACSImage(props) {

  const {size="medium", fix="width", avatar=true, letters=""} = props
  let image_object=""
  if (props.image_object) {
    try {
      //protecting from bad JSON format
      image_object = JSON.parse(props.image_object)
    } catch {}
  }
  function get_image_url (image_object) {
      if (image_object && image_object.path && image_object.name) {
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
    standard_sizing.small =  {height:30, width:30}
    standard_sizing.medium = {height:50, width:50}
    standard_sizing.medium_large = {height:80, width:80}
    standard_sizing.large =  {height:300, width:300}
    
    if (!image_object || !image_object.path || !image_object.name) {
        return standard_sizing[size]
    }
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
  
  const image_url = get_image_url(image_object)

  let image_dim = {}
  image_dim = get_image_dimensions(image_object,size,fix)
  if (!image_object  || !image_object.path || !image_object.name) {
    return (<Avatar style={{'height':image_dim.height, 'width':image_dim.width, verticalAlign:'textTop'}}>{letters}</Avatar>)
  } else if (avatar && avatar !=="false") {
    return (
      <Avatar style={ {'height':image_dim.height, 'width':image_dim.width}} src={image_url}/>
    )
  } else {
      return (
      <Fragment>
      <Avatar variant="square"  style={{ height:image_dim.height, width:image_dim.width}} src={image_url}/>
      </Fragment>)
    } 
}

export default ACSImage;
