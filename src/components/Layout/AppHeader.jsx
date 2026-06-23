import { Layout, Button } from 'antd';
import {
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import styles from './AppHeader.module.scss';
import { useMatches } from 'react-router-dom';
const { Header } = Layout;

function AppHeader({ collapsed, toggleCollapsed }) {

  const matches = useMatches();
  // Tìm route hiện tại có handle.title
  const currentMatches = matches.findLast((match => match.handle?.title));

  const title = currentMatches ? currentMatches.handle.title : 'Trang chủ';

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