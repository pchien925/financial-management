import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { useSelector } from 'react-redux';
import styles from './TasksForm.module.scss';
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  tenCongViec: {
    defaultMessage: 'Tên công việc'
  },
  thoiGianHtDuKien: {
    defaultMessage: 'Thời gian HT dự kiến'
  },
  nguoiDung: {
    defaultMessage: 'Người dùng'
  },
  xacNhanHuy: {
    defaultMessage: 'Xác nhận hủy'
  },
  banCoChacMuonHuyThemCongViec: {
    defaultMessage: 'Bạn có chắc muốn hủy thêm công việc?'
  },
  dongY: {
    defaultMessage: 'Đồng ý'
  },
  khong: {
    defaultMessage: 'Không'
  },
  themCongViec: {
    defaultMessage: 'Thêm công việc'
  },
  them: {
    defaultMessage: 'Thêm'
  },
  huy: {
    defaultMessage: 'Hủy'
  },
  vuiLongNhapTenCongViec: {
    defaultMessage: 'Vui lòng nhập tên công việc!'
  },
  nhapTenCongViec: {
    defaultMessage: 'Nhập tên công việc'
  },
  vuiLongNhapThoiGian: {
    defaultMessage: 'Vui lòng nhập thời gian!'
  },
  nhapThoiGian: {
    defaultMessage: 'Nhập thời gian'
  },
  vuiLongChonNguoiDung: {
    defaultMessage: 'Vui lòng chọn người dùng!'
  },
  chonNguoiDung: {
    defaultMessage: 'Chọn người dùng'
  }
});


function TasksForm({ open, onCancel, onSubmit, lockedUserId }) {
  const [form] = Form.useForm();
  const intl = useIntl();
  const [isFormFilled, setIsFormFilled] = useState(false);
  const { users } = useSelector((state) => state.user);

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name
  }));

  useEffect(() => {
    if (open) {
      if (lockedUserId) {
        form.setFieldsValue({ userId: lockedUserId });
      }
    } else {
      form.resetFields();
      setIsFormFilled(false);
    }
  }, [open, lockedUserId, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
      setIsFormFilled(false);
    });
  };

  // Hàm xử lý khi người dùng nhấn hủy, kiểm tra nếu form có dữ liệu thì hiển thị xác nhận trước khi đóng Modal
  const handleCancel = () => {
    const values = form.getFieldsValue();
    // Bỏ qua field userId nếu component đang bị khóa cứng user (lockedUserId)
    const hasInput = !!values.name || !!values.expectedTime || (!lockedUserId && !!values.userId);

    if (hasInput) {
      Modal.confirm({
        title: intl.formatMessage(messages.xacNhanHuy),
        content: intl.formatMessage(messages.banCoChacMuonHuyThemCongViec),
        okText: intl.formatMessage(messages.dongY),
        cancelText: intl.formatMessage(messages.khong),
        onOk: () => {
          form.resetFields();
          setIsFormFilled(false);
          onCancel();
        },
      });
    } else {
      // Nếu form không có dữ liệu, tắt Modal ngay lập tức
      form.resetFields();
      setIsFormFilled(false);
      onCancel();
    }
  };
  
  // Kiểm tra nếu có lockedUserId thì tự động điền và disable select người dùng
  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    const filled = !!(values.name && values.expectedTime && values.userId);
    setIsFormFilled(filled);
  };
  return (
    <Modal
      title={intl.formatMessage(messages.themCongViec)}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={intl.formatMessage(messages.them)}
      cancelText={intl.formatMessage(messages.huy)}
      okButtonProps={{ disabled: !isFormFilled }}
      cancelButtonProps={{className: styles.cancelButton}}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <Form.Item
          name="name"
          label={<FormattedMessage {...messages.tenCongViec}  />}
          rules={[{ required: true, message: intl.formatMessage(messages.vuiLongNhapTenCongViec) }]}
        >
          <Input placeholder={intl.formatMessage(messages.nhapTenCongViec)} />
        </Form.Item>
        <Form.Item
          name="expectedTime"
          label={<FormattedMessage {...messages.thoiGianHtDuKien}  />}
          rules={[{ required: true, message: intl.formatMessage(messages.vuiLongNhapThoiGian) }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder={intl.formatMessage(messages.nhapThoiGian)} />
        </Form.Item>
        <Form.Item
          label={<FormattedMessage {...messages.nguoiDung}  />}
          name="userId"
          rules={[{ required: true, message: intl.formatMessage(messages.vuiLongChonNguoiDung) }]}
        >
          <Select 
            showSearch={!lockedUserId} 
            placeholder={intl.formatMessage(messages.chonNguoiDung)} 
            options={userOptions} 
            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
            disabled={!!lockedUserId}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default TasksForm;
