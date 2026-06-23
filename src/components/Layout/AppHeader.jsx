import React, { useContext } from 'react';
import { Layout, Button, Select } from 'antd';
import {
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import styles from './AppHeader.module.scss';
import { useMatches } from 'react-router-dom';
import { LocaleContext } from './AppLayout';
import { useIntl } from 'react-intl';

const { Header } = Layout;

function AppHeader({ collapsed, toggleCollapsed }) {

  const matches = useMatches();
  const { locale, setLocale } = useContext(LocaleContext);
  const intl = useIntl();

  // Tìm route hiện tại có handle.title
  const currentMatches = matches.findLast((match) => match.handle?.title);

  const renderTitle = () => {
    if (currentMatches && currentMatches.handle.title) {
      // Nếu title từ route đã được bọc intl hoặc định dạng đúng cấu trúc
      return intl.formatMessage(currentMatches.handle.title);
    }
    // Viết trực tiếp defaultMessage ở đây để Babel quét và tự sinh ID chuẩn xác
    return intl.formatMessage({ defaultMessage: 'Trang chủ' });
  };

  return (
    <Header className={styles.header} style={{ display: 'flex', alignItems: 'center' }}>
      <Button
        type="text"   
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        className={styles.toggleButton}
      />
      <h1 className={styles.title} style={{ flex: 1 }}>
        {renderTitle()}
      </h1>
      <div className={styles.rightHeader} style={{ marginRight: 16 }}>
        <Select
          value={locale}
          onChange={setLocale}
          options={[
            { value: 'vi', label: 'Tiếng Việt' },
            { value: 'en', label: 'English' }
          ]}
        />
      </div>
    </Header>
  );
}
export default AppHeader;