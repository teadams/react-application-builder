
import React, {useState, useLayoutEffect, useContext} from 'react';
import * as api from '../Utils/data.js';
import * as meta from '../Utils/meta.js';
import * as log from '../Utils/log.js';
import * as u from '../Utils/utils.js';
import ACSDragDropContext from '../Template/ACSDragDropContext';


const useDragDropZone = (drop_identifier, object_type, field_name, initial_key_order) => {
  const drop_context = useContext(ACSDragDropContext)
  const drop_key_order = drop_context.drag_key_orders[drop_identifier];

  const [prior_key_order, setPriorKeyOrder] = useState()

  if (!prior_key_order && initial_key_order) {
    drop_context.setKeyOrder(drop_identifier,initial_key_order)
    setPriorKeyOrder(initial_key_order)
  }

  // only run whne drop_key_order changes
  useLayoutEffect( () => {
    if (JSON.stringify(drop_key_order) !== JSON.stringify(prior_key_order)) {
        /// Was updated from DragDrop Beutiful
        setPriorKeyOrder(prior_key_order)
        // data data.persisResort(key_order, object_type, field_name)
    }
  }, drop_key_order);

  const setKeyOrder = (key_order) => {
      // used to set initial key order from database
      if (JSON.stringify(key_order) !== JSON.stringify(drop_key_order)) {
        // no need to set if it matches the context
        drop_context.setKeyOrder(drop_identifier, key_order)
      }
  }

  return [drop_key_order, setKeyOrder];
}

export default useDragDropZone;