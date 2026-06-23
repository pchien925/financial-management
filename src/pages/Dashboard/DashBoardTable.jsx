import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';
import styles from './Dashboard.module.scss';
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_COLORS,
  CATEGORIES,
} from '../../constants/financeConstants';
import { useIntl, defineMessages } from 'react-intl';


const messages = defineMessages({
  ngay: {
    defaultMessage: 'Ngày'
  },
  ghiChu: {
    defaultMessage: 'Ghi chú'
  },
  loai: {
    defaultMessage: 'Loại'
  },
  soTien: {
    defaultMessage: 'Số tiền'
  },
  danhMuc: {
    defaultMessage: 'Danh mục'
  },
  giaoDichGanDay: {
    defaultMessage: 'Giao dịch gần đây'
  },
  tongTotalGiaoDich: {
    defaultMessage: 'Tổng {total} giao dịch'
  }
});


const DashBoardTable = ({ dataSource }) => {
  const intl = useIntl();
  const translatedTypeLabels = Object.keys(TRANSACTION_TYPE_LABELS).reduce((acc, key) => { acc[key] = intl.formatMessage({ id: `app.constant.${key}`, defaultMessage: TRANSACTION_TYPE_LABELS[key] }); return acc; }, {});
  const translatedCategories = CATEGORIES.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value || item}`, defaultMessage: item.label || item }) }));

  const columns = useMemo(() => [
    { 
      title: intl.formatMessage(messages.ngay), 
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
    { title: intl.formatMessage(messages.ghiChu), dataIndex: 'note', key: 'note', ellipsis: true },
    { 
      title: intl.formatMessage(messages.loai), 
      dataIndex: 'type', 
      key: 'type',
      width: 120,
      render: (type) => {
        const isIncome = type === TRANSACTION_TYPES.INCOME;
        return (
          <Tag color={isIncome ? 'success' : 'error'}>
            {translatedTypeLabels[type]}
          </Tag>
        );
      }
    },
    { 
      title: intl.formatMessage(messages.soTien), 
      dataIndex: 'amount', 
      key: 'amount',
      render: (amount, record) => {
        const isIncome = record.type === TRANSACTION_TYPES.INCOME;
        const color = TRANSACTION_TYPE_COLORS[record.type];
        const prefix = isIncome ? '+' : '-';
        const formatted = intl.formatNumber(amount, {
          style: 'currency',
          currency: intl.locale === 'en' ? 'USD' : 'VND',
        });
        return (
          <span
            className={isIncome ? styles.incomeAmount : styles.expenseAmount}
            style={{ color }}
          >
            {prefix}{formatted}
          </span>
        );
      }
    },
    { 
      title: intl.formatMessage(messages.danhMuc), 
      dataIndex: 'category', 
      key: 'category',
      width: 140,
      render: (category) => {
        const found = translatedCategories.find((cat) => cat.value === category);
        return found ? found.label : category;
      }
    },
  ], [intl, translatedTypeLabels, translatedCategories]);

  return (
    <div className={styles.tableSection}>
      <h4 className={styles.tableSectionTitle}>{intl.formatMessage(messages.giaoDichGanDay)}</h4>
      <Table 
        columns={columns} 
        dataSource={dataSource} 
        rowKey="id"
        pagination={{ 
          pageSize: 5,
          showTotal: (total) => intl.formatMessage(messages.tongTotalGiaoDich, { total }),
        }}
      />
    </div>
  );
};

export default DashBoardTable;
