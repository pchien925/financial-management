import { Input, Select, Radio, Space, AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  DEPARTMENTS,
} from '../../constants/userConstants';
import styles from './UserFilter.module.scss';
import { DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import { statusOptions } from '../../constants/userConstants';

const { RangePicker } = DatePicker;

function UserFilter({
  user,
  searchText,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterOccupation,
  onOccupationChange,
  onDateChange,
  valueDateRange
}) {

  const rangeValue = valueDateRange && valueDateRange[0] && valueDateRange[1]
    ? [dayjs(valueDateRange[0]), dayjs(valueDateRange[1])]
    : null;

  const options = user
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
          placeholder="Tìm theo tên người dùng..."
          allowClear
        >
          <Input prefix={<SearchOutlined />} className={styles.searchInput} />
        </AutoComplete>
        <Radio.Group
          options={statusOptions}
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        />
        <Select
          placeholder="Chọn nghề nghiệp"
          allowClear
          options={DEPARTMENTS}
          className={styles.occupationSelect}
          value={filterOccupation}
          onChange={(value) => onOccupationChange(value || null)}
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

export default UserFilter;
