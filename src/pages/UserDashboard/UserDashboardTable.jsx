import React from 'react';
import { Table, Tag } from 'antd';
import styles from './UserDashboard.module.scss';
import {
  DEPARTMENTS,
  USER_STATUS,
  USER_STATUS_LABELS,
} from '../../constants/userConstants';

const columns = [
  {
    title: 'Họ và tên',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    ellipsis: true,
  },
  {
    title: 'Nghề nghiệp',
    dataIndex: 'occupation',
    key: 'occupation',
    width: 140,
    render: (occupation) => {
      const found = DEPARTMENTS.find((dep) => dep.value === occupation);
      return found ? found.label : occupation;
    },
  },
  {
    title: 'Chức vụ',
    dataIndex: 'position',
    key: 'position',
    width: 160,
    ellipsis: true,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    width: 140,
    render: (status) => {
      const isActive = status === USER_STATUS.ACTIVE;
      return (
        <Tag color={isActive ? 'success' : 'error'}>
          {USER_STATUS_LABELS[status]}
        </Tag>
      );
    },
  },
  { 
    title: 'Ngày tạo', 
    dataIndex: 'joinDate', 
    key: 'joinDate', 
    width: 130,
    render: (text) => {
      if (!text) return '';
      const parts = text.split('-');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return text;
    },
  },
];

const UserDashboardTable = ({ dataSource }) => {
  return (
    <div className={styles.tableSection}>
      <h4 className={styles.tableSectionTitle}>Danh sách người dùng</h4>
      <Table 
        columns={columns} 
        dataSource={dataSource} 
        rowKey="id"
        pagination={{ 
          pageSize: 5,
          showTotal: (total) => `Tổng ${total} người dùng`,
        }}
      />
    </div>
  );
};

export default UserDashboardTable;
