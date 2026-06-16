import { configureStore } from '@reduxjs/toolkit';
import financeReducer from '../features/finance/financeSlice';
import userReducer from '../features/user/userSlice';
import documentReducer from '../features/document/documentSlice';

export const store = configureStore({
  reducer: {
    finance: financeReducer,
    user: userReducer,
    document: documentReducer,
  },
});