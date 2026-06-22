import React from 'react';
import { DatePicker, Space, Typography } from 'antd';
import styles from './UserDashboard.module.scss';
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  locTheoThoiGian: {
    defaultMessage: 'Lọc theo thời gian:'
  },
  tuNgay: {
    defaultMessage: 'Từ ngày'
  },
  denNgay: {
    defaultMessage: 'Đến ngày'
  }
});


const { RangePicker } = DatePicker;

const UserDashboardFilter = ({ onDateChange }) => {
  const intl = useIntl();
  return (
    <div className={styles.filterCard}>
      <Space wrap>
        <Typography.Text strong><FormattedMessage {...messages.locTheoThoiGian}  /></Typography.Text>
        <RangePicker 
          onChange={onDateChange} 
          format="DD-MM-YYYY" 
          placeholder={[intl.formatMessage(messages.tuNgay), intl.formatMessage(messages.denNgay)]}
        />
      </Space>
    </div>
  );
};

export default UserDashboardFilter;