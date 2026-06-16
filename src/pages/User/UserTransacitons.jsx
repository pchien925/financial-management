import { useMemo, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, message, Space, Modal, DatePicker } from 'antd';
import { PlusOutlined, FileExcelOutlined} from '@ant-design/icons';
import UserTransactionFilter from './UserTransactionsFilter';
import FinanceTable from '../Finance/FinanceTable';
import styles from './User.module.scss';
import FinanceDetailModal from '../Finance/FinanceDetailModal';
import { useState } from 'react';
import ExcelJS from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import {
  CATEGORIES,
} from '../../constants/financeConstants';

function UserTransactions() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Lấy dữ liệu từ Redux
  const { users } = useSelector((state) => state.user);
  const { transactions } = useSelector((state) => state.finance);

  // Tìm thông tin người dùng đang được chọn
  const user = users.find(u => u.id === Number(id));

  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get('search') || '';
  const filterType = searchParams.get('type') || '';
  const filterCategory = searchParams.get('category') || null;
  const currentPage = Number(searchParams.get('page')) || 1;
  const startDate = searchParams.get('startDate') || null;
  const endDate = searchParams.get('endDate') || null;

  const [detailRecord, setDetailRecord] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMonth, setExportMonth] = useState(null);

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
  const handleTypeChange = useCallback((value) => updateParams({ type: value, page: null }), [updateParams]);
  const handleCategoryChange = useCallback((value) => updateParams({ category: value, page: null }), [updateParams]);
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

    const userAllTransactions = transactions.filter(t => t.userId === Number(id));

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      // Luôn lọc cứng theo userId
      if (item.userId !== Number(id)) return false;

      const matchSearch = item.note.toLowerCase().includes(searchText.toLowerCase());
      const matchType = !filterType || item.type === filterType;
      const matchCategory = !filterCategory || item.category === filterCategory;
      const matchDate = (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate);

      return matchSearch && matchType && matchCategory && matchDate;
    });
  }, [transactions, id, searchText, filterType, filterCategory, startDate, endDate]);


  // Hàm chuyển đổi ngày từ YYYY-MM-DD sang DD-MM-YYYY
  const formatDateForExcel = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  // Hàm định dạng số tiền giống table: +1.000.000 hoặc -500.000
  const formatAmountForExcel = (amount, type) => {
    const formatted = Number(amount).toLocaleString('vi-VN');
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}${formatted}`;
  };

  // hàm xử lý xác nhận xuất Excel từ Modal
  const handleConfirmExport = async () => {
    if (!exportMonth) {
      message.warning('Vui lòng chọn tháng để xuất dữ liệu!');
      return;
    }
    
    const monthStr = exportMonth.format('YYYY-MM');
    // Lọc dataToExport từ filteredTransactions
    const dataToExport = filteredTransactions.filter(item => item.date && item.date.startsWith(monthStr));

    if(dataToExport.length === 0) {
      message.warning(`Không có dữ liệu thỏa mãn điều kiện trong tháng ${exportMonth.format('MM/YYYY')} để xuất!`);
      return;
    }
    
    await handleExportExcel(dataToExport, monthStr);
  };

  // hàm xuất dữ liệu hiện tại ra file Excel
    const handleExportExcel = async (dataToExport, monthStr) => {
  
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Giao dịch');
  
        worksheet.columns = [
          { header: 'STT', key: 'stt', width: 8 },
          { header: 'Tên người dùng', key: 'userName', width: 25 },
          { header: 'Ghi chú', key: 'note', width: 35 },
          { header: 'Số tiền', key: 'amount', width: 20 },
          { header: 'Loại', key: 'type', width: 12 },
          { header: 'Danh mục', key: 'category', width: 20 },
          { header: 'Ngày', key: 'date', width: 15 },
        ];
  
        // Tính tổng thu và tổng chi
        let totalIncome = 0;
        let totalExpense = 0;

        dataToExport.forEach((item, index) => {
          const user = users.find(u => u.id === item.userId);
          const catgoryLabel = CATEGORIES.find(c => c.value === item.category)?.label || item.category;

          // Cộng dồn tổng thu/chi
          if (item.type === 'income') {
            totalIncome += Number(item.amount);
          } else {
            totalExpense += Number(item.amount);
          }

          const rowData = {
            stt: index + 1,
            userName: user ? user.name : 'N/A',
            note: item.note,
            amount: formatAmountForExcel(item.amount, item.type),
            type: item.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
            category: catgoryLabel,
            date: formatDateForExcel(item.date),
          };
  
          const addRow = worksheet.addRow(rowData);
  
          addRow.getCell('stt').alignment = { horizontal: 'center' };
          addRow.getCell('date').alignment = { horizontal: 'center' };
          addRow.getCell('type').alignment = { horizontal: 'center' };
          addRow.getCell('amount').alignment = { horizontal: 'right' };
        });

        // Thêm dòng trống trước phần tổng kết
        worksheet.addRow([]);

        // Thêm dòng tổng thu nhập
        const incomeRow = worksheet.addRow({
          note: 'Tổng thu nhập',
          amount: `+${totalIncome.toLocaleString('vi-VN')}`,
        });
        incomeRow.getCell('note').font = { bold: true, color: { argb: 'FF389E0D' } };
        incomeRow.getCell('amount').font = { bold: true, color: { argb: 'FF389E0D' } };
        incomeRow.getCell('amount').alignment = { horizontal: 'right' };

        // Thêm dòng tổng chi tiêu
        const expenseRow = worksheet.addRow({
          note: 'Tổng chi tiêu',
          amount: `-${totalExpense.toLocaleString('vi-VN')}`,
        });
        expenseRow.getCell('note').font = { bold: true, color: { argb: 'FFCF1322' } };
        expenseRow.getCell('amount').font = { bold: true, color: { argb: 'FFCF1322' } };
        expenseRow.getCell('amount').alignment = { horizontal: 'right' };
  
        // Tạo buffer từ workbook và tải file về
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `giao_dich_${monthStr}.xlsx`);
  
        message.success('Xuất Excel thành công!');
        setIsExportModalOpen(false);
      } catch (error) {
        console.error('Lỗi khi xuất Excel:', error);
        message.error('Có lỗi xảy ra khi xuất Excel!');
      }
    };

  const handleEdit = (record) => {
    navigate(`/users/${id}/details/edit/${record.id}?${searchParams.toString()}`);
  };

  if (!user) {
    return <p>Không tìm thấy người dùng!</p>;
  }

  const handleRowClick = (record) => {
    setDetailRecord(record);
    setIsDetailOpen(true);
  };
  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setDetailRecord(null);
  };

  return (
    <div className={styles.userWrapper}>
      <div className={styles.toolbar}>
        <h2 className={styles.pageTitle}>Chi tiêu của: {user.name}</h2>
        <Space>
          <Button
            type="primary"
            style={{ backgroundColor: '#107c41', borderColor: '#107c41' }} // Custom màu xanh Excel
            icon={<FileExcelOutlined />}
            size="large"
            onClick={() => setIsExportModalOpen(true)}
          >
            Xuất Excel
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate(`/users/${id}/details/add${searchParams.toString()}`)}
          >
            Thêm giao dịch
          </Button>
        </Space>
      </div>

      <UserTransactionFilter
        transactions={userAllTransactions}
        searchText={searchText}
        onSearchChange={handleSearchChange}
        filterType={filterType}
        onTypeChange={handleTypeChange}
        filterCategory={filterCategory}
        onCategoryChange={handleCategoryChange}
        onDateChange={handleDateChange}
        valueDateRange={startDate && endDate ? [startDate, endDate] : null}
      />

      <FinanceTable
        dataSource={filteredTransactions}
        onEdit={handleEdit}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
      />
      <FinanceDetailModal
        open={isDetailOpen}
        onClose={handleDetailClose}
        record={detailRecord}
      />
      <Modal
        title="Chọn tháng xuất dữ liệu"
        open={isExportModalOpen}
        onOk={handleConfirmExport}
        onCancel={() => setIsExportModalOpen(false)}
        okText="Xuất Excel"
        cancelText="Hủy"
        destroyOnClose
      >
        <div style={{ padding: '20px 0' }}>
          <DatePicker 
            picker="month" 
            onChange={(date) => setExportMonth(date)}
            placeholder="Chọn tháng"
            format="MM/YYYY"
            style={{ width: '100%' }}
          />
          <p style={{ marginTop: 10, color: 'gray', fontSize: '13px' }}>
            * Dữ liệu xuất ra sẽ chỉ bao gồm các giao dịch trong tháng được chọn và tuân theo các bộ lọc hiện tại trên bảng.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default UserTransactions;