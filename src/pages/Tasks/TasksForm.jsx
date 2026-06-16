import { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { useSelector } from 'react-redux';
import styles from './TasksForm.module.scss';

function TasksForm({ open, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [isFormFilled, setIsFormFilled] = useState(false);
  const { users } = useSelector((state) => state.user);

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name
  }));

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
      setIsFormFilled(false);
    });
  };
  const handleCancel = () => {
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
  };
  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    const filled = !!(values.name && values.expectedTime);
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
                <Select showSearch placeholder="Chọn người dùng" options={userOptions} 
                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default TasksForm;
