import React, {Fragment} from 'react';
import {Paper, Typography, Avatar} from '@material-ui/core';

class Image extends React.Component {
  constructor(props) {
        super(props);
  }
  
  get_image_url (object_type, field_name, image_object) {
  //  alert ("in image Url")
      return ("/images/" + object_type + "/" + field_name +"/" + image_object.name)
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
    standard_sizing.tiny = {height:50, width:50}
    standard_sizing.small = {height:100, width:100}
    standard_sizing.medium = {height:200, width:200}
    standard_sizing.large = {height:300, width:300}
    return standard_sizing[size]
  } 

  get_image_dimensions (image_object) {
    let image_dim = {}
    // Supports the following sizes
    // tiny, small, medium (default), large
    // at a later point in time, the default
    // image dimensions will be an application
    // paramter.
    image_dim = this.get_resized_image(image_dim)
    return image_dim
  } 

//# size - tiny, smail, med, large
//# image object
//# object name
//# field name
  render() {

//    alert ('props are ' + JSON.stringify(this.props))
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
