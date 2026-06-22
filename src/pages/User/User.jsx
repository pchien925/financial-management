import { useMemo, useCallback } from 'react';
import { Button, message, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser } from '../../redux/features/user/userSlice';
import UserFilter from './UserFilter';
import UserTable from './UserTable';
import styles from './User.module.scss';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  quanLyNguoiDung: {
    defaultMessage: 'Quản lý người dùng'
  },
  themNguoiDung: {
    defaultMessage: 'Thêm người dùng'
  },
  khongTheXoaNguoiDung: {
    defaultMessage: 'Không thể xóa người dùng'
  },
  xoaNguoiDungThanhCong: {
    defaultMessage: 'Xóa người dùng thành công!'
  },
  nguoiDungNayConCountGiaoDichVuiLongXoaHetGiaoDichTruocKhiXoaNguoiDung: {
    defaultMessage: 'Người dùng này còn {count} giao dịch. Vui lòng xóa hết giao dịch trước khi xóa người dùng.'
  }
});


function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const intl = useIntl();
  const { users } = useSelector((state) => state.user);
  const { transactions } = useSelector((state) => state.finance);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get('search') || '';
  const filterStatus = searchParams.get('status') || '';
  const filterOccupation = searchParams.get('occupation') || null;
  const currentPage = Number(searchParams.get('page')) || 1;
  const startDate = searchParams.get('startDate') || null;
  const endDate = searchParams.get('endDate') || null;

  const updateParams = useCallback((newParams) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      return params;
    });
  }, [setSearchParams]);

  const handleSearchChange = useCallback((value) => updateParams({ search: value, page: null }), [updateParams]);
  const handleStatusChange = useCallback((value) => updateParams({ status: value, page: null }), [updateParams]);
  const handleOccupationChange = useCallback((value) => updateParams({ occupation: value, page: null }), [updateParams]);
  const handlePageChange = useCallback((page) => updateParams({ page: page > 1 ? page : null }), [updateParams]);

  const handleDateChange = (dates, dateStrings) => {
    if (dates) {
      const startISO = convertToISO(dateStrings[0]);
      const endISO = convertToISO(dateStrings[1]);
      updateParams({ startDate: startISO, endDate: endISO, page: null });
    } else {
      updateParams({ startDate: null, endDate: null, page: null });
    }
  };

    const convertToISO = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = !filterStatus || item.status === filterStatus;
      const matchOccupation = !filterOccupation || item.occupation === filterOccupation;
      const matchDate = (!startDate || item.joinDate >= startDate) && (!endDate || item.joinDate <= endDate);
      return matchSearch && matchStatus && matchOccupation && matchDate;
    });
  }, [users, searchText, filterStatus, filterOccupation, startDate, endDate]);

  const handleEdit = (record) => {
    navigate(`/users/edit/${record.id}?${searchParams.toString()}`);
  };

  const handleDelete = (id) => {
    //kiểm tra nếu user có giao dịch nào không, nếu có thì không cho xóa và hiện thông báo
    const userTransactions = transactions.filter(t => t.userId === id);

    if (userTransactions.length > 0) {
      notification.warning({
        message: intl.formatMessage(messages.khongTheXoaNguoiDung),
        description: intl.formatMessage(messages.nguoiDungNayConCountGiaoDichVuiLongXoaHetGiaoDichTruocKhiXoaNguoiDung, { count: userTransactions.length }),
      });
      return;
    }

    dispatch(deleteUser(id));
    message.success(intl.formatMessage(messages.xoaNguoiDungThanhCong));
  };

  const handleViewDetails = (record) => {
    navigate(`/users/${record.id}/details?${searchParams.toString()}`);
  };

  const handleViewTasks = (record) => {
    navigate(`/users/${record.id}/tasks?${searchParams.toString()}`);
  };

  return (
    <div className={styles.userWrapper}>
      <div className={styles.toolbar}>
        <h2 className={styles.pageTitle}><FormattedMessage {...messages.quanLyNguoiDung}  /></h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            navigate(`/users/add?${searchParams.toString()}`);
          }}
        >
          <FormattedMessage {...messages.themNguoiDung}  />
        </Button>
      </div>
      <UserFilter
        user={users}
        searchText={searchText}
        onSearchChange={handleSearchChange}
        filterStatus={filterStatus}
        onStatusChange={handleStatusChange}
        filterOccupation={filterOccupation}
        onOccupationChange={handleOccupationChange}
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        valueDateRange={startDate && endDate ? [startDate, endDate] : null}
      />
      <UserTable
        dataSource={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
        onViewTasks={handleViewTasks}
      />
    </div>
  );
}

export default User;