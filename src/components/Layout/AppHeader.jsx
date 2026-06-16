import { Layout, Button } from 'antd';
import {
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import styles from './AppHeader.module.scss';
import { useLocation } from 'react-router-dom';
const { Header } = Layout;

const PAGE_TITLES = {
  '/transactions': 'Quản Lý Giao Dịch',
  '/users': 'Quản Lý Người Dùng',
  '/dashboard/finance': 'Thống Kê Tổng Quan',
  '/dashboard/user': 'Thống Kê Người Dùng',
  '/transactions/add': 'Thêm Giao Dịch',
  '/transactions/edit': 'Chỉnh Sửa Giao Dịch',
  '/users/add': 'Thêm Người Dùng',
  '/users/edit': 'Chỉnh Sửa Người Dùng',
  '/users/:id/details': 'Chi Tiêu Người Dùng',
}

function AppHeader({ collapsed, toggleCollapsed }) {
  const location = useLocation();
  let title = PAGE_TITLES[location.pathname];
  if (!title) {
    if (location.pathname.startsWith('/users/') && location.pathname.endsWith('/details')) {
      title = 'Danh Sách Chi Tiêu';
    } else if (location.pathname.startsWith('/transactions/edit/')) {
      title = 'Chỉnh Sửa Giao Dịch';
    } else if (location.pathname.startsWith('/users/edit/')) {
      title = 'Chỉnh Sửa Người Dùng';
    } else {
      title = 'Trang Chủ';
    }
  }

  return (
    <Header className={styles.header}>
      <Button
        type="text"   
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        className={styles.toggleButton}
      />
      <h1 className={styles.title}>
        {title}
      </h1>
    </Header>
  );
}
export default AppHeader;