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

function FinanceTable({ dataSource, onEdit, currentPage, onPageChange, onRowClick }) {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);

  const handleEdit = (record) => {
    onEdit(record);
  };  

  const handleDelete = (record) => {
    dispatch(deleteTransaction(record.id));
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'userId',
      key: 'userName',
      width: 140,
      render: (userId) => {
        const found = users.find((u) => u.id === userId);
        return found ? found.name : 'Không xác định';
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
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
            {prefix}{formatted}
          </span>
        );
      },
    },
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
      },
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 140,
      render: (category) => {
        const found = CATEGORIES.find((cat) => cat.value === category);
        return found ? found.label : category;
      },
    },
    {
      title: 'Ngày',
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
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className={styles.editButton}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa giao dịch"
            description="Bạn có chắc muốn xóa giao dịch này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Tooltip title="Xóa">
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
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          style: { cursor: 'pointer' },
        })}
        pagination={{
          current: currentPage,
          pageSize: 6,
          showSizeChanger: false,
          showTotal: (total) => `Tổng ${total} giao dịch`,
          onChange: onPageChange,
        }}
      />
    </div>
  );
}
export default FinanceTable;