import { Input, Select, Radio, Space, AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  CATEGORIES,
} from '../../constants/financeConstants';
import styles from './FinanceFilter.module.scss';
import { DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import { typeOptions } from '../../constants/financeConstants';
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
        placeholder="Tìm theo ghi chú hoặc tên người dùng..."
        allowClear
        >
          <Input prefix={<SearchOutlined />} />
        </AutoComplete>
        <Radio.Group
          options={typeOptions}
          value={filterType}
          onChange={(e) => onTypeChange(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        />
        <Select
          placeholder="Chọn danh mục"
          allowClear
          options={CATEGORIES}
          className={styles.categorySelect}
          value={filterCategory}
          onChange={(value) => onCategoryChange(value || null)}
        />
        <Typography.Text strong>Lọc theo thời gian:</Typography.Text>
        <RangePicker 
          onChange={onDateChange} 
          format="DD-MM-YYYY" 
          placeholder={['Từ ngày', 'Đến ngày']}
          value={rangeValue}
        />
      </Space>
    </div>
  );
}
export default FinanceFilter;