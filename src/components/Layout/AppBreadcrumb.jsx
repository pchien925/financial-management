import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import styles from './AppBreadcrumb.module.scss';

const breadcrumbNameMap = {
  '/dashboard/finance': 'Thống kê Tài Chính',
  '/dashboard/user': 'Thống kê Người Dùng',
  '/transactions': 'Giao dịch',
  '/transactions/add': 'Thêm Giao dịch',
  '/transactions/edit': 'Chỉnh sửa Giao dịch',
  '/users': 'Người dùng',
  '/users/add': 'Thêm Người dùng',
  '/users/edit': 'Chỉnh sửa Người dùng',
  '/users/:id/details': 'Danh sách chi tiêu',
  '/users/:id/details/add': 'Thêm Chi Tiêu',
  '/users/:id/tasks': 'Danh sách công việc',
  '/tasks': 'Công việc',
  '/taskboard': 'Bảng công việc',
};

const AppBreadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);

  if (pathSnippets.length === 0) {
    return null;
  }

  const breadcrumbItems = [];
  let currentUrl = '';

  pathSnippets.forEach((snippet) => {
    currentUrl += `/${snippet}`;

    // Kiểm tra xem đoạn này có phải là ID không (Ví dụ: ID là số "1", "12")
    // (Nếu ID của bạn có cả chữ cái, đổi thành đoạn check phù hợp, VD: snippet.length > 20)
    const isId = /^\d+$/.test(snippet); 

    if (isId) {
      // Bỏ qua, không lưu số ID vào mảng hiển thị Breadcrumb
      return; 
    }

    // Biến đổi URL thực tế thành Pattern. 
    // VD: /users/1/transactions -> /users/:id/transactions
    const urlPattern = currentUrl.replace(/\/\d+/g, '/:id');

    // Lấy tên từ Map dựa trên Pattern hoặc URL gốc
    let breadcrumbName = breadcrumbNameMap[urlPattern] || breadcrumbNameMap[currentUrl];

    // Xử lý fallback cho nhánh Edit (VD: /transactions/edit)
    if (!breadcrumbName && snippet === 'edit') {
       const parentUrl = currentUrl.split('/edit')[0];
       breadcrumbName = `Chỉnh sửa ${breadcrumbNameMap[parentUrl] || ''}`.trim();
    }

    if (breadcrumbName) {
      breadcrumbItems.push({
        url: currentUrl,
        title: breadcrumbName,
      });
    }
  });

  const items = [
    {
      key: 'home',
      title: <Link className={styles.linkText} to="/dashboard/finance">Trang chủ</Link>,
    },
    // Trải mảng breadcrumbItems đã lọc sạch sẽ ra
    ...breadcrumbItems.map((item, index) => {
      const isLast = index === breadcrumbItems.length - 1;

      return {
        key: item.url,
        title: isLast ? (
          <span className={styles.activeText}>{item.title}</span>
        ) : (
          <Link className={styles.linkText} to={`${item.url}${location.search}`}>
            {item.title}
          </Link>
        ),
      };
    }),
  ];

  return (
    <Breadcrumb 
      className={styles.breadcrumb} 
      items={items} 
    />
  );
};

export default AppBreadcrumb;