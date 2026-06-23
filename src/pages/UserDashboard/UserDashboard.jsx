import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import UserStatCards from './UserStatCards';
import UserDashboardTable from './UserDashboardTable';
import styles from './UserDashboard.module.scss';
import { USER_STATUS } from '../../constants/userConstants';
import UserDashboardFilter from './UserDashBoardFilter'
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  thongKeNguoiDung: {
    defaultMessage: 'Thống kê người dùng'
  }
});


const UserDashboard = () => {
  const [dateRange, setDateRange] = React.useState(null);
  const { users } = useSelector((state) => state.user);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter(emp => emp.status === USER_STATUS.ACTIVE).length;
    const inactive = users.filter(emp => emp.status === USER_STATUS.INACTIVE).length;
    
    return { total, active, inactive };
  }, [users]);

  // Chuyển đổi DD-MM-YYYY sang YYYY-MM-DD để so sánh
  const convertToISO = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  // Xử lý khi chọn khoảng lọc ngày
  const handleDateChange = (dates, dateStrings) => {
    if (dates) {
      setDateRange(dateStrings.map(convertToISO));
    } else {
      setDateRange(null);
    }
  };

  const filteredData = users.filter(item => {
    if (!dateRange) return true;
    return item.joinDate >= dateRange[0] && item.joinDate <= dateRange[1];
  });

  return (
    <div className={styles.dashboardWrapper}>
      <h2 className={styles.pageTitle}><FormattedMessage {...messages.thongKeNguoiDung}  /></h2>
      
      <UserDashboardFilter onDateChange={handleDateChange} />
      <UserStatCards 
        total={stats.total} 
        active={stats.active} 
        inactive={stats.inactive} 
      />


      <UserDashboardTable dataSource={filteredData} />
    </div>
  );
};

export default UserDashboard;
