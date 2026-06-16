import { Layout } from 'antd';
import styles from './AppFooter.module.scss';

const { Footer } = Layout;

function AppFooter() {
  return (
    <Footer className={styles.footer}>
      Personal Finance Management ©{new Date().getFullYear()}
    </Footer>
  );
}

export default AppFooter;
