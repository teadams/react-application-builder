import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useState} from 'react';
import {ACSTabMenu} from '../ACSLibrary';

import DrawerMenu from './DrawerMenu';
import {ContextSelect, Auth, AuthToggleLink} from '../Modules/User';
import MessageIcon from "./MessageIcon.js"
import Debug from "./Debug.js"
import * as u from '../Utils/utils.js'

import {AppBar,Toolbar, Typography} from '@material-ui/core';
import useGetModel from "../Hooks/useGetModel.js"
import useDragDropZone from "../Hooks/useDragDropZone.js"

import AuthContext from '../Modules/User/AuthContext';
import ACSDragDropContext from '../Template/ACSDragDropContext';

///**
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage' },
    'task-2': { id: 'task-2', content: 'Watch my favorite show' },
    'task-3': { id: 'task-3', content: 'Charge my phone' },
    'task-4': { id: 'task-4', content: 'Cook dinner' },
  },
  columns: {
    'column1': {
      id: 'column1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column1'],
};



function Task(props) {
  return (<div style={{border:"1px solid lightgrey", borderRadius:"2px", padding:"8px", marginBottom:"8px"}}>{props.task.content}</div>)
  
}


const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
`;


function Column(props) {
    return (
      <Container>
        <Title>{props.column.title}</Title>
        <TaskList>
          {props.tasks.map(task => <Task key={task.id} task={task} />)}
        </TaskList>
      </Container>
    );
}

const persist_function = (key_order) => {
  u.a("new_key order", key_order)
}

function Template(props) {
  const context = useContext(AuthContext)
  const [drop_key_order, setKeyOrder] = useDragDropZone("column1", "object_type","field_name", initialData.columns.column1.taskIds)

  const app_params =  useGetModel("app_params")
  const menu_model = useGetModel("menus")
  const [open,setOpen] = useState(true);
//****
  const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
      height:'100%'
    },
    root: {
      backgroundColor:app_params.colors.template_header,
      minHeight:0
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    context: {
       position: 'relative',
       display:'flex',
       borderRadius: theme.shape.borderRadius,
       width: '100%',
       [theme.breakpoints.up('sm')]: {
         marginLeft: theme.spacing(3),
         width: 'auto',
       },
     },
     inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
      },
    sectionDesktop: {
       display: 'none',
       alignItems:'center',
       [theme.breakpoints.up('md')]: {
         display: 'flex',
       },
     },
     sectionMobile: {
       display: 'flex',
       [theme.breakpoints.up('md')]: {
         display: 'none',
       },
     },
  }))
  const classes = useStyles();
  const handleClose = (event => {
        setOpen(false)
  })

  const handleChange = (event => {
        setOpen(true)
  })

  let {component_name, selected_menu, object_type, id, menu_type, field_name } = props.match.params
  id = parseInt(id);
  if (object_type === "core_subsite" && id) {
    context.setContextId(id);
  }
  if (!selected_menu && !component_name) {
    selected_menu =  menu_model.menus.app_menu[0]
  }

  return    ( 
    <div id="tall" className={classes.grow}>
      <AppBar position="static">
      <Toolbar className={classes.root}>
          <Auth auth_scope="site" auth_priv="admin" prompt_login={false}>
            <DrawerMenu menu_type="hamburger" selected_menu={selected_menu} />
          </Auth>
          <Typography className={classes.title} variant="h6" noWrap>{app_params.name}</Typography>
          <div className={classes.grow} />

          <div className={classes.context}>
          <Auth auth_scope="site" auth_priv="member" prompt_login={false}>
            <ContextSelect/>
          </Auth>
          </div>
          <div className={classes.sectionDesktop}>
              <MessageIcon/>
              <AuthToggleLink></AuthToggleLink>
              </div>
      </Toolbar>
      </AppBar>

      <ACSTabMenu menu_type="app_menu" selected_menu={selected_menu} object_type={object_type} id={id} field_name={field_name} onChange={handleChange} component_name={component_name} field_name={field_name} />


      {drop_key_order && initialData.columnOrder.map(columnId => {
           const column = initialData.columns[columnId];
           const tasks = drop_key_order.map(taskId => initialData.tasks[taskId]);
           return <Column key={column.id} column={column} tasks={tasks} />;
         })};

    <Debug/> 
    </div>

  )
}

//<TabMenu menu_type="app_menu" selected_menu={selected_menu} object_type={object_type} id={id} onChange={handleChange} />
//<Body  selected_menu={selected_menu} open={open} onClose={handleClose} component_name={component_name} object_type={object_type} id={id} field_name={field_name} menu_type={menu_type}/>


export default Template;



