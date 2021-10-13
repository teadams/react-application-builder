import React, {useState} from 'react';

import ACSDragDropContext from "./ACSDragDropContext.js"
import * as meta from "../Utils/meta.js"
import * as u from "../Utils/utils.js"
import * as control from "../Utils/control.js"
import { DragDropContext } from 'react-beautiful-dnd';

// This exposes the ordering of the keys to 
// lower level components. 
// THerefore, we can have a application wide drag drop experience.
// For example, we can drag something from a app_menu to a wizard menu.
// -- Drop regions must have unique identitfier
// -- Drop registon are identified by type-indentifier 
//    --- Exmpales - menu-hamburger,  wizard-applications


function DragDropContextProvider(props) {
  const [drag_key_orders, setDragKeyOrders] = useState({});
  // drag_key 
    ///    keys will be the identifiers as descripte above 
    ///    values will be the ording of the items in that drop zone
    const onDragEnd = result => {
      const {destination, source, draggableId} = result
      if (!destination) return 
      if (destination.droppableId === source.droppableId && 
          destination.index === source.index) {
          // element has not moved
          return
      }

      const source_info = source.droppableId.split("###")
      const [source_object_type, source_field_name, source_id] = source_info

      const destination_info = destination.droppableId.split("###")
      const [destination_object_type, destination_field_name, destination_id] = source_info

      const source_droppable_items = drag_key_orders[source.droppableId];
      const destination_droppable_items = drag_key_orders[destination.droppableId];

      // REMOVE FROM SOURCE 

      // ADD TO DESTIONATION

      // UPDATE SOURCE ON SERVER 

      // IF SOURCE AND DESTINATION ORE DIFFERENT, UPDATE DESTINATION

      // MARK THINGS DIRECTY

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