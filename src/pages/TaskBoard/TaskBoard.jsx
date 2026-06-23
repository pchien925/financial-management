import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import BoardColumn from './BoardColumn';
import TasksForm from '../Tasks/TasksForm';
import { addTask, updateTask, deleteTask, setTasks } from '../../redux/features/tasks/tasksSlice';
import { COLUMNS } from '../../constants/tasksConstants';
import dayjs from 'dayjs';
import styles from './TaskBoard.module.scss';

function TaskBoard() {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);

  // State cho Modal thêm task
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [addingToStatus, setAddingToStatus] = useState('todo');

  // Cấu hình cảm biến cho dnd-kit, kích hoạt khi di chuyển chuột 5px
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Logic xử lý khi thẻ ĐANG bay lướt qua các cột
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);

    if (activeIndex === -1) return;

    const activeTask = tasks[activeIndex];
    const activeColumn = activeTask.status;

    const isOverTask = overIndex !== -1;
    const overColumn = isOverTask ? tasks[overIndex].status : overId;

    // Kéo trong cùng 1 cột thì bỏ qua trong DragOver, sẽ xử lý ở DragEnd
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }

    // Kéo sang cột khác -> đổi status và vị trí tạm thời
    const newTasks = [...tasks];
    newTasks[activeIndex] = { ...activeTask, status: overColumn };
    const dropIndex = isOverTask ? overIndex : newTasks.length - 1;

    const reorderedTasks = arrayMove(newTasks, activeIndex, dropIndex);
    dispatch(setTasks(reorderedTasks));
  };

  // Logic xử lý khi BUÔNG CHUỘT
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      const reorderedTasks = arrayMove(tasks, activeIndex, overIndex);
      dispatch(setTasks(reorderedTasks));
      
      const movedTask = reorderedTasks.find(t => t.id === activeId);
      if (movedTask) {
        dispatch(updateTask(movedTask));
      }
    } else {
      // Dù kéo vào cột trống hay click nhầm, đảm bảo cập nhật task nếu status đã thay đổi
      const movedTask = tasks.find(t => t.id === activeId);
      if (movedTask) {
        dispatch(updateTask(movedTask));
      }
    }
  };

  const handleAddClick = (columnId) => {
    setAddingToStatus(columnId);
    setIsAddFormOpen(true);
  };

  const handleAddTask = (newTask) => {
    dispatch(addTask({
      ...newTask,
      status: addingToStatus,
      createdAt: dayjs().format('YYYY-MM-DD'),
    }));
    setIsAddFormOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.taskBoardContainer}>
          {COLUMNS.map((col) => (
            <BoardColumn
              key={col.id}
              columnId={col.id}
              title={col.title}
              tasks={tasks.filter((t) => t.status === col.id)}
              onAddClick={handleAddClick}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </DndContext>

      <TasksForm
        open={isAddFormOpen}
        onCancel={() => setIsAddFormOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  );
}

export default TaskBoard;