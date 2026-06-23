import { Input, Select, Radio, Space, AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  CATEGORIES,
} from '../../constants/financeConstants';
import styles from './FinanceFilter.module.scss';
import { DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import { typeOptions } from '../../constants/financeConstants';
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';


const messages = defineMessages({
  locTheoThoiGian: {
    defaultMessage: 'Lọc theo thời gian:'
  },
  timTheoGhiChuHoacTenNguoiDung: {
    defaultMessage: 'Tìm theo ghi chú hoặc tên người dùng...'
  },
  chonDanhMuc: {
    defaultMessage: 'Chọn danh mục'
  },
  tuNgay: {
    defaultMessage: 'Từ ngày'
  },
  denNgay: {
    defaultMessage: 'Đến ngày'
  }
});


const { RangePicker } = DatePicker;

function FinanceFilter({
  user,
  searchText,
  onSearchChange,
  filterType,
  onTypeChange,
  filterCategory,
  onCategoryChange,
  onDateChange,
  valueDateRange,
  searchOptions
}) {
  const intl = useIntl();
  const translatedCategories = CATEGORIES.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value || item}`, defaultMessage: item.label || item }) }));
  const translatedTypeOptions = typeOptions.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value || item}`, defaultMessage: item.label || item }) }));

  // Chuyển đổi valueDateRange thành format mà RangePicker chấp nhận
  const rangeValue = valueDateRange && valueDateRange[0] && valueDateRange[1]
      ? [dayjs(valueDateRange[0]), dayjs(valueDateRange[1])]
      : null;

      // Tạo gợi ý dropdown từ ghi chú, loại bỏ trùng lặp
  const options = searchOptions ? searchOptions : user
  .filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()))
  .map(user => ({ value: user.name, label: user.name }));

  return (
    <div className={styles.filterWrapper}>
      <Space wrap size="middle">
        <AutoComplete
        options={options}
        value={searchText}
        onChange={(value) => onSearchChange(value)}
        onSelect={(value) => onSearchChange(value)}
        placeholder={intl.formatMessage(messages.timTheoGhiChuHoacTenNguoiDung)}
        allowClear
        >
          <Input prefix={<SearchOutlined />} />
        </AutoComplete>
        <Radio.Group
          options={translatedTypeOptions}
          value={filterType}
          onChange={(e) => onTypeChange(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        />
        <Select
          placeholder={intl.formatMessage(messages.chonDanhMuc)}
          allowClear
          options={translatedCategories}
          className={styles.categorySelect}
          value={filterCategory}
          onChange={(value) => onCategoryChange(value || null)}
        />
        <Typography.Text strong><FormattedMessage {...messages.locTheoThoiGian}  /></Typography.Text>
        <RangePicker 
          onChange={onDateChange} 
          format="DD-MM-YYYY" 
          placeholder={[intl.formatMessage(messages.tuNgay), intl.formatMessage(messages.denNgay)]}
          value={rangeValue}
        />
      </Space>
    </div>
  );
}
export default FinanceFilter;