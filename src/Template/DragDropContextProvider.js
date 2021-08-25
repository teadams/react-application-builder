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
       // TODO: reorder our column
      u.a("Drag ending with drag_key", drag_key_orders)
     };

    return (
      <ACSDragDropContext.Provider
        value={{drag_key_orders:drag_key_orders,
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