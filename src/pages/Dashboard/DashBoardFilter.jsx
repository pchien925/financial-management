import React from 'react';
import { DatePicker, Space, Typography } from 'antd';
import styles from './Dashboard.module.scss';

const { RangePicker } = DatePicker;

const DashBoardFilter = ({ onDateChange }) => {
  return (
    <div className={styles.filterCard}>
      <Space wrap>
        <Typography.Text strong>Lọc theo thời gian:</Typography.Text>
        <RangePicker 
          onChange={onDateChange} 
          format="DD-MM-YYYY" 
          placeholder={['Từ ngày', 'Đến ngày']}
        />
      </Space>
    </div>
  );
};

export default DashBoardFilter;