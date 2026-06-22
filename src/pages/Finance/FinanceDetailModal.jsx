import { Modal, Form, Input, InputNumber, Radio, Select, DatePicker, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  CATEGORIES,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
} from '../../constants/financeConstants';
import DocumentUpload from '../Document/DocumentUpload';
import styles from './FinanceDetailModal.module.scss';
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';


const messages = defineMessages({
  ghiChu: {
    defaultMessage: 'Ghi chú'
  },
  soTien: {
    defaultMessage: 'Số tiền'
  },
  loaiGiaoDich: {
    defaultMessage: 'Loại giao dịch'
  },
  danhMuc: {
    defaultMessage: 'Danh mục'
  },
  ngay: {
    defaultMessage: 'Ngày'
  },
  nguoiDung: {
    defaultMessage: 'Người dùng'
  },
  taiLieuDinhKem: {
    defaultMessage: 'Tài liệu đính kèm'
  },
  chiTietGiaoDich: {
    defaultMessage: 'Chi tiết giao dịch'
  }
});


function FinanceDetailModal({ open, onClose, record }) {
  const { users } = useSelector((state) => state.user);
  const intl = useIntl();
  const translatedCategories = CATEGORIES.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value || item}`, defaultMessage: item.label || item }) }));
  const translatedTypeLabels = Object.keys(TRANSACTION_TYPE_LABELS).reduce((acc, key) => { acc[key] = intl.formatMessage({ id: `app.constant.${key}`, defaultMessage: TRANSACTION_TYPE_LABELS[key] }); return acc; }, {});

  const typeRadioOptions = [
    {
      value: TRANSACTION_TYPES.INCOME,
      label: translatedTypeLabels[TRANSACTION_TYPES.INCOME],
    },
    {
      value: TRANSACTION_TYPES.EXPENSE,
      label: translatedTypeLabels[TRANSACTION_TYPES.EXPENSE],
    },
  ];

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  if (!record) return null;

  return (
    <Modal
      title={intl.formatMessage(messages.chiTietGiaoDich)}
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      className={styles.detailModal}
      destroyOnClose
    >
      <Form
        layout="vertical"
        className={styles.detailForm}
        initialValues={{
          ...record,
          date: record.date ? dayjs(record.date) : null,
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={<FormattedMessage {...messages.ghiChu}  />} name="note">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={<FormattedMessage {...messages.soTien}  />} name="amount">
              <InputNumber
                style={{ width: '100%' }}
                disabled
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/,/g, '')}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={<FormattedMessage {...messages.loaiGiaoDich}  />} name="type">
              <Radio.Group
                options={typeRadioOptions}
                optionType="button"
                buttonStyle="solid"
                disabled
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={<FormattedMessage {...messages.danhMuc}  />} name="category">
              <Select options={translatedCategories} disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={<FormattedMessage {...messages.ngay}  />} name="date">
              <DatePicker
                format="DD-MM-YYYY"
                style={{ width: '100%' }}
                disabled
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={<FormattedMessage {...messages.nguoiDung}  />} name="userId">
              <Select options={userOptions} disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={<FormattedMessage {...messages.taiLieuDinhKem}  />}>
              <DocumentUpload
                value={record.documents || []}
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default FinanceDetailModal;
