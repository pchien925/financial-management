import { Input, Select, Radio, Space, AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  DEPARTMENTS,
} from '../../constants/userConstants';
import styles from './UserFilter.module.scss';
import { DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import { statusOptions } from '../../constants/userConstants';
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';


const messages = defineMessages({
  locTheoThoiGian: {
    defaultMessage: 'Lọc theo thời gian:'
  },
  timTheoTenNguoiDung: {
    defaultMessage: 'Tìm theo tên người dùng...'
  },
  chonNgheNghiep: {
    defaultMessage: 'Chọn nghề nghiệp'
  },
  tuNgay: {
    defaultMessage: 'Từ ngày'
  },
  denNgay: {
    defaultMessage: 'Đến ngày'
  }
});


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
  const intl = useIntl();
  const translatedDepartments = DEPARTMENTS.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value || item}`, defaultMessage: item.label || item }) }));
  const translatedStatusOptions = statusOptions.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value || item}`, defaultMessage: item.label || item }) }));

  const rangeValue = valueDateRange && valueDateRange[0] && valueDateRange[1]
    ? [dayjs(valueDateRange[0]), dayjs(valueDateRange[1])]
    : null;

  const options = user
    .filter(u => u.name.toLowerCase().includes(searchText.toLowerCase()))
    .map(u => ({ value: u.name, label: u.name }));
    
  return (
    <div className={styles.filterWrapper}>
      <Space wrap size="middle">
        <AutoComplete
          options={options}
          value={searchText}
          onChange={(value) => onSearchChange(value)}
          onSelect={(value) => onSearchChange(value)}
          placeholder={intl.formatMessage(messages.timTheoTenNguoiDung)}
          allowClear
        >
          <Input prefix={<SearchOutlined />} className={styles.searchInput} />
        </AutoComplete>
        <Radio.Group
          options={translatedStatusOptions}
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        />
        <Select
          placeholder={intl.formatMessage(messages.chonNgheNghiep)}
          allowClear
          options={translatedDepartments}
          className={styles.occupationSelect}
          value={filterOccupation}
          onChange={(value) => onOccupationChange(value || null)}
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
export default UserFilter;
