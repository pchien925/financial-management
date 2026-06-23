import React from 'react';
import { Table, Tag } from 'antd';
import styles from './UserDashboard.module.scss';
import {
  DEPARTMENTS,
  USER_STATUS,
  USER_STATUS_LABELS,
} from '../../constants/userConstants';
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';


const messages = defineMessages({
  danhSachNguoiDung: {
    defaultMessage: 'Danh sách người dùng'
  },
  hoVaTen: {
    defaultMessage: 'Họ và tên'
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
  tongTotalNguoiDung: {
    defaultMessage: 'Tổng {total} người dùng'
  }
});


const UserDashboardTable = ({ dataSource }) => {
  const intl = useIntl();
  const translatedDepartments = DEPARTMENTS.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value || item}`, defaultMessage: item.label || item }) }));
  const translatedUserStatusLabels = Object.keys(USER_STATUS_LABELS).reduce((acc, key) => { acc[key] = intl.formatMessage({ id: `app.constant.${key}`, defaultMessage: USER_STATUS_LABELS[key] }); return acc; }, {});

  const columns = [
    {
      title: intl.formatMessage(messages.hoVaTen),
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: intl.formatMessage(messages.ngheNghiep),
      dataIndex: 'occupation',
      key: 'occupation',
      width: 140,
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
            {translatedUserStatusLabels[status]}
          </Tag>
        );
      },
    },
    { 
      title: intl.formatMessage(messages.ngayTao), 
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

  return (
    <div className={styles.tableSection}>
      <h4 className={styles.tableSectionTitle}><FormattedMessage {...messages.danhSachNguoiDung}  /></h4>
      <Table 
        columns={columns} 
        dataSource={dataSource} 
        rowKey="id"
        pagination={{ 
          pageSize: 5,
          showTotal: (total) => intl.formatMessage(messages.tongTotalNguoiDung, { total }),
        }}
      />
    </div>
  );
};

export default UserDashboardTable;
