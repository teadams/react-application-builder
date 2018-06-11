import React from 'react';
import { Paper, Tabs} from '@material-ui/core';
import {Tab} from "material-ui/Tabs";


export default props =>
   <div>
     <Paper >
        <Tabs
          value={0}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Powered by React ACS AppBuilder" />
        </Tabs>
      </Paper>

  </div>
