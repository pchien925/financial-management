import { Table, Tag, Button, Popconfirm, Space, Tooltip, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined, ProjectOutlined, CarryOutOutlined } from '@ant-design/icons';
import {
  DEPARTMENTS,
  USER_STATUS,
  USER_STATUS_LABELS,
} from '../../constants/userConstants';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIntl, defineMessages } from 'react-intl';

import styles from './UserTable.module.scss';

const messages = defineMessages({
  anhDaiDien: {
    defaultMessage: 'Ảnh đại diện'
  },
  hoVaTen: {
    defaultMessage: 'Họ và tên'
  },
  email: {
    defaultMessage: 'Email'
  },
  soDienThoai: {
    defaultMessage: 'Số điện thoại'
  },
  ngheNghiep: {
    defaultMessage: 'Nghề nghiệp'
  },
  chucVu: {
    defaultMessage: 'Chức vụ'
  },
  trangThai: {
    defaultMessage: 'Trạng thái'
  },
  ngayTao: {
    defaultMessage: 'Ngày tạo'
  },
  hanhDong: {
    defaultMessage: 'Hành động'
  },
  xemThongTin: {
    defaultMessage: 'Xem thông tin'
  },
  xemGiaoDich: {
    defaultMessage: 'Xem giao dịch'
  },
  sua: {
    defaultMessage: 'Sửa'
  },
  xoaNguoiDung: {
    defaultMessage: 'Xóa người dùng'
  },
  banCoChacMuonXoaNguoiDungNay: {
    defaultMessage: 'Bạn có chắc muốn xóa người dùng này?'
  },
  xoa: {
    defaultMessage: 'Xóa'
  },
  huy: {
    defaultMessage: 'Hủy'
  },
  xemDanhSachCongViec: {
    defaultMessage: 'Xem danh sách công việc'
  },
  tongTotalNguoiDung: {
    defaultMessage: 'Tổng {total} người dùng'
  }
});


function UserTable({ dataSource, onEdit, onDelete, onViewDetails, onViewTasks, currentPage, onPageChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();
  const translatedDepartments = DEPARTMENTS.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value}`, defaultMessage: item.label?.defaultMessage || item.label || item.value }) }));
  const translatedStatusLabels = Object.keys(USER_STATUS_LABELS).reduce((acc, key) => { acc[key] = intl.formatMessage({ id: `app.constant.${key}`, defaultMessage: USER_STATUS_LABELS[key] }); return acc; }, {});

  const columns = [
    {
      title: intl.formatMessage(messages.anhDaiDien),
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
      title: intl.formatMessage(messages.hoVaTen),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: intl.formatMessage(messages.email),
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: intl.formatMessage(messages.soDienThoai),
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: intl.formatMessage(messages.ngheNghiep),
      dataIndex: 'occupation',
      key: 'occupation',
      width: 130,
      render: (occupation) => {
        const found = translatedDepartments.find((dep) => dep.value === occupation);
        return found ? found.label : occupation;
      },
    },
    {
      title: intl.formatMessage(messages.chucVu),
      dataIndex: 'position',
      key: 'position',
      width: 160,
      ellipsis: true,
    },
    {
      title: intl.formatMessage(messages.trangThai),
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status) => {
        const isActive = status === USER_STATUS.ACTIVE;
        return (
          <Tag color={isActive ? 'success' : 'error'}>
            {translatedStatusLabels[status]}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage(messages.ngayTao),
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
      title: intl.formatMessage(messages.hanhDong),
      key: 'action',
      width: 200,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title={intl.formatMessage(messages.xemThongTin)}>
            <Button type="text" icon={<EyeOutlined />} onClick={() => onViewDetails(record)} />
          </Tooltip>
          <Tooltip title={intl.formatMessage(messages.sua)}>
            <Button
              type="text"
              icon={<EditOutlined />}
              className={styles.editButton}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title={intl.formatMessage(messages.xoaNguoiDung)}
            description={intl.formatMessage(messages.banCoChacMuonXoaNguoiDungNay)}
            okText={intl.formatMessage(messages.xoa)}
            cancelText={intl.formatMessage(messages.huy)}
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.id)}
          >
            <Tooltip title={intl.formatMessage(messages.xoa)}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
          <Tooltip title={intl.formatMessage(messages.xemGiaoDich)}>
            <Button type="text" icon={<ProjectOutlined />} onClick={() => onViewDetails(record)} />
          </Tooltip>
          <Tooltip title={intl.formatMessage(messages.xemDanhSachCongViec)}>
            <Button type="text" icon={<CarryOutOutlined />} style={{ color: 'blue' }} onClick={() => onViewTasks(record)} />
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
        scroll={{ x: 'max-content' }}
        pagination={{
          current: currentPage,
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total) => intl.formatMessage(messages.tongTotalNguoiDung, { total }),
          onChange: onPageChange,
        }}
      />
    </div>
  );
}

export default UserTable;
