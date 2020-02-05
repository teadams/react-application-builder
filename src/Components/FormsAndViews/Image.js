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

  get_image_dimensions (image_object, size="medium", fix="none") {
    // resizes the image 
    // image_object contains the native height
    // and width attributes of the image.
    // size will be tiny, small, medium (default),
    // large
    // standard sizing (later can be application
    //  parameters)

    // Strategies to resize
    // fix = width  - change the width to match standard_sizing.
    //      Change height proportionately
    // fix = height - change the height to matcht standard_sizing
    //      Change width proportionaliy
    // fix = none
            // To avoid warping, height and width
            // must be divided by the same number.
            // We do not want either the height 
            // width to be bigger than the standard 
            // dimension.  So we will divide both
            // by the largest ratio

    let standard_sizing = {}
    standard_sizing.tiny = {height:20, width:20}
    standard_sizing.small = {height:50, width:50}
    standard_sizing.medium = {height:100, width:100}
    standard_sizing.large = {height:300, width:300}
    
    let resized_dim = standard_sizing[size]
    // algorythm to resize approprialy so image
    // does not get warped
    if (image_object) {
      
      let height_ratio  = image_object.height / standard_sizing[size].height
      let width_ratio  = image_object.width /  standard_sizing[size].width
      if ( (fix == "none" && (height_ratio > width_ratio)) || (fix == "height") ) {
          
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
  render() {
    let image_url = this.get_image_url(this.props.object_type, this.props.field_name, this.props.image_object)
    let image_dim = {}
    if (this.props.image_object) {
      image_dim = this.get_image_dimensions(this.props.image_object, this.props.size, this.props.fix)
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
