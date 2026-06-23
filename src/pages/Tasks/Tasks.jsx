import { useState, useMemo } from 'react';
import { Button, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import TasksTable from './TasksTable';
import TasksForm from './TasksForm';
import TasksUpdateModal from './TasksUpdateModal';
import styles from './Tasks.module.scss';
import dayjs from 'dayjs';
import { DAYS_OF_WEEK } from '../../constants/tasksConstants';
import { addTask, updateTask, deleteTask, reorderTasks } from '../../redux/features/tasks/tasksSlice';
import { useSearchParams } from 'react-router-dom';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';


const messages = defineMessages({
  quanLyCongViec: {
    defaultMessage: 'Quản lý công việc'
  },
  themCongViec: {
    defaultMessage: 'Thêm công việc'
  }
});


function Tasks() {
  const dispatch = useDispatch();
  const intl = useIntl();
  const translatedDaysOfWeek = DAYS_OF_WEEK.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value}`, defaultMessage: item.label?.defaultMessage || item.label || item.value }) }));
  const { tasks } = useSelector((state) => state.tasks);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeDay = searchParams.get('day') || '2';

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Tạo tab items dựa trên DAYS_OF_WEEK và tasks
  // Sử dụng useMemo để tránh tính toán lại không cần thiết khi tasks thay đổi
  const tabItems = useMemo(() => {
    return translatedDaysOfWeek.map((day) => ({
      key: day.value,
      label: day.label,
      children: (
        <TasksTable
          dataSource={tasks.filter((t) => t.dayOfWeek === day.value)}
          onEdit={(task) => {
            setEditingTask(task);
            setIsUpdateModalOpen(true);
          }}
          onDelete={(taskId) => dispatch(deleteTask(taskId))}
          onReorder={(activeId, overId) => dispatch(reorderTasks({ activeId, overId }))}
      />
    ),
  }));
}, [tasks, dispatch, translatedDaysOfWeek])

  // Cập nhật URL khi thay đổi tab
  const handleTabChange = (key) => {
    setSearchParams({ day: key });
  };

  const handleAddTask = (newTask) => {
    dispatch(addTask({ ...newTask, createdAt: dayjs().format('YYYY-MM-DD'), dayOfWeek: activeDay, status: 'todo' }));
    setIsAddFormOpen(false);
  };

  const handleUpdateTask = (updatedTask) => {
    dispatch(updateTask(updatedTask));
    setIsUpdateModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className={styles.tasksWrapper}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}><FormattedMessage {...messages.quanLyCongViec}  /></h2>
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
            <FormattedMessage {...messages.themCongViec}  />
          </Button>
        }
      />
      </div>

    <TasksForm
      open={isAddFormOpen}
      onCancel={() => setIsAddFormOpen(false)}
      onSubmit={handleAddTask}
    />

      <TasksUpdateModal
        open={isUpdateModalOpen}
        task={editingTask}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleUpdateTask}
        daysOfWeek={translatedDaysOfWeek}
      />
  </div>
);
}

export default Tasks;
