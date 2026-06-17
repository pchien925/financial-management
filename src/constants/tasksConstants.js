// Danh sách các thứ trong tuần
export const DAYS_OF_WEEK = [
  { value: '2', label: 'Thứ 2' },
  { value: '3', label: 'Thứ 3' },
  { value: '4', label: 'Thứ 4' },
  { value: '5', label: 'Thứ 5' },
  { value: '6', label: 'Thứ 6' },
  { value: '7', label: 'Thứ 7' },
  { value: '8', label: 'Chủ nhật' },
];

export const COLUMNS = [
  { id: 'todo', title: 'Cần làm' },
  { id: 'inProgress', title: 'Đang làm' },
  { id: 'done', title: 'Đã xong' },
];


// Dữ liệu công việc mẫu
export const DEFAULT_TASKS = [
  // User 1: Nguyễn Văn An
  { id: 1, userId: 1, name: 'Làm báo cáo tuần', expectedTime: 45, createdAt: '2026-06-16', dayOfWeek: '2', status: 'todo' },
  { id: 2, userId: 1, name: 'Họp team', expectedTime: 90, createdAt: '2026-06-16', dayOfWeek: '2', status: 'todo' },
  { id: 3, userId: 1, name: 'Lên kế hoạch dự án', expectedTime: 60, createdAt: '2026-06-16', dayOfWeek: '3', status: 'todo' },
  { id: 4, userId: 1, name: 'Review code', expectedTime: 30, createdAt: '2026-06-16', dayOfWeek: '4', status: 'todo' },
  { id: 5, userId: 1, name: 'Viết tài liệu', expectedTime: 120, createdAt: '2026-06-16', dayOfWeek: '4', status: 'todo' },
  { id: 6, userId: 1, name: 'Gặp khách hàng', expectedTime: 150, createdAt: '2026-06-16', dayOfWeek: '5', status: 'todo' },
  { id: 7, userId: 1, name: 'Fix bug', expectedTime: 45, createdAt: '2026-06-16', dayOfWeek: '6', status: 'todo' },
  { id: 8, userId: 1, name: 'Kiểm thử tính năng', expectedTime: 60, createdAt: '2026-06-16', dayOfWeek: '7', status: 'todo' },
  { id: 9, userId: 1, name: 'Nghiên cứu công nghệ mới', expectedTime: 90, createdAt: '2026-06-16', dayOfWeek: '8', status: 'todo' },

  // User 2: Trần Thị Bình
  { id: 10, userId: 2, name: 'Đào tạo nhân sự', expectedTime: 120, createdAt: '2026-06-16', dayOfWeek: '2', status: 'todo' },
  { id: 11, userId: 2, name: 'Phỏng vấn ứng viên', expectedTime: 60, createdAt: '2026-06-16', dayOfWeek: '3', status: 'todo' },
  { id: 12, userId: 2, name: 'Họp team', expectedTime: 45, createdAt: '2026-06-16', dayOfWeek: '3', status: 'todo' },
  { id: 13, userId: 2, name: 'Review code', expectedTime: 30, createdAt: '2026-06-16', dayOfWeek: '4', status: 'todo' },
  { id: 14, userId: 2, name: 'Fix bug', expectedTime: 90, createdAt: '2026-06-16', dayOfWeek: '5', status: 'todo' },
  { id: 15, userId: 2, name: 'Viết tài liệu', expectedTime: 60, createdAt: '2026-06-16', dayOfWeek: '6', status: 'todo' },
  { id: 16, userId: 2, name: 'Làm báo cáo tuần', expectedTime: 45, createdAt: '2026-06-16', dayOfWeek: '7', status: 'todo' },
  { id: 17, userId: 2, name: 'Lên kế hoạch dự án', expectedTime: 150, createdAt: '2026-06-16', dayOfWeek: '8', status: 'todo' },

  // User 3: Lê Hoàng Cường
  { id: 18, userId: 3, name: 'Gặp khách hàng', expectedTime: 150, createdAt: '2026-06-16', dayOfWeek: '2', status: 'todo' },
  { id: 19, userId: 3, name: 'Làm báo cáo tuần', expectedTime: 60, createdAt: '2026-06-16', dayOfWeek: '3', status: 'todo' },
  { id: 20, userId: 3, name: 'Kiểm thử tính năng', expectedTime: 45, createdAt: '2026-06-16', dayOfWeek: '4', status: 'todo' },
  { id: 21, userId: 3, name: 'Họp team', expectedTime: 90, createdAt: '2026-06-16', dayOfWeek: '4', status: 'todo' },
  { id: 22, userId: 3, name: 'Review code', expectedTime: 30, createdAt: '2026-06-16', dayOfWeek: '5', status: 'todo' },
  { id: 23, userId: 3, name: 'Fix bug', expectedTime: 120, createdAt: '2026-06-16', dayOfWeek: '6', status: 'todo' },
  { id: 24, userId: 3, name: 'Phỏng vấn ứng viên', expectedTime: 60, createdAt: '2026-06-16', dayOfWeek: '7', status: 'todo' },
  { id: 25, userId: 3, name: 'Nghiên cứu công nghệ mới', expectedTime: 90, createdAt: '2026-06-16', dayOfWeek: '8', status: 'todo' },
];
