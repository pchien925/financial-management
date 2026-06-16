import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_TASKS } from '../../../constants/tasksConstants';

// Hàm tạo ID ngẫu nhiên
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const initialState = {
  tasks: [...DEFAULT_TASKS],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Thêm công việc mới
    addTask: (state, action) => {
      const newTask = {
        ...action.payload,
        id: generateId(),
      };
      state.tasks.push(newTask);
    },

    // Cập nhật công việc
    updateTask: (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },

    // Xóa công việc
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
  },
});

// Xuất Actions để Component sử dụng
export const {
  addTask,
  updateTask,
  deleteTask,
} = tasksSlice.actions;

// Xuất Reducer để gắn vào Store
export default tasksSlice.reducer;
