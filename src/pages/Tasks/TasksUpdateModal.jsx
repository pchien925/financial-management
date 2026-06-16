import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { useSelector } from 'react-redux';
import styles from './TasksForm.module.scss';

const { Option } = Select;

function TasksUpdateModal({ open, task, onCancel, onSubmit, daysOfWeek, lockedUserId }) {
  const [form] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);
  const { users } = useSelector((state) => state.user);

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name
  }));

  // Nếu không có task, không hiển thị modal
  const lockedUser = lockedUserId ? users.find((u) => u.id === lockedUserId) : null;

  useEffect(() => {
    if (task && open) {
      form.setFieldsValue({
        name: task.name,
        dayOfWeek: task.dayOfWeek,
        expectedTime: task.expectedTime,
        userId: task.userId,
      });
      setIsChanged(false);
    }
  }, [task, form, open]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...task,
        ...values,
      };
      if (lockedUserId) {
        formattedValues.userId = lockedUserId;
      }
      onSubmit(formattedValues);
    });
  };

  const handleCancel = () => {
    Modal.confirm({
      title: 'Xác nhận hủy',
      content: 'Bạn có chắc muốn hủy cập nhật công việc?',
      okText: 'Đồng ý',
      cancelText: 'Không',
      onOk: () => {
        form.resetFields();
        setIsChanged(false);
        onCancel();
      },
    });
  };

  const handleValuesChange = () => {
    if (!task) return;
    const current = form.getFieldsValue();
    const changed =
      current.name !== task.name ||
      current.dayOfWeek !== task.dayOfWeek ||
      current.expectedTime !== task.expectedTime ||
      (!lockedUserId && current.userId !== task.userId);
    setIsChanged(changed);
  };

  return (
    <Modal
      title="Cập nhật công việc"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Cập nhật"
      cancelText="Hủy"
      okButtonProps={{ disabled: !isChanged }}
      cancelButtonProps={{ className: styles.cancelButton }}
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
          name="dayOfWeek"
          label="Thứ trong tuần"
          rules={[{ required: true, message: 'Vui lòng chọn thứ!' }]}
        >
          <Select placeholder="Chọn thứ">
            {daysOfWeek.map((day) => (
              <Option key={day.value} value={day.value}>
                {day.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="expectedTime"
          label="Thời gian HT dự kiến (phút)"
          rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số phút" />
        </Form.Item>
        {lockedUserId ? (
          <Form.Item label="Người dùng">
            <Input value={lockedUser?.name} disabled />
          </Form.Item>
        ) : (
          <Form.Item
            label="Người dùng"
            name="userId"
            rules={[{ required: true, message: 'Vui lòng chọn người dùng!' }]}
          >
            <Select
              showSearch
              placeholder="Chọn người dùng"
              options={userOptions}
              filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default TasksUpdateModal;
