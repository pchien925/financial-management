import React from 'react';
import { Breadcrumb } from 'antd';
import { useMatches, Link, useLocation } from 'react-router-dom';
import styles from './AppBreadcrumb.module.scss';

const AppBreadcrumb = () => {
  const matches = useMatches();
  const location = useLocation();

  const breadcrumbMatches = matches.filter(match => match.handle?.title);

  if (breadcrumbMatches.length === 0) return null;

  const items = [
    {
      key: 'home',
      title: <Link className={styles.linkText} to="/dashboard/finance">Trang chủ</Link>,
    },
    ...breadcrumbMatches.map((match, index) => {
      const isLast = index === breadcrumbMatches.length - 1;
      const titleText = match.handle.title;

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