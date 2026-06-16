import { useState, useEffect } from 'react';
import { Form, Input, Select, Radio, DatePicker, Button, Card, Row, Col, Modal, Upload, message } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  DEPARTMENTS,
  USER_STATUS,
  USER_STATUS_LABELS,
} from '../../constants/userConstants';
import { addUser, updateUser } from '../../redux/features/user/userSlice';
import styles from './UserForm.module.scss';

const statusRadioOptions = [
  {
    value: USER_STATUS.ACTIVE,
    label: USER_STATUS_LABELS[USER_STATUS.ACTIVE],
  },
  {
    value: USER_STATUS.INACTIVE,
    label: USER_STATUS_LABELS[USER_STATUS.INACTIVE],
  },
];

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { users } = useSelector((state) => state.user);
  const [isChanged, setIsChanged] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const isUpdate = Boolean(id);

  const CLOUD_NAME = 'dby0mgpvn';
  const UPLOAD_PRESET = 'Reactjs';
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  useEffect(() => {
    if (isUpdate) {
      const record = users.find(e => e.id === Number(id));
      if (record) {
        setInitialValues(record);
        form.setFieldsValue(record);
        setAvatarUrl(record.avatarUrl);
      } else {
        navigate(`/users?${searchParams.toString()}`);
      }
    } else {
      setInitialValues({});
      form.resetFields();
      setAvatarUrl('');
    }
  }, [id, users, form, isUpdate, navigate, searchParams]);

  // Hàm custom upload cho Ant Design Upload component, sử dụng Cloudinary để lưu ảnh
  const customUpload = async ({ file, onSuccess, onError }) => {
    // Tạo form data để gửi file ảnh lên Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      setAvatarLoading(true);
      const rs = await axios.post(UPLOAD_URL, formData);
      const url = rs.data.secure_url;
      setAvatarUrl(url);
      form.setFieldValue('avatarUrl', url);
      setIsChanged(true); // Đánh dấu có thay đổi để bật nút submit
      onSuccess(rs.data, file);
      message.success('Tải ảnh lên thành công!');
    } catch (error) {
      onError(error);
      message.error('Tải ảnh lên thất bại !');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleValuesChange = (_, allValues) => {
    if (!isUpdate) {
      const hasDate = Object.values(allValues).some(value => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string' && value.trim() === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;

        return true;
      });
      setIsChanged(hasDate);
      return;
    }

    if (initialValues) {
      const currentValuesStr = JSON.stringify({
        ...allValues,
        joinDate: allValues.joinDate ? dayjs(allValues.joinDate) : null
      });
      const initialValuesStr = JSON.stringify({
        name: initialValues.name,
        email: initialValues.email,
        phone: initialValues.phone,
        occupation: initialValues.occupation,
        position: initialValues.position,
        status: initialValues.status,
        joinDate: initialValues.joinDate
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
        navigate(`/users?${searchParams.toString()}`);
      }
    });
  };

  const onFinish = (values) => {
    if (isUpdate) {
      dispatch(updateUser({ id: Number(id), values }));
    } else {
      dispatch(addUser(values));
    }
    navigate(`/users?${searchParams.toString()}`);
  };

  const uploadButton = (
    <div>
      {avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <div className={styles.formPageWrapper}>
      <Card
        title={isUpdate ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
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
            <Col span={24} style={{ display: 'flex', justifyContent: 'left', marginBottom: 20 }}>
              <Form.Item name="avatarUrl" label="Avatar">
                {/* ImgCrop với aspect={1/1} ép cắt ảnh hình vuông */}
                <ImgCrop rotationSlider aspect={1 / 1} cropperProps={{ grid: true}}>
                  <Upload
                    name="file"
                    listType="picture-card" // Tạo hình thức ô upload hình vuông
                    showUploadList={false}
                    customRequest={customUpload}
                    accept="image/*"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input placeholder="VD: Nguyễn Văn A" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input placeholder="VD: nguyenvana@company.com" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input placeholder="VD: 0901234567" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Nghề nghiệp"
                name="occupation"
                rules={[{ required: true, message: 'Vui lòng chọn nghề nghiệp!' }]}
              >
                <Select placeholder="Chọn nghề nghiệp" options={DEPARTMENTS} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Chức vụ"
                name="position"
                rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
              >
                <Input placeholder="VD: Senior Developer" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Radio.Group
                  options={statusRadioOptions}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày tạo"
                name="joinDate"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                getValueFromEvent={(date) => date ? date.format('YYYY-MM-DD') : ''}
                getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
              >
                <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} placeholder="Chọn ngày" />
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

export default UserForm;
