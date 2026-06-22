import React, { useState, createContext } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import vi from '../../locales/vi.json';
import en from '../../locales/en.json';

import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import AppFooter from './AppFooter';
import AppBreadcrumb from './AppBreadcrumb';
import styles from './AppLayout.module.scss';

const { Content } = Layout;

export const LocaleContext = createContext();

const flattenMessages = (nestedMessages, prefix = '') => {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      if (value !== '') {
        messages[prefixedKey] = value;
      }
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
};

const messages = {
  vi: flattenMessages(vi),
  en: flattenMessages(en),
};

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [locale, setLocale] = useState('vi');

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages[locale]}>
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
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export default AppLayout;