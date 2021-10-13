import React, {useState, useContext} from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

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

  const onDragEnd = result => {
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
      const [destination_object_type, destination_field_name, destination_id] = source_info

      const source_droppable_items = drag_key_orders[source.droppableId];
      const destination_droppable_items = drag_key_orders[destination.droppableId];

      let source_data = {}
      source_data[source_field_name] = source_droppable_items
      const source_object_model = object_models[source_object_type]
      const options = {path:source_object_model.base_api_path}
      // REMOVE FROM SOURCE 
      // ADD TO DESTIONATION
      api.updateMappingOrder(source_object_type, source_id, source_field_name, source_data,  context, options)
      // IF SOURCE AND DESTINATION ORE DIFFERENT, UPDATE DESTINATION

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