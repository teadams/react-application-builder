import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
//import * as u from '../Utils/utils.js';

function Message(props) {
  return (props.message + "...." +props.data.first_name)
}

export default Message;
