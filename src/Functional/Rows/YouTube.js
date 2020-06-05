import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment} from 'react';
import {Paper, Typography, Avatar} from '@material-ui/core';

class YouTube extends React.Component {
  constructor(props) {
        super(props);
  }
  
  extract_key (initial_url) {
    // URLS from the YouTube Share button have format
    // https://youtu.be/_Ett1KsKQi4
    // Embedded format is https://www.youtube.com/embed/_Ett1KsKQi4
    // This function with extract the key from the shared format
    // Note - Future upgrade may do this upon creation
    let key = initial_url.replace("https://youtu.be/","")
    return key
  }

  render() {
      let key = this.extract_key(this.props.initial_url) 
      let src = "https://www.youtube.com/embed/"+key+"?start=4&autoplay=0"
      return (
        <Fragment>
        <center>
        <iframe width="560" height="315"  frameborder="0" src={src} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </center>
        </Fragment>
      )
  }
}

export default YouTube;
