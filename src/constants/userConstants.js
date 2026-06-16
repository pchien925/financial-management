// Nghề nghiệp
export const DEPARTMENTS = [
  { value: 'engineering', label: 'Kỹ thuật' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hr', label: 'Nhân sự' },
  { value: 'finance', label: 'Tài chính' },
  { value: 'sales', label: 'Kinh doanh' },
  { value: 'design', label: 'Thiết kế' },
];

// Trạng thái người dùng
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Hoạt động',
  [USER_STATUS.INACTIVE]: 'Không hoạt động',
};

export const USER_STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: '#52c41a',
  [USER_STATUS.INACTIVE]: '#ff4d4f',
};


export const statusOptions = [
  { value: '', label: 'Tất cả' },
  {
    value: USER_STATUS.ACTIVE,
    label: USER_STATUS_LABELS[USER_STATUS.ACTIVE],
  },
  {
    value: USER_STATUS.INACTIVE,
    label: USER_STATUS_LABELS[USER_STATUS.INACTIVE],
  },
];

// 3 dữ liệu mẫu mặc định
export const DEFAULT_USERS = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@company.com',
    phone: '0901234567',
    occupation: 'engineering',
    position: 'Senior Developer',
    status: 'active',
    joinDate: '2023-03-15',
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    email: 'tranthivinh@company.com',
    phone: '0912345678',
    occupation: 'marketing',
    position: 'Marketing Manager',
    status: 'active',
    joinDate: '2022-08-20',
  },
  {
    id: 3,
    name: 'Lê Hoàng Cường',
    email: 'lehoangcuong@company.com',
    phone: '0923456789',
    occupation: 'hr',
    position: 'HR Specialist',
    status: 'inactive',
    joinDate: '2021-01-10',
  },
];
