import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { PlusOutlined } from '@ant-design/icons';
import BoardCard from './BoardCard';
import styles from './TaskBoard.module.scss';
import { useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  themTaskVaoTitle: {
    defaultMessage: 'Thêm task vào {title}'
  }
});


function BoardColumn({ columnId, title, tasks, onAddClick, onDeleteTask }) {
  const intl = useIntl();
  // useDroppable giúp dnd-kit hiểu đây là một "vùng chứa" có thể thả thẻ vào
  // Rất quan trọng khi kéo thẻ vào một cột ĐANG TRỐNG không có thẻ nào
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <div className={styles.boardColumn}>
      <div className={styles.columnHeader}>
        <span className={styles.title}>
          {title} <span className={styles.taskCount}>({tasks.length})</span>
        </span>
        {columnId === 'todo' && (
          <span
            onClick={() => onAddClick(columnId)}
            className={styles.addButton}
            title={intl.formatMessage(messages.themTaskVaoTitle, { title })}
          >
            <PlusOutlined />
          </span>
        )}
      </div>

      {/* Bao bọc khu vực chứa thẻ bằng SortableContext */}
      <SortableContext
        id={columnId}
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className={styles.droppableArea}>
          {tasks.map((task) => (
            <BoardCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default BoardColumn;