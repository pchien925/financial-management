import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSidebarMenuItems } from './SidebarMenuItems';
import styles from './AppSidebar.module.scss';
import { useIntl } from 'react-intl';

const { Sider } = Layout;

function AppSidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  let activeKey = location.pathname;
  if (location.pathname.startsWith('/transactions')) {
    activeKey = '/transactions';
  } else if (location.pathname.startsWith('/users')) {
    activeKey = '/users';
  } else if (location.pathname.startsWith('/dashboard/user')) {
    activeKey = '/dashboard/user';
  } else if (location.pathname.startsWith('/dashboard')) {
    activeKey = '/dashboard/finance';
  }

  const SidebarMenuItems = getSidebarMenuItems(intl);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      className={styles.sidebar}
      width={240}
      collapsedWidth={80}
    >
      <div className={styles.logo}>
        {collapsed ? '💰' : '💰 Personal Finance'}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activeKey]}
        items={SidebarMenuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}

export default AppSidebar;