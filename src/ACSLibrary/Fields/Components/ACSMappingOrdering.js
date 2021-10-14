import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../../Utils/utils.js'
import {Draggable, Droppable} from 'react-beautiful-dnd';
import styled from 'styled-components'
import React, {useContext} from 'react';
import ACSDragDropContext from '../../../Template/ACSDragDropContext.js';


const DroppableContainer = styled.div`
  flex-direction:column;
  display:flex;
  flexWrap:true;
  border:solid;
`
const DraggableContainer = styled.div`
  margin: 10px;
  border:solid;
`;


function ACSMappingOrdering(props)  {
  const {object_type, mode,  field_name, field_list, num_add=3, allow_add=true, data, allow_save=false,field_model, valid_values,
  formAttributes=[],form_field_name=props.field_name, pretty_name,onChange,row_data,...params} = props

  const drag_drop_context = useContext(ACSDragDropContext)
  let mapping_order = [];

  if (!data) return null


  const droppableId = `${field_model.object_type}_###_${field_name}_###_${row_data.id}`
  const drag_key_order = drag_drop_context.drag_key_orders[droppableId]

  let ordered_data = []
  // Context has not been set up for this droppable
  if (!drag_key_order) {
    data.map((row,index) => {
     mapping_order.push(row.id)
    })
    drag_drop_context.setKeyOrder(droppableId,mapping_order)
    ordered_data = data;
    return null
  } 

  for (let element of drag_key_order) {
        const next_row = data.find ((row) => row.id === element);
        ordered_data.push(next_row);
  }
  


  return (
        <Droppable droppableId={droppableId}>
          {provided => (
              <DroppableContainer key={droppableId} ref={provided.innerRef} {...provided.droppableProps}>

              {ordered_data.map((row,index) => 

                  <Draggable key={row.id} draggableId={row.id} index={index}>

                    {provided => (
                      <DraggableContainer row={row} field_name={field_name}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      > 
                        
                        {row[field_name]}
                        
                      </DraggableContainer>
                    )}         
 
                  </Draggable>
              )}

               {provided.placeholder}
            </DroppableContainer>
          )}
      </Droppable>
  )
}
export default ACSMappingOrdering;


