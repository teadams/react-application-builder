import React from 'react';
import { Paper, Tabs} from '@material-ui/core';
import {Tab} from "material-ui/Tabs";
import * as meta from '../../Utils/meta.js'


class MenuBar extends React.Component {
  constructor(props) {
        super(props);
  }

  render() {
    return (
      <Paper>
        <Tabs
          value={this.props.value}
          onChange={this.props.onChange}
          indicatorColor="primary"
          textColor="primary"
          centered
       >
       {meta.get_menu("app_menu").map(menu=> {
          return <Tab key={menu.index} label={menu.label}/>
       })}
        </Tabs>
      </Paper>
    )
  }
}

export default MenuBar;
