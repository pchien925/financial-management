import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Radio, DatePicker, Button, Card, Row, Col, Modal } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  CATEGORIES,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
} from '../../constants/financeConstants';
import { addTransaction, updateTransaction } from '../../redux/features/finance/financeSlice';
import DocumentUpload from '../Document/DocumentUpload';
import styles from './UserForm.module.scss'; // Dùng lại style của UserForm

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

function UserTransactionForm() {
  const { userId, transactionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();

  const { transactions } = useSelector((state) => state.finance);
  const { users } = useSelector((state) => state.user);

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const [isChanged, setIsChanged] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  const isUpdate = Boolean(transactionId);

  // Đường dẫn quay về trang danh sách chi tiêu của user
  const backUrl = `/users/${userId}/details?${searchParams.toString()}`;

  useEffect(() => {
    if (isUpdate) {
      const record = transactions.find(t => t.id === transactionId);
      if (record) {
        setInitialValues(record);
        form.setFieldsValue(record);
      } else {
        navigate(backUrl);
      }
    } else {
      setInitialValues({});
      form.resetFields();
      // Gán cứng userId
      form.setFieldsValue({ userId: Number(userId) });
    }
  }, [transactionId, transactions, form, isUpdate, navigate, backUrl, userId]);

  const handleValuesChange = (_, allValues) => {
    if (!isUpdate) {
      const hasData = Object.values(allValues).some(value => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      });
      setIsChanged(hasData);
      return;
    }

    if (initialValues) {
      const currentValuesStr = JSON.stringify({
        ...allValues,
        date: allValues.date ? dayjs(allValues.date) : undefined
      });
      const initialValuesStr = JSON.stringify({
        note: initialValues.note,
        amount: initialValues.amount,
        type: initialValues.type,
        category: initialValues.category,
        date: initialValues.date,
        userId: initialValues.userId,
        documents: initialValues.documents || []
      });
      setIsChanged(currentValuesStr !== initialValuesStr);
    }
  };

  const handleCancel = () => {
    Modal.confirm({
      title: 'Bạn có muốn đóng trang này?',
      okText: 'Có',
      cancelText: 'Hủy',
      onOk: () => {
        navigate(backUrl);
      }
    });
  };

  const onFinish = (values) => {
    // Lọc bỏ các slot trống (chưa upload)
    const validDocs = (values.documents || []).filter(
      (doc) => doc && doc.link && doc.link.trim() !== ''
    );

    const payload = {
      ...values,
      documents: validDocs,
    };

    if (isUpdate) {
      dispatch(updateTransaction({ ...payload, id: transactionId }));
    } else {
      dispatch(addTransaction(payload));
    }
    navigate(backUrl);
  };

  return (
    <div className={styles.formPageWrapper}>
      <Card
        title={isUpdate ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch mới'}
        className={styles.formCard}
      >
        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          onFinish={onFinish}
          onValuesChange={handleValuesChange}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Ghi chú"
                name="note"
                rules={[{ required: true, message: 'Vui lòng nhập ghi chú!' }]}
              >
                <Input placeholder="VD: Ăn trưa với đồng nghiệp" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số tiền (VNĐ)"
                name="amount"
                rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="VD: 1000000"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/,/g, '')}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Loại giao dịch"
                name="type"
                rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}
              >
                <Radio.Group
                  options={typeRadioOptions}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn danh mục" options={CATEGORIES} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày"
                name="date"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                getValueFromEvent={(date) => date ? date.format('YYYY-MM-DD') : ''}
                getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
              >
                <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} placeholder="Chọn ngày" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Người dùng"
                name="userId"
                rules={[{ required: true, message: 'Vui lòng chọn người dùng!' }]}
              >
                <Select
                  placeholder="Chọn người dùng"
                  options={userOptions}
                  disabled={true}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Tài liệu đính kèm"
                name="documents"
              >
                <DocumentUpload />
              </Form.Item>
            </Col>
          </Row>

          <div className={styles.buttonGroup}>
            <Button className={styles.cancelButton} onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" disabled={!isChanged}>
              {isUpdate ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default UserTransactionForm;