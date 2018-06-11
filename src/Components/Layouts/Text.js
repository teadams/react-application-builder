import React from 'react';
import { Paper} from '@material-ui/core';
import * as meta from '../../Utils/meta.js'

class Text extends React.Component {
  constructor(props) {
        super(props);
  }

  render() {
    return (
      <div>
       {this.props.title}
       <p/>
       {this.props.text}
      </div>
    )
  }
}

export default Text;
