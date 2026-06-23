// DragableRow.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function DragableRow({ children, ...props }) {
  const taskId = props['data-row-key'];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: taskId });

  // Tính toán style cho hàng khi đang kéo
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { opacity: 0.6, zIndex: 9999, background: '#fafafa' } : {}),
  };

  // Inject các sự kiện drag (attributes, listeners) vào hàng
  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </tr>
  );
}

export default DragableRow;