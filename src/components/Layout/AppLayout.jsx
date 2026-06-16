import { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import AppFooter from './AppFooter';
import AppBreadcrumb from './AppBreadcrumb';
import styles from './AppLayout.module.scss';

const { Content } = Layout;

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className={styles.appLayout}>
      <AppSidebar collapsed={collapsed} />

      <Layout>
        <AppHeader
          collapsed={collapsed}
          toggleCollapsed={toggleCollapsed}
        />
        
        <AppBreadcrumb />

        <Content className={styles.content}>
          <Outlet />
        </Content>

        <AppFooter />
      </Layout>
    </Layout>
  );
}

export default AppLayout;