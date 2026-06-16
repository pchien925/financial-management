import { createSlice } from '@reduxjs/toolkit';
import { TRANSACTION_TYPES } from '../../../constants/financeConstants';
import { DEFAULT_TRANSACTIONS } from '../../../constants/financeConstants';

// Hàm tính toán tổng thu, chi, số dư từ danh sách giao dịch
const calculateFinanceSummary = (transactions) => {
  let income = 0;
  let expense = 0;
  transactions.forEach((item) => {
    if (item.type === TRANSACTION_TYPES.INCOME) income += item.amount;
    else if (item.type === TRANSACTION_TYPES.EXPENSE) expense += item.amount;
  });
  return { income, expense, balance: income - expense };
};

// Hàm tạo ID ngẫu nhiên
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const initialSummary = calculateFinanceSummary(DEFAULT_TRANSACTIONS);

const initialState = {
  transactions: [...DEFAULT_TRANSACTIONS],
  income: initialSummary.income,
  expense: initialSummary.expense,
  balance: initialSummary.balance,
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    // Thêm giao dịch mới
    addTransaction: (state, action) => {
      const newTransaction = {
        ...action.payload,
        id: generateId(),
      };
      state.transactions.push(newTransaction);
      const { income, expense, balance } = calculateFinanceSummary(state.transactions);
      state.income = income;
      state.expense = expense;
      state.balance = balance;
    },

    // Cập nhật giao dịch
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
        const { income, expense, balance } = calculateFinanceSummary(state.transactions);
        state.income = income;
        state.expense = expense;
        state.balance = balance;
      }
    },

    // Xóa giao dịch
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter((t) => t.id !== action.payload);
      const { income, expense, balance } = calculateFinanceSummary(state.transactions);
      state.income = income;
      state.expense = expense;
      state.balance = balance;
    },
  },
});

// Xuất Actions để Component sử dụng
export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = financeSlice.actions;

// Xuất Reducer để gắn vào Store
export default financeSlice.reducer;