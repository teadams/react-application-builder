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

  get_image_dimensions (image_object) {
    let image_dim = {}
    // figure out the size (smal, etc)

    // ratios 
    image_dim.height = 150;
    image_dim.width = 150;  
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
