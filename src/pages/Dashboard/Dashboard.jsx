import React, { useState } from 'react';
import DashBoardCard from './DashBoardCard';
import DashBoardFilter from './DashBoardFilter';
import DashBoardTable from './DashBoardTable';
import styles from './Dashboard.module.scss';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState(null);
  const { transactions, income, expense, balance } = useSelector((state) => state.finance);

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

  const filteredData = transactions.filter(item => {
    if (!dateRange) return true;
    return item.date >= dateRange[0] && item.date <= dateRange[1];
  });

  return (
    <div className={styles.dashboardWrapper}>
      <h2 className={styles.pageTitle}>Thống kê chi tiêu</h2>
      
      <DashBoardFilter onDateChange={handleDateChange} />
      
      <DashBoardCard 
        income={income} 
        expense={expense} 
        balance={balance} 
      />
      
      <DashBoardTable dataSource={filteredData} />
    </div>
  );
};
export default Dashboard;