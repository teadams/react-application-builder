import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as u from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import ACSRowController from './ACSRowController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Chseckbox, Typography, Chip, Grid, MenuItem, TextField, TableContainer, TableHead, TableCell, TableRow, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, TablePagination, Button, Paper, Avatar, TableBody, Table } from '@material-ui/core';

function RenderACSList(props) {
  const {data, rab_component_model} = props
  const {...params} = props
  const {header_wrap:HeaderWrap, header:Header, list_wrap:ListWrap, list_header_wrap:ListHeaderWrap, list_header:ListHeader, body_wrap:BodyWrap, list:RABList, footer_wrap:FooterWrap, footer:Footer,
  list_container:ListContainer, list_pagination:ListPagination} = rab_component_model.list.components 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
     setPage(newPage);
   };
 
  const handleChangeRowsPerPage = (event) => {
     setRowsPerPage(parseInt(event.target.value, 10));
     setPage(0);
  };

    if (data && data.length>0) {
      const count = data.length
      const paginated_data =  data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) 
      params.data=paginated_data
      return ( 
        <Fragment>
          <HeaderWrap {...params}>
            <Header {...params}/>
          </HeaderWrap>
          <ListContainer component={Paper} {...params}>
            <ListWrap size="small" {...params} >
              <ListHeaderWrap {...params}>
                <ListHeader {...params}/>
              </ListHeaderWrap> 
              <BodyWrap {...params}>
                  <RABList {...params}/>
              </BodyWrap>
             </ListWrap>
          </ListContainer>
          <ListPagination
             rowsPerPageOptions={[10, 20, 30]}
             component="div"
             count={count}
             rowsPerPage={rowsPerPage}
             page={page}
             onChangePage={handleChangePage}
             onChangeRowsPerPage={handleChangeRowsPerPage}
           />
        </Fragment>
    )
    } else {
        return <div/>
    }
}

export default RenderACSList;
