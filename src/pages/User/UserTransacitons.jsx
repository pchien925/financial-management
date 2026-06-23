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
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';


const messages = defineMessages({
  chiTieuCuaName: {
    defaultMessage: 'Chi tiêu của: {name}'
  },
  xuatExcel: {
    defaultMessage: 'Xuất Excel'
  },
  themGiaoDich: {
    defaultMessage: 'Thêm giao dịch'
  },
  duLieuXuatRaSeChiBaoGomCacGiaoDichTrongThangDuocChonVaTuanTheoCacBoLocHienTaiTrenBang: {
    defaultMessage: 'Dữ liệu xuất ra sẽ chỉ bao gồm các giao dịch trong tháng được chọn và tuân theo các bộ lọc hiện tại trên bảng.'
  },
  vuiLongChonThangDeXuatDuLieu: {
    defaultMessage: 'Vui lòng chọn tháng để xuất dữ liệu!'
  },
  giaoDich: {
    defaultMessage: 'Giao dịch'
  },
  stt: {
    defaultMessage: 'STT'
  },
  tenNguoiDung: {
    defaultMessage: 'Tên người dùng'
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
  thuNhap: {
    defaultMessage: 'Thu nhập'
  },
  chiTieu: {
    defaultMessage: 'Chi tiêu'
  },
  tongThuNhap: {
    defaultMessage: 'Tổng thu nhập'
  },
  tongChiTieu: {
    defaultMessage: 'Tổng chi tiêu'
  },
  xuatExcelThanhCong: {
    defaultMessage: 'Xuất Excel thành công!'
  },
  coLoiXayRaKhiXuatExcel: {
    defaultMessage: 'Có lỗi xảy ra khi xuất Excel!'
  },
  chonThangXuatDuLieu: {
    defaultMessage: 'Chọn tháng xuất dữ liệu'
  },
  huy: {
    defaultMessage: 'Hủy'
  },
  chonThang: {
    defaultMessage: 'Chọn tháng'
  },
  khongCoDuLieuThoaManDieuKienTrongThangMonthDeXuat: {
    defaultMessage: 'Không có dữ liệu thỏa mãn điều kiện trong tháng {month} để xuất!'
  }
});


function UserTransactions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const translatedCategories = CATEGORIES.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value || item}`, defaultMessage: item.label || item }) }));

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

  // Hàm định dạng số tiền cho Excel
  const formatAmountForExcel = (amount, type) => {
    const formatted = intl.formatNumber(amount, {
      style: 'currency',
      currency: intl.locale === 'en' ? 'USD' : 'VND',
    });
    const prefix = type === 'income' ? '+' : '-';
    return `${prefix}${formatted}`;
  };

  // hàm xử lý xác nhận xuất Excel từ Modal
  const handleConfirmExport = async () => {
    if (!exportMonth) {
      message.warning(intl.formatMessage(messages.vuiLongChonThangDeXuatDuLieu));
      return;
    }
    
    const monthStr = exportMonth.format('YYYY-MM');
    // Lọc dataToExport từ filteredTransactions
    const dataToExport = filteredTransactions.filter(item => item.date && item.date.startsWith(monthStr));

    if(dataToExport.length === 0) {
      message.warning(intl.formatMessage(messages.khongCoDuLieuThoaManDieuKienTrongThangMonthDeXuat, { month: exportMonth.format('MM/YYYY') }));
      return;
    }
    
    await handleExportExcel(dataToExport, monthStr);
  };

  // hàm xuất dữ liệu hiện tại ra file Excel
    const handleExportExcel = async (dataToExport, monthStr) => {
  
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(intl.formatMessage(messages.giaoDich));
  
        worksheet.columns = [
          { header: intl.formatMessage(messages.stt), key: 'stt', width: 8 },
          { header: intl.formatMessage(messages.tenNguoiDung), key: 'userName', width: 25 },
          { header: intl.formatMessage(messages.ghiChu), key: 'note', width: 35 },
          { header: intl.formatMessage(messages.soTien), key: 'amount', width: 20 },
          { header: intl.formatMessage(messages.loai), key: 'type', width: 12 },
          { header: intl.formatMessage(messages.danhMuc), key: 'category', width: 20 },
          { header: intl.formatMessage(messages.ngay), key: 'date', width: 15 },
        ];
  
        // Tính tổng thu và tổng chi
        let totalIncome = 0;
        let totalExpense = 0;

        dataToExport.forEach((item, index) => {
          const user = users.find(u => u.id === item.userId);
          const catgoryLabel = translatedCategories.find(c => c.value === item.category)?.label || item.category;

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
            type: item.type === 'income' ? intl.formatMessage(messages.thuNhap) : intl.formatMessage(messages.chiTieu),
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
          note: intl.formatMessage(messages.tongThuNhap),
          amount: `+${intl.formatNumber(totalIncome, { style: 'currency', currency: intl.locale === 'en' ? 'USD' : 'VND' })}`,
        });
        incomeRow.getCell('note').font = { bold: true, color: { argb: 'FF389E0D' } };
        incomeRow.getCell('amount').font = { bold: true, color: { argb: 'FF389E0D' } };
        incomeRow.getCell('amount').alignment = { horizontal: 'right' };

        // Thêm dòng tổng chi tiêu
        const expenseRow = worksheet.addRow({
          note: intl.formatMessage(messages.tongChiTieu),
          amount: `-${intl.formatNumber(totalExpense, { style: 'currency', currency: intl.locale === 'en' ? 'USD' : 'VND' })}`,
        });
        expenseRow.getCell('note').font = { bold: true, color: { argb: 'FFCF1322' } };
        expenseRow.getCell('amount').font = { bold: true, color: { argb: 'FFCF1322' } };
        expenseRow.getCell('amount').alignment = { horizontal: 'right' };
  
        // Tạo buffer từ workbook và tải file về
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `giao_dich_${monthStr}.xlsx`);
  
        message.success(intl.formatMessage(messages.xuatExcelThanhCong));
        setIsExportModalOpen(false);
      } catch (error) {
        console.error('Lỗi khi xuất Excel:', error);
        message.error(intl.formatMessage(messages.coLoiXayRaKhiXuatExcel));
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
        <h2 className={styles.pageTitle}><FormattedMessage {...messages.chiTieuCuaName}  values={{ name: user.name }} /></h2>
        <Space>
          <Button
            type="primary"
            style={{ backgroundColor: '#107c41', borderColor: '#107c41' }} // Custom màu xanh Excel
            icon={<FileExcelOutlined />}
            size="large"
            onClick={() => setIsExportModalOpen(true)}
          >
            <FormattedMessage {...messages.xuatExcel}  />
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate(`/users/${id}/details/add${searchParams.toString()}`)}
          >
            <FormattedMessage {...messages.themGiaoDich}  />
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
        title={intl.formatMessage(messages.chonThangXuatDuLieu)}
        open={isExportModalOpen}
        onOk={handleConfirmExport}
        onCancel={() => setIsExportModalOpen(false)}
        okText={intl.formatMessage(messages.xuatExcel)}
        cancelText={intl.formatMessage(messages.huy)}
        destroyOnClose
      >
        <div style={{ padding: '20px 0' }}>
          <DatePicker 
            picker="month" 
            onChange={(date) => setExportMonth(date)}
            placeholder={intl.formatMessage(messages.chonThang)}
            format="MM/YYYY"
            style={{ width: '100%' }}
          />
          <p style={{ marginTop: 10, color: 'gray', fontSize: '13px' }}>
            * <FormattedMessage {...messages.duLieuXuatRaSeChiBaoGomCacGiaoDichTrongThangDuocChonVaTuanTheoCacBoLocHienTaiTrenBang}  />
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default UserTransactions;