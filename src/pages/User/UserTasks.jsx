import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import TasksTable from '../Tasks/TasksTable';
import TasksForm from '../Tasks/TasksForm';
import TasksUpdateModal from '../Tasks/TasksUpdateModal';
import styles from './User.module.scss';
import dayjs from 'dayjs';
import { DAYS_OF_WEEK } from '../../constants/tasksConstants';
import { addTask, updateTask, deleteTask } from '../../redux/features/tasks/tasksSlice';
import {useSearchParams} from 'react-router-dom';

function UserTasks() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.user);

  const user = users.find((u) => u.id === Number(id));

  const [searchParams, setSearchParams] = useSearchParams();
  const activeDay = searchParams.get('day') || '2';

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => t.userId === Number(id) && t.dayOfWeek === activeDay);
  }, [tasks, id, activeDay]);

  const handleTabChange = (key) => {
    setSearchParams({ day: key });
  };

  const handleAddTask = (newTask) => {
    dispatch(addTask({ ...newTask, createdAt: dayjs().format('YYYY-MM-DD'), dayOfWeek: activeDay, userId: Number(id) }));
    setIsAddFormOpen(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateTask = (updatedTask) => {
    dispatch(updateTask(updatedTask));
    setIsUpdateModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const tabItems = DAYS_OF_WEEK.map((day) => ({
    key: day.value,
    label: day.label,
  }));

  if (!user) {
    return <p>Không tìm thấy người dùng!</p>;
  }

  return (
    <div className={styles.userWrapper}>
      <div className={styles.toolbar}>
        <h2 className={styles.pageTitle}>Công việc của: {user.name}</h2>
      </div>

      <Tabs
        activeKey={activeDay}
        onChange={handleTabChange}
        items={tabItems}
        className={styles.dayTabs}
        tabBarExtraContent={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddFormOpen(true)}
          >
            Thêm công việc
          </Button>
        }
      />

      <TasksTable
        dataSource={filteredTasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        hideUserColumn
      />

      <TasksForm
        open={isAddFormOpen}
        onCancel={() => setIsAddFormOpen(false)}
        onSubmit={handleAddTask}
        lockedUserId={Number(id)}
      />

      <TasksUpdateModal
        open={isUpdateModalOpen}
        task={editingTask}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleUpdateTask}
        daysOfWeek={DAYS_OF_WEEK}
        lockedUserId={Number(id)}
      />
    </div>
  );
}

export default UserTasks;
