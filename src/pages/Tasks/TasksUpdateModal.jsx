import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { useSelector } from 'react-redux';
import styles from './TasksForm.module.scss';
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  tenCongViec: {
    defaultMessage: 'Tên công việc'
  },
  thuTrongTuan: {
    defaultMessage: 'Thứ trong tuần'
  },
  thoiGianHtDuKienPhut: {
    defaultMessage: 'Thời gian HT dự kiến (phút)'
  },
  nguoiDung: {
    defaultMessage: 'Người dùng'
  },
  xacNhanHuy: {
    defaultMessage: 'Xác nhận hủy'
  },
  banCoChacMuonHuyCapNhatCongViec: {
    defaultMessage: 'Bạn có chắc muốn hủy cập nhật công việc?'
  },
  dongY: {
    defaultMessage: 'Đồng ý'
  },
  khong: {
    defaultMessage: 'Không'
  },
  capNhatCongViec: {
    defaultMessage: 'Cập nhật công việc'
  },
  capNhat: {
    defaultMessage: 'Cập nhật'
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
  vuiLongChonThu: {
    defaultMessage: 'Vui lòng chọn thứ!'
  },
  chonThu: {
    defaultMessage: 'Chọn thứ'
  },
  vuiLongNhapThoiGian: {
    defaultMessage: 'Vui lòng nhập thời gian!'
  },
  nhapSoPhut: {
    defaultMessage: 'Nhập số phút'
  },
  vuiLongChonNguoiDung: {
    defaultMessage: 'Vui lòng chọn người dùng!'
  },
  chonNguoiDung: {
    defaultMessage: 'Chọn người dùng'
  }
});


const { Option } = Select;

function TasksUpdateModal({ open, task, onCancel, onSubmit, daysOfWeek, lockedUserId }) {
  const [form] = Form.useForm();
  const intl = useIntl();
  const [isChanged, setIsChanged] = useState(false);
  const { users } = useSelector((state) => state.user);

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name
  }));

  // Nếu không có task, không hiển thị modal

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
    if (isChanged) {
      Modal.confirm({
        title: intl.formatMessage(messages.xacNhanHuy),
        content: intl.formatMessage(messages.banCoChacMuonHuyCapNhatCongViec),
        okText: intl.formatMessage(messages.dongY),
        cancelText: intl.formatMessage(messages.khong),
        onOk: () => {
          form.resetFields();
          setIsChanged(false);
          onCancel();
        },
      });
    } else {
      // Nếu không có thay đổi gì, tắt Modal luôn
      form.resetFields();
      setIsChanged(false);
      onCancel();
    }
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
      title={intl.formatMessage(messages.capNhatCongViec)}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={intl.formatMessage(messages.capNhat)}
      cancelText={intl.formatMessage(messages.huy)}
      okButtonProps={{ disabled: !isChanged }}
      cancelButtonProps={{ className: styles.cancelButton }}
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
          name="dayOfWeek"
          label={<FormattedMessage {...messages.thuTrongTuan}  />}
          rules={[{ required: true, message: intl.formatMessage(messages.vuiLongChonThu) }]}
        >
          <Select placeholder={intl.formatMessage(messages.chonThu)}>
            {daysOfWeek.map((day) => (
              <Option key={day.value} value={day.value}>
                {day.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="expectedTime"
          label={<FormattedMessage {...messages.thoiGianHtDuKienPhut}  />}
          rules={[{ required: true, message: intl.formatMessage(messages.vuiLongNhapThoiGian) }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder={intl.formatMessage(messages.nhapSoPhut)} />
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

export default TasksUpdateModal;
