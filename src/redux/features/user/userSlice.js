import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_USERS } from '../../../constants/userConstants';

// Hàm tạo ID tự tăng dựa trên danh sách hiện tại
const getNextId = (users) => {
  if (users.length === 0) return 1;
  return Math.max(...users.map((e) => e.id)) + 1;
};

const initialState = {
  users: [...DEFAULT_USERS],
  nextId: getNextId(DEFAULT_USERS),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Thêm người dùng mới
    addUser: (state, action) => {
      const newUser = {
        ...action.payload,
        id: state.nextId,
      };
      state.users.push(newUser);
      state.nextId += 1;
    },

    // Cập nhật người dùng
    updateUser: (state, action) => {
      const { id, values } = action.payload;
      const index = state.users.findIndex((emp) => emp.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...values };
      }
    },

    // Xóa người dùng
    deleteUser: (state, action) => {
      state.users = state.users.filter((emp) => emp.id !== action.payload);
    },
  },
});

// Xuất Actions để Component sử dụng
export const {
  addUser,
  updateUser,
  deleteUser,
} = userSlice.actions;

// Xuất Reducer để gắn vào Store
export default userSlice.reducer;
