import React from 'react';
import { Table, Tag } from 'antd';
import styles from './Dashboard.module.scss';
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_COLORS,
  CATEGORIES,
} from '../../constants/financeConstants';

const columns = [
  { 
    title: 'Ngày', 
    dataIndex: 'date', 
    key: 'date', 
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
  { title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true },
  { 
    title: 'Loại', 
    dataIndex: 'type', 
    key: 'type',
    width: 120,
    render: (type) => {
      const isIncome = type === TRANSACTION_TYPES.INCOME;
      return (
        <Tag color={isIncome ? 'success' : 'error'}>
          {TRANSACTION_TYPE_LABELS[type]}
        </Tag>
      );
    }
  },
  { 
    title: 'Số tiền', 
    dataIndex: 'amount', 
    key: 'amount',
    render: (amount, record) => {
      const isIncome = record.type === TRANSACTION_TYPES.INCOME;
      const color = TRANSACTION_TYPE_COLORS[record.type];
      const prefix = isIncome ? '+' : '-';
      const formatted = amount.toLocaleString('vi-VN');
      return (
        <span
          className={isIncome ? styles.incomeAmount : styles.expenseAmount}
          style={{ color }}
        >
          {prefix}{formatted} VND
        </span>
      );
    }
  },
  { 
    title: 'Danh mục', 
    dataIndex: 'category', 
    key: 'category',
    width: 140,
    render: (category) => {
      const found = CATEGORIES.find((cat) => cat.value === category);
      return found ? found.label : category;
    }
  },
];

const DashBoardTable = ({ dataSource }) => {
  return (
    <div className={styles.tableSection}>
      <h4 className={styles.tableSectionTitle}>Giao dịch gần đây</h4>
      <Table 
        columns={columns} 
        dataSource={dataSource} 
        rowKey="id"
        pagination={{ 
          pageSize: 5,
          showTotal: (total) => `Tổng ${total} giao dịch`,
        }}
      />
    </div>
  );
};

export default DashBoardTable;
