import { Input, Select, Radio, Space, AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  CATEGORIES,
} from '../../constants/financeConstants';
import styles from './UserFilter.module.scss'; // Dùng lại style của UserFilter
import { DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import { typeOptions } from '../../constants/financeConstants';
const { RangePicker } = DatePicker;

function UserTransactionFilter({
  transactions,
  searchText,
  onSearchChange,
  filterType,
  onTypeChange,
  filterCategory,
  onCategoryChange,
  onDateChange,
  valueDateRange
}) {
  const rangeValue = valueDateRange && valueDateRange[0] && valueDateRange[1]
      ? [dayjs(valueDateRange[0]), dayjs(valueDateRange[1])]
      : null;

  // Tạo gợi ý dropdown từ ghi chú, loại bỏ trùng lặp
  const noteOptions = transactions
    .filter(t => t.note.toLowerCase().includes(searchText.toLowerCase()))
    .map(t => ({ value: t.note, label: t.note }))
    .filter((item, index, self) =>
      index === self.findIndex(o => o.value === item.value)
    );

  return (
    <div className={styles.filterWrapper}>
      <Space wrap size="middle">
        <AutoComplete
          options={noteOptions}
          value={searchText}
          onChange={(value) => onSearchChange(value)}
          onSelect={(value) => onSearchChange(value)}
          placeholder="Tìm theo ghi chú..."
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
export default UserTransactionFilter;