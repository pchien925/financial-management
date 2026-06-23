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
import styles from './FinanceForm.module.scss';
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
  huy: {
    defaultMessage: 'Hủy'
  },
  capNhat: {
    defaultMessage: 'Cập nhật'
  },
  themMoi: {
    defaultMessage: 'Thêm mới'
  },
  banCoMuonDongTrangNay: {
    defaultMessage: 'Bạn có muốn đóng trang này?'
  },
  co: {
    defaultMessage: 'Có'
  },
  chinhSuaGiaoDich: {
    defaultMessage: 'Chỉnh sửa giao dịch'
  },
  themGiaoDichMoi: {
    defaultMessage: 'Thêm giao dịch mới'
  },
  vuiLongNhapGhiChu: {
    defaultMessage: 'Vui lòng nhập ghi chú!'
  },
  vdAnTruaVoiDongNghiep: {
    defaultMessage: 'VD: Ăn trưa với đồng nghiệp'
  },
  vuiLongNhapSoTien: {
    defaultMessage: 'Vui lòng nhập số tiền!'
  },
  vd1000000: {
    defaultMessage: 'VD: 1000000'
  },
  vuiLongChonLoai: {
    defaultMessage: 'Vui lòng chọn loại!'
  },
  vuiLongChonDanhMuc: {
    defaultMessage: 'Vui lòng chọn danh mục!'
  },
  chonDanhMuc: {
    defaultMessage: 'Chọn danh mục'
  },
  vuiLongChonNgay: {
    defaultMessage: 'Vui lòng chọn ngày!'
  },
  chonNgay: {
    defaultMessage: 'Chọn ngày'
  },
  vuiLongChonNguoiDung: {
    defaultMessage: 'Vui lòng chọn người dùng!'
  },
  chonNguoiDung: {
    defaultMessage: 'Chọn người dùng'
  }
});


function FinanceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
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
  
  const { transactions } = useSelector((state) => state.finance);
  const { users } = useSelector((state) => state.user);

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));
  const [isChanged, setIsChanged] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  const isUpdate = Boolean(id);

  useEffect(() => {
    if (isUpdate) {
      const record = transactions.find(t => t.id === id);
      if (record) {
        setInitialValues(record);
        form.setFieldsValue(record);
      } else {
        // If ID not found, go back
        navigate(`/transactions?${searchParams.toString()}`);
      }
    } else {
      setInitialValues({});
      form.resetFields();
    }
  }, [id, transactions, form, isUpdate, navigate, searchParams]);


  // Kiểm tra có thay đổi gì so với initialValues hay không
  const handleValuesChange = (_, allValues) => {
    // Nếu đang ở chế độ tạo mới, chỉ cần kiểm tra có nhập gì hay không
    if (!isUpdate) {
      const hasDate = Object.values(allValues).some(value => {
      if( value === null || value=== undefined) return false;
      if(typeof value === 'string' && value.trim() === '') return false;
      if(Array.isArray(value) && value.length === 0) return false;

      return true;
      });
      setIsChanged(hasDate);
      return;
    }

    // So sánh giá trị hiện tại với initialValues để xác định có thay đổi hay không
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
      title: intl.formatMessage(messages.banCoMuonDongTrangNay),
      okText: intl.formatMessage(messages.co),
      cancelText: intl.formatMessage(messages.huy),
      onOk: () => {
        navigate(`/transactions?${searchParams.toString()}`);
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
      dispatch(updateTransaction({ ...payload, id }));
    } else {
      dispatch(addTransaction(payload));
    }
    navigate(`/transactions?${searchParams.toString()}`);
  };

  return (
    <div className={styles.formPageWrapper}>
      <Card 
        title={isUpdate ? intl.formatMessage(messages.chinhSuaGiaoDich) : intl.formatMessage(messages.themGiaoDichMoi)} 
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
                label={<FormattedMessage {...messages.ghiChu}  />}
                name="note"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongNhapGhiChu) }]}
              >
                <Input placeholder={intl.formatMessage(messages.vdAnTruaVoiDongNghiep)} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                label={<FormattedMessage {...messages.soTien}  />}
                name="amount"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongNhapSoTien) }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder={intl.formatMessage(messages.vd1000000)}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/,/g, '')}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<FormattedMessage {...messages.loaiGiaoDich}  />}
                name="type"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongChonLoai) }]}
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
                label={<FormattedMessage {...messages.danhMuc}  />}
                name="category"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongChonDanhMuc) }]}
              >
                <Select placeholder={intl.formatMessage(messages.chonDanhMuc)} options={translatedCategories} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<FormattedMessage {...messages.ngay}  />}
                name="date"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongChonNgay) }]}
                getValueFromEvent={(date) => date ? date.format('YYYY-MM-DD') : ''}
                getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
              >
                <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} placeholder={intl.formatMessage(messages.chonNgay)} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<FormattedMessage {...messages.nguoiDung}  />}
                name="userId"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongChonNguoiDung) }]}
              >
                <Select showSearch placeholder={intl.formatMessage(messages.chonNguoiDung)} options={userOptions} 
                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={<FormattedMessage {...messages.taiLieuDinhKem}  />}
                name="documents"
              >
                <DocumentUpload />
              </Form.Item>
            </Col>
          </Row>

          <div className={styles.buttonGroup}>
            <Button className={styles.cancelButton} onClick={handleCancel}>
              <FormattedMessage {...messages.huy}  />
            </Button>
            <Button type="primary" htmlType="submit" disabled={!isChanged}>
              {isUpdate ? <FormattedMessage {...messages.capNhat}  /> : <FormattedMessage {...messages.themMoi}  />}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default FinanceForm;
