export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.INCOME]: 'Thu nhập',
  [TRANSACTION_TYPES.EXPENSE]: 'Chi tiêu',
};

// Màu theo loại
export const TRANSACTION_TYPE_COLORS = {
  [TRANSACTION_TYPES.INCOME]: '#52c41a',  // Xanh lá
  [TRANSACTION_TYPES.EXPENSE]: '#ff4d4f', // Đỏ
};

// Danh mục giao dịch
export const CATEGORIES = [
  { value: 'food', label: 'Ăn uống' },
  { value: 'transport', label: 'Di chuyển' },
  { value: 'salary', label: 'Lương' },
  { value: 'shopping', label: 'Mua sắm' },
  { value: 'entertainment', label: 'Giải trí' },
  { value: 'education', label: 'Giáo dục' },
  { value: 'bills', label: 'Hóa đơn' },
  { value: 'other', label: 'Khác' },
];

export const typeOptions = [
  { value: '', label: 'Tất cả' },
  {
    value: TRANSACTION_TYPES.INCOME,
    label: TRANSACTION_TYPE_LABELS[TRANSACTION_TYPES.INCOME],
  },
  {
    value: TRANSACTION_TYPES.EXPENSE,
    label: TRANSACTION_TYPE_LABELS[TRANSACTION_TYPES.EXPENSE],
  },
];


export const DEFAULT_TRANSACTIONS = [
  {
    id: '4',
    note: 'Mua sách React ',
    amount: 300000,
    type: 'expense',
    category: 'education',
    date: '2026-05-30',
    userId: 1,
  },
  {
    id: '5',
    note: 'Freelance thiết kế logo',
    amount: 3000000,
    type: 'income',
    category: 'salary',
    date: '2026-05-28',
    userId: 2,
  },
  {
    id: '6',
    note: 'Tiền điện tháng 5',
    amount: 450000,
    type: 'expense',
    category: 'bills',
    date: '2026-05-25',
    userId: 1,
  },
  {
    id: '8',
    note: 'Mua áo mới',
    amount: 350000,
    type: 'expense',
    category: 'shopping',
    date: '2026-05-20',
    userId: 3,
  },
  {
    id: 'YRhKRrWVwhw',
    note: 'Ăn trưa với đồng nghiệp',
    amount: 1000000,
    type: 'income',
    category: 'food',
    date: '2026-06-19',
    userId: 2,
  },
  {
    id: 'wU7JzewgaZ0',
    note: 'Ăn tối với đồng nghiệp',
    amount: 1000000,
    type: 'expense',
    category: 'food',
    date: '2026-06-19',
    userId: 1,
  },
  {
    id: 'nrc-a8v_8pk',
    note: 'Đi chơi Đà Lạt',
    amount: 3000000,
    type: 'expense',
    category: 'entertainment',
    date: '2026-06-13',
    userId: 3,
  },
  {
    id: 'HkMetrt5cDQ',
    note: 'Cài win dạo',
    amount: 500000,
    type: 'income',
    category: 'bills',
    date: '2026-06-08',
    userId: 1,
  },
  {
    id: 'fBTWgvcbZ98',
    note: 'Đi siêu thị',
    amount: 1000000,
    type: 'expense',
    category: 'shopping',
    date: '2026-06-08',
    userId: 2,
  },
  {
    id: 'rCWwqNL_beI',
    note: 'Ăn sáng',
    amount: 40000,
    type: 'expense',
    category: 'food',
    date: '2026-06-09',
    userId: 1,
  },
];