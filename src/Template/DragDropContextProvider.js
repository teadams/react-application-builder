import React, {useState, useContext} from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import _ from 'lodash/object'


import * as meta from "../Utils/meta.js"
import * as u from "../Utils/utils.js"
import * as api from '../Utils/data.js';

import ACSDragDropContext from "./ACSDragDropContext.js"
import {AuthContext} from '../Modules/User';
import useGetModel from '../Hooks/useGetModel';


// This exposes the ordering of the keys to 
// lower level components. 
// THerefore, we can have a application wide drag drop experience.
// For example, we can drag something from a app_menu to a wizard menu.
// -- Drop regions must have unique identitfier
// -- Drop registon are identified by type-indentifier 
//    --- Exmpales - menu-hamburger,  wizard-applications


function DragDropContextProvider(props) {
  // drag_key 
  ///    keys will be the identifiers as descripte above 
  ///    values will be the ording of the items in that drop zone
  const [drag_key_orders, setDragKeyOrders] = useState({});
  const context = useContext(AuthContext)
  let object_models =  useGetModel("object_types")


   function onDragEnd(result)  {
      const {destination, source, draggableId} = result
      if (!destination) return 
      if (destination.droppableId === source.droppableId && 
          destination.index === source.index) {
          // element has not moved
          return
      }

      const source_info = source.droppableId.split("_###_")
      const [source_object_type, source_field_name, source_id] = source_info

      const destination_info = destination.droppableId.split("_###_")
      const [destination_object_type, destination_field_name, destination_id] = destination_info

      // prevent mutation of state
      const source_droppable_items = _.merge([],drag_key_orders[source.droppableId]);
  
      let destination_droppable_items = []
      if (destination.droppableId !== source.droppableId) {
            destination_droppable_items = _.merge([],drag_key_orders[destination.droppableId]); 
      } else {
          destination_droppable_items = source_droppable_items
      }

      // Remove from source
      source_droppable_items.splice(source.index, 1);
      // ADD TO DESTIONATION
      destination_droppable_items.splice(destination.index, 0, draggableId);

      let source_data = {}
      source_data[source_field_name] = source_droppable_items
      const source_object_model = object_models[source_object_type]
      const options = {path:source_object_model.base_api_path}

      let order_updates = {}
      order_updates[source.droppableId] = source_droppable_items;
      order_updates[destination.droppableId] = destination_droppable_items;

      const new_drag_key_orders = _.merge({}, drag_key_orders,order_updates);
      setDragKeyOrders(new_drag_key_orders)

      api.updateMappingOrder(source_object_type, source_id, source_field_name, source_data,  context, options)
      // IF SOURCE AND DESTINATION ORE DIFFERENT, UPDATE DESTINATION
      if (destination.droppableId !== source.droppableId) {
        let destination_data = {}
        destination_data[destination_field_name] = destination_droppable_items
        const destination_object_model = object_models[destination_object_type]
        const destination_options = {path:destination_object_model.base_api_path}
        api.updateMappingOrder(destination_object_type, destination_id, destination_field_name, destination_data,  context, destination_options)
      }

     };

    return (
      <ACSDragDropContext.Provider
          value={{
          drag_key_orders:drag_key_orders,
          setKeyOrder: (drop_identifier, key_order) => {
            setDragKeyOrders({...drag_key_orders, [drop_identifier]:key_order})
          }
        }}>
        <DragDropContext onDragEnd={onDragEnd}> 
          {props.children}
        </DragDropContext>
      </ACSDragDropContext.Provider>)
}

export default DragDropContextProvider