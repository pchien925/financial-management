import React from 'react';
import { Breadcrumb } from 'antd';
import { useMatches, Link, useLocation } from 'react-router-dom';
import styles from './AppBreadcrumb.module.scss';
import { useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  trangChu: {
    defaultMessage: 'Trang chủ'
  }
});


const AppBreadcrumb = () => {
  const matches = useMatches();
  const location = useLocation();
  const intl = useIntl();

  const breadcrumbMatches = matches.filter(match => match.handle?.title);

  if (breadcrumbMatches.length === 0) return null;

  const items = [
    {
      key: 'home',
      title: <Link className={styles.linkText} to="/dashboard/finance">{intl.formatMessage(messages.trangChu)}</Link>,
    },
    ...breadcrumbMatches.map((match, index) => {
      const isLast = index === breadcrumbMatches.length - 1;
      const formatMsg = intl.formatMessage;
      const titleText = formatMsg(match.handle.title);

      return {
        key: match.id || match.pathname, 
        title: isLast ? (
          <span className={styles.activeText}>{titleText}</span>
        ) : (
          <Link className={styles.linkText} to={`${match.pathname}${location.search}`}>
            {titleText}
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