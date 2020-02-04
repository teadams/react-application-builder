import React, {Fragment} from 'react';
import {Paper, Typography, Avatar} from '@material-ui/core';

class Image extends React.Component {
  constructor(props) {
        super(props);
  }
  
  get_image_url (object_type, field_name, image_object) {
      if (image_object) {
        return ("/images/" + object_type + "/" + field_name +"/" + image_object.name)
      } else {
        return ""
      }   
  }

  get_resized_image (image_object, size="medium") {
    // resizes the image 
    // image_object contains the native height
    // and width attributes of the image.
    // size will be tiny, small, medium (default),
    // large
    // standard sizing (later can be application
    //  parameters)
    let standard_sizing = {}
    standard_sizing.tiny = {height:20, width:300}
    standard_sizing.small = {height:50, width:50}
    standard_sizing.medium = {height:100, width:100}
    standard_sizing.large = {height:300, width:300}
    
    let resized_dim = standard_sizing[size]
    // algorythm to resize approprialy so image
    // does not get warped
    if (image_object) {
      // To avoid warping, height and width
      // must be divided by the same number.
      // We do not want either the height 
      // width to be bigger than the standard 
      // dimension.  So we will divide both
      // by the largest ratio
      let height_ratio  = image_object.height / standard_sizing[size].height
      let width_ratio  = image_object.width /  standard_sizing[size].width
      if (height_ratio > width_ratio) {
          resized_dim.height = Math.floor(image_object.height / height_ratio)
          resized_dim.width = Math.floor(image_object.width / height_ratio)
       } else {
         resized_dim.height = Math.floor(image_object.height / width_ratio)
         resized_dim.width = Math.floor(image_object.width / width_ratio)
       }
    }
    return resized_dim
  } 

  get_image_dimensions (image_object) {
    
    // Supports the following sizes
    // tiny, small, medium (default), large
    // at a later point in time, the default
    // image dimensions will be an application
    // paramter.
    return this.get_resized_image(image_object, this.props.size)
  } 

//# size - tiny, smail, med, large
//# image object
//# object name
//# field name
  render() {
    let image_url = this.get_image_url(this.props.object_type, this.props.field_name, this.props.image_object)
    let image_dim = {}
    if (this.props.image_object) {
      image_dim = this.get_image_dimensions(this.props.image_object)
    } 

    if (this.props.avatar) {
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
}

export default Image;
