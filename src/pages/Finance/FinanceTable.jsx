import { Table, Tag, Button, Popconfirm, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_COLORS,
  CATEGORIES,
  TRANSACTION_TYPES,
} from '../../constants/financeConstants';
import styles from './FinanceTable.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTransaction } from '../../redux/features/finance/financeSlice';
import { useIntl, defineMessages } from 'react-intl';


const messages = defineMessages({
  nguoiDung: {
    defaultMessage: 'Người dùng'
  },
  khongXacDinh: {
    defaultMessage: 'Không xác định'
  },
  ghiChu: {
    defaultMessage: 'Ghi chú'
  },
  soTien: {
    defaultMessage: 'Số tiền'
  },
  loai: {
    defaultMessage: 'Loại'
  },
  danhMuc: {
    defaultMessage: 'Danh mục'
  },
  ngay: {
    defaultMessage: 'Ngày'
  },
  hanhDong: {
    defaultMessage: 'Hành động'
  },
  sua: {
    defaultMessage: 'Sửa'
  },
  xoaGiaoDich: {
    defaultMessage: 'Xóa giao dịch'
  },
  banCoChacMuonXoaGiaoDichNay: {
    defaultMessage: 'Bạn có chắc muốn xóa giao dịch này?'
  },
  xoa: {
    defaultMessage: 'Xóa'
  },
  huy: {
    defaultMessage: 'Hủy'
  },
  tongTotalGiaoDich: {
    defaultMessage: 'Tổng {total} giao dịch'
  }
});


function FinanceTable({ dataSource, onEdit, currentPage, onPageChange, onRowClick }) {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const intl = useIntl();
  const translatedTypeLabels = Object.keys(TRANSACTION_TYPE_LABELS).reduce((acc, key) => { acc[key] = intl.formatMessage({ id: `app.constant.${key}`, defaultMessage: TRANSACTION_TYPE_LABELS[key] }); return acc; }, {});
  const translatedCategories = CATEGORIES.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value || item}`, defaultMessage: item.label || item }) }));

  const handleEdit = (record) => {
    onEdit(record);
  };  

  const handleDelete = (record) => {
    dispatch(deleteTransaction(record.id));
  };

  const columns = [
    {
      title: intl.formatMessage(messages.nguoiDung),
      dataIndex: 'userId',
      key: 'userName',
      width: 140,
      render: (userId) => {
        const found = users.find((u) => u.id === userId);
        return found ? found.name : intl.formatMessage(messages.khongXacDinh);
      },
    },
    {
      title: intl.formatMessage(messages.ghiChu),
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
    },
    {
      title: intl.formatMessage(messages.soTien),
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
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
      },
    },
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
      },
    },
    {
      title: intl.formatMessage(messages.danhMuc),
      dataIndex: 'category',
      key: 'category',
      width: 140,
      render: (category) => {
        const found = translatedCategories.find((cat) => cat.value === category);
        return found ? found.label : category;
      },
    },
    {
      title: intl.formatMessage(messages.ngay),
      dataIndex: 'date',
      key: 'date',
      width: 130,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (text) => {
        if (!text) return '';
        const parts = text.split('-');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return text;
      },
    },
    {
      title: intl.formatMessage(messages.hanhDong),
      key: 'action',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title={intl.formatMessage(messages.sua)}>
            <Button
              type="text"
              icon={<EditOutlined />}
              className={styles.editButton}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title={intl.formatMessage(messages.xoaGiaoDich)}
            description={intl.formatMessage(messages.banCoChacMuonXoaGiaoDichNay)}
            okText={intl.formatMessage(messages.xoa)}
            cancelText={intl.formatMessage(messages.huy)}
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Tooltip title={intl.formatMessage(messages.xoa)}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div className={styles.tableWrapper}>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          style: { cursor: 'pointer' },
        })}
        pagination={{
          current: currentPage,
          pageSize: 6,
          showSizeChanger: false,
          showTotal: (total) => intl.formatMessage(messages.tongTotalGiaoDich, { total }),
          onChange: onPageChange,
        }}
      />
    </div>
  );
}
export default FinanceTable;