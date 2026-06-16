import { Table, Tag, Button, Popconfirm, Space, Tooltip, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined, CarryOutOutlined } from '@ant-design/icons';
import {
  DEPARTMENTS,
  USER_STATUS,
  USER_STATUS_LABELS,
} from '../../constants/userConstants';
import styles from './UserTable.module.scss';

function UserTable({ dataSource, onEdit, onDelete, currentPage, onPageChange, onViewDetails, onViewTasks }) {
  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      width: 120,
      align: 'center',
      render: (avatarUrl) => (
        <Avatar 
          src={avatarUrl} 
          icon={<UserOutlined />} 
          shape="square"
          size={50}
        />
      ),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: 'Nghề nghiệp',
      dataIndex: 'occupation',
      key: 'occupation',
      width: 130,
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
      sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
      render: (text) => {
        if (!text) return '';
        const date = new Date(text);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
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
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc muốn xóa người dùng này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.id)}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
          <Tooltip title= "Xem chi tiết chi tiêu">
            <Button type='text' icon={<EyeOutlined />} style={{ color: 'blue' }}
            onClick={() => onViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title= "Xem danh sách công việc">
            <Button type='text' icon={<CarryOutOutlined />} style={{ color: 'blue' }}
            onClick={() => onViewTasks(record)}
            />
          </Tooltip>
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
        pagination={{
          current: currentPage,
          pageSize: 6,
          showSizeChanger: false,
          showTotal: (total) => `Tổng ${total} người dùng`,
          onChange: onPageChange,
        }}
      />
    </div>
  );
}

export default UserTable;
