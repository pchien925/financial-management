import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { useSelector } from 'react-redux';
import styles from './TasksForm.module.scss';

function TasksForm({ open, onCancel, onSubmit, lockedUserId }) {
  const [form] = Form.useForm();
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
        title: 'Xác nhận hủy',
        content: 'Bạn có chắc muốn hủy thêm công việc?',
        okText: 'Đồng ý',
        cancelText: 'Không',
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
      title="Thêm công việc"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Thêm"
      cancelText="Hủy"
      okButtonProps={{ disabled: !isFormFilled }}
      cancelButtonProps={{className: styles.cancelButton}}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <Form.Item
          name="name"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
        >
          <Input placeholder="Nhập tên công việc" />
        </Form.Item>
        <Form.Item
          name="expectedTime"
          label="Thời gian HT dự kiến"
          rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập thời gian" />
        </Form.Item>
        <Form.Item
          label="Người dùng"
          name="userId"
          rules={[{ required: true, message: 'Vui lòng chọn người dùng!' }]}
        >
          <Select 
            showSearch={!lockedUserId} 
            placeholder="Chọn người dùng" 
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
