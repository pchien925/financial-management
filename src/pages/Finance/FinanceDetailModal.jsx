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

const typeRadioOptions = [
  {
    value: TRANSACTION_TYPES.INCOME,
    label: TRANSACTION_TYPE_LABELS[TRANSACTION_TYPES.INCOME],
  },
  {
    value: TRANSACTION_TYPES.EXPENSE,
    label: TRANSACTION_TYPE_LABELS[TRANSACTION_TYPES.EXPENSE],
  },
];

function FinanceDetailModal({ open, onClose, record }) {
  const { users } = useSelector((state) => state.user);

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  if (!record) return null;

  return (
    <Modal
      title="Chi tiết giao dịch"
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
            <Form.Item label="Ghi chú" name="note">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Số tiền (VNĐ)" name="amount">
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
            <Form.Item label="Loại giao dịch" name="type">
              <Radio.Group
                options={typeRadioOptions}
                optionType="button"
                buttonStyle="solid"
                disabled
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Danh mục" name="category">
              <Select options={CATEGORIES} disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Ngày" name="date">
              <DatePicker
                format="DD-MM-YYYY"
                style={{ width: '100%' }}
                disabled
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Người dùng" name="userId">
              <Select options={userOptions} disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Tài liệu đính kèm">
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
