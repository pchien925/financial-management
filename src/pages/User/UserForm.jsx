import { useState, useEffect } from 'react';
import { Form, Input, Select, Radio, DatePicker, Button, Card, Row, Col, Modal, Upload, message } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
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
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';


const messages = defineMessages({
  taiLen: {
    defaultMessage: 'Tải lên'
  },
  hoVaTen: {
    defaultMessage: 'Họ và tên'
  },
  soDienThoai: {
    defaultMessage: 'Số điện thoại'
  },
  ngheNghiep: {
    defaultMessage: 'Nghề nghiệp'
  },
  chucVu: {
    defaultMessage: 'Chức vụ'
  },
  trangThai: {
    defaultMessage: 'Trạng thái'
  },
  ngayTao: {
    defaultMessage: 'Ngày tạo'
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
  taiAnhLenThanhCong: {
    defaultMessage: 'Tải ảnh lên thành công!'
  },
  taiAnhLenThatBai: {
    defaultMessage: 'Tải ảnh lên thất bại !'
  },
  banCoMuonDongTrangNay: {
    defaultMessage: 'Bạn có muốn đóng trang này?'
  },
  co: {
    defaultMessage: 'Có'
  },
  chinhSuaNguoiDung: {
    defaultMessage: 'Chỉnh sửa người dùng'
  },
  themNguoiDungMoi: {
    defaultMessage: 'Thêm người dùng mới'
  },
  vuiLongNhapHoTen: {
    defaultMessage: 'Vui lòng nhập họ tên!'
  },
  vdNguyenVanA: {
    defaultMessage: 'VD: Nguyễn Văn A'
  },
  vuiLongNhapEmail: {
    defaultMessage: 'Vui lòng nhập email!'
  },
  emailKhongHopLe: {
    defaultMessage: 'Email không hợp lệ!'
  },
  vdNguyenvanacompanycom: {
    defaultMessage: 'VD: nguyenvana@company.com'
  },
  vuiLongNhapSoDienThoai: {
    defaultMessage: 'Vui lòng nhập số điện thoại!'
  },
  vd0901234567: {
    defaultMessage: 'VD: 0901234567'
  },
  vuiLongChonNgheNghiep: {
    defaultMessage: 'Vui lòng chọn nghề nghiệp!'
  },
  chonNgheNghiep: {
    defaultMessage: 'Chọn nghề nghiệp'
  },
  vuiLongNhapChucVu: {
    defaultMessage: 'Vui lòng nhập chức vụ!'
  },
  vdSeniorDeveloper: {
    defaultMessage: 'VD: Senior Developer'
  },
  vuiLongChonTrangThai: {
    defaultMessage: 'Vui lòng chọn trạng thái!'
  },
  vuiLongChonNgay: {
    defaultMessage: 'Vui lòng chọn ngày!'
  },
  chonNgay: {
    defaultMessage: 'Chọn ngày'
  }
});


function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const intl = useIntl();
  const translatedDepartments = DEPARTMENTS.map(item => ({ ...item, label: intl.formatMessage({ id: `app.constant.${item.value || item}`, defaultMessage: item.label || item }) }));
  const translatedStatusLabels = Object.keys(USER_STATUS_LABELS).reduce((acc, key) => { acc[key] = intl.formatMessage({ id: `app.constant.${key}`, defaultMessage: USER_STATUS_LABELS[key] }); return acc; }, {});

  const statusRadioOptions = [
    {
      value: USER_STATUS.ACTIVE,
      label: translatedStatusLabels[USER_STATUS.ACTIVE],
    },
    {
      value: USER_STATUS.INACTIVE,
      label: translatedStatusLabels[USER_STATUS.INACTIVE],
    },
  ];

  const { users } = useSelector((state) => state.user);
  const [isChanged, setIsChanged] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [fileList, setFileList] = useState([]);

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
        setImageUrl(record.avatarUrl);
      } else {
        navigate(`/users?${searchParams.toString()}`);
      }
    } else {
      setInitialValues({});
      form.resetFields();
      setImageUrl('');
    }
  }, [id, users, form, isUpdate, navigate, searchParams]);

  const customUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      setAvatarLoading(true);
      const rs = await axios.post(UPLOAD_URL, formData);
      const url = rs.data.secure_url;
      setImageUrl(url);
      setFileList([{ uid: '-1', name: 'avatar.png', status: 'done', url }]);
      form.setFieldValue('avatarUrl', url);
      setIsChanged(true);
      onSuccess(rs.data, file);
      message.success(intl.formatMessage(messages.taiAnhLenThanhCong));
    } catch (error) {
      onError(error);
      message.error(intl.formatMessage(messages.taiAnhLenThatBai));
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
      title: intl.formatMessage(messages.banCoMuonDongTrangNay),
      okText: intl.formatMessage(messages.co),
      cancelText: intl.formatMessage(messages.huy),
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
      <UploadOutlined />
      <div style={{ marginTop: 8 }}><FormattedMessage {...messages.taiLen}  /></div>
    </div>
  );

  return (
    <div className={styles.formPageWrapper}>
      <Card
        title={isUpdate ? intl.formatMessage(messages.chinhSuaNguoiDung) : intl.formatMessage(messages.themNguoiDungMoi)}
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
            <Col span={24} className={styles.avatarCol}>
              <Form.Item name="avatarUrl" label="Avatar">
                <ImgCrop rotationSlider aspect={1 / 1} cropperProps={{ grid: true}}>
                  <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    customRequest={customUpload}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<FormattedMessage {...messages.hoVaTen}  />}
                name="name"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongNhapHoTen) }]}
              >
                <Input placeholder={intl.formatMessage(messages.vdNguyenVanA)} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: intl.formatMessage(messages.vuiLongNhapEmail) },
                  { type: 'email', message: intl.formatMessage(messages.emailKhongHopLe) },
                ]}
              >
                <Input placeholder={intl.formatMessage(messages.vdNguyenvanacompanycom)} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<FormattedMessage {...messages.soDienThoai}  />}
                name="phone"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongNhapSoDienThoai) }]}
              >
                <Input placeholder={intl.formatMessage(messages.vd0901234567)} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<FormattedMessage {...messages.ngheNghiep}  />}
                name="occupation"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongChonNgheNghiep) }]}
              >
                <Select placeholder={intl.formatMessage(messages.chonNgheNghiep)} options={translatedDepartments} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<FormattedMessage {...messages.chucVu}  />}
                name="position"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongNhapChucVu) }]}
              >
                <Input placeholder={intl.formatMessage(messages.vdSeniorDeveloper)} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<FormattedMessage {...messages.trangThai}  />}
                name="status"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongChonTrangThai) }]}
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
                label={<FormattedMessage {...messages.ngayTao}  />}
                name="joinDate"
                rules={[{ required: true, message: intl.formatMessage(messages.vuiLongChonNgay) }]}
                getValueFromEvent={(date) => date ? date.format('YYYY-MM-DD') : ''}
                getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
              >
                <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} placeholder={intl.formatMessage(messages.chonNgay)} />
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

export default UserForm;
