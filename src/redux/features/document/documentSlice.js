import { createSlice } from '@reduxjs/toolkit';

// Hàm tạo ID ngẫu nhiên
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const initialState = {
  documents: [],
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    // Thêm tài liệu mới
    addDocument: (state, action) => {
      const newDocument = {
        ...action.payload,
        id: generateId(),
      };
      state.documents.push(newDocument);
    },

    // Cập nhật tài liệu
    updateDocument: (state, action) => {
      const { id, values } = action.payload;
      const index = state.documents.findIndex((d) => d.id === id);
      if (index !== -1) {
        state.documents[index] = { ...state.documents[index], ...values };
      }
    },

    // Xóa tài liệu
    deleteDocument: (state, action) => {
      state.documents = state.documents.filter((d) => d.id !== action.payload);
    },
  },
});

// Xuất Actions để Component sử dụng
export const {
  addDocument,
  updateDocument,
  deleteDocument,
} = documentSlice.actions;

// Xuất Reducer để gắn vào Store
export default documentSlice.reducer;
