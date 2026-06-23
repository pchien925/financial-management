import { useState } from 'react';
import { Button, Input, Popconfirm, Tooltip, message } from 'antd';
import { DeleteOutlined, DownloadOutlined, UploadOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import styles from './DocumentUpload.module.scss';
import { useIntl, defineMessages } from 'react-intl';

const CLOUD_NAME = 'dby0mgpvn';
const UPLOAD_PRESET = 'Reactjs';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

const MAX_DOCUMENTS = 5;

const messages = defineMessages({
  uploadSuccess: { id: 'document.uploadSuccess', defaultMessage: 'Tải "{fileName}" lên thành công!' },
  uploadFailed: { id: 'document.uploadFailed', defaultMessage: 'Tải tài liệu lên thất bại!' },
  deleteSuccess: { id: 'document.deleteSuccess', defaultMessage: 'Đã xoá tài liệu!' },
  maxDocuments: { id: 'document.maxDocuments', defaultMessage: 'Tối đa {max} tài liệu!' },
  noAttachment: { id: 'document.noAttachment', defaultMessage: 'Không có tài liệu đính kèm' },
  docName: { id: 'document.docName', defaultMessage: 'Tên tài liệu' },
  deleteTitle: { id: 'document.deleteTitle', defaultMessage: 'Xóa tài liệu' },
  deleteDesc: { id: 'document.deleteDesc', defaultMessage: 'Bạn có chắc muốn xóa tài liệu này?' },
  delete: { id: 'document.delete', defaultMessage: 'Xóa' },
  cancel: { id: 'document.cancel', defaultMessage: 'Hủy' },
  download: { id: 'document.download', defaultMessage: 'Tải về' },
  uploading: { id: 'document.uploading', defaultMessage: 'Đang tải lên...' },
  upload: { id: 'document.upload', defaultMessage: 'Tải lên' },
  addDoc: { id: 'document.addDoc', defaultMessage: 'Thêm Tài liệu' },
});

function DocumentUpload({ value = [{ name: '', link: '' }], onChange, readOnly = false }) {
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const intl = useIntl();

  // Upload file lên Cloudinary
  const handleUpload = async (file, index) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      setUploadingIndex(index);
      const rs = await axios.post(UPLOAD_URL, formData);
      const link = rs.data.secure_url;
      const fileName = file.name;

      const newDocs = [...value];
      newDocs[index] = { name: fileName, link };
      onChange(newDocs);
      message.success(intl.formatMessage(messages.uploadSuccess, { fileName }));
    } catch (error) {
      message.error(intl.formatMessage(messages.uploadFailed));
    } finally {
      setUploadingIndex(null);
    }
  };

  // Xử lý chọn file từ input
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file, index);
    }
    e.target.value = '';
  };

  // Xoá tài liệu
  const handleDelete = (index) => {
    const newDocs = value.filter((_, i) => i !== index);
    onChange(newDocs);
    message.success(intl.formatMessage(messages.deleteSuccess));
  };

  // Tải về tài liệu
  const handleDownload = (doc) => {
    // Thêm fl_attachment vào URL Cloudinary để force download
    const downloadUrl = doc.link.replace('/upload/', '/upload/fl_attachment/');
    const linkElement = document.createElement('a');
    linkElement.href = downloadUrl;
    linkElement.setAttribute('download', doc.name);
    linkElement.setAttribute('target', '_blank');
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };

  // Thêm slot upload mới
  const handleAddSlot = () => {
    if (value.length >= MAX_DOCUMENTS) {
      message.warning(intl.formatMessage(messages.maxDocuments, { max: MAX_DOCUMENTS }));
      return;
    }
    // Thêm một slot trống
    onChange([...value, { name: '', link: '' }]);
  };

  // Số slot hiện tại (bao gồm cả slot trống đang chờ upload)
  const currentSlots = value;
  const canAddMore = currentSlots.length < MAX_DOCUMENTS;
  // Kiểm tra xem có slot nào chưa có tài liệu (chưa upload) không
  const hasEmptySlot = currentSlots.some(doc => !doc.link);

  // Trong chế độ readOnly, chỉ hiển thị các tài liệu đã upload
  const displaySlots = readOnly ? currentSlots.filter(doc => doc.link) : currentSlots;

  return (
    <div className={styles.documentUpload}>
      {displaySlots.length === 0 && readOnly && (
        <span style={{ color: '#8c8c8c', fontStyle: 'italic' }}>{intl.formatMessage(messages.noAttachment)}</span>
      )}
      {displaySlots.map((doc, index) => (
        <div key={index} className={styles.documentRow}>
          {doc.link ? (
            // Tài liệu đã upload — hiển thị tên file
            <>
              <Input
                readOnly
                value={doc.name}
                className={styles.fileNameInput}
                placeholder={intl.formatMessage(messages.docName)}
              />
              <div className={styles.actionButtons}>
                {!readOnly && (
                  <Popconfirm
                    title={intl.formatMessage(messages.deleteTitle)}
                    description={intl.formatMessage(messages.deleteDesc)}
                    okText={intl.formatMessage(messages.delete)}
                    cancelText={intl.formatMessage(messages.cancel)}
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDelete(index)}
                  >
                    <Tooltip title={intl.formatMessage(messages.delete)}>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className={styles.deleteBtn}
                      />
                    </Tooltip>
                  </Popconfirm>
                )}
                <Tooltip title={intl.formatMessage(messages.download)}>
                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    className={styles.downloadBtn}
                    onClick={() => handleDownload(doc)}
                  />
                </Tooltip>
              </div>
            </>
          ) : (
            // Slot trống — cho phép upload (chỉ hiện khi không phải readOnly)
            !readOnly && (
              <>
                <div className={styles.uploadInputWrapper}>
                  <Input
                    readOnly
                    placeholder={intl.formatMessage(messages.docName)}
                    className={styles.fileNameInput}
                    value={uploadingIndex === index ? intl.formatMessage(messages.uploading) : ''}
                    suffix={uploadingIndex === index ? <LoadingOutlined spin /> : null}
                  />
                  <input
                    type="file"
                    className={styles.hiddenInput}
                    onChange={(e) => handleFileChange(e, index)}
                    disabled={uploadingIndex !== null}
                    id={`doc-upload-${index}`}
                  />
                </div>
                <div className={styles.actionButtons}>
                  <Tooltip title={intl.formatMessage(messages.upload)}>
                    <Button
                      type="text"
                      icon={<UploadOutlined />}
                      className={styles.uploadBtn}
                      disabled={uploadingIndex !== null}
                      onClick={() => document.getElementById(`doc-upload-${index}`).click()}
                    />
                  </Tooltip>
                </div>
              </>
            )
          )}
        </div>
      ))}

      {!readOnly && canAddMore && !hasEmptySlot && (
        <Button
          type="default"
          icon={<PlusOutlined />}
          className={styles.addButton}
          onClick={handleAddSlot}
          block
        >
          {intl.formatMessage(messages.addDoc)}
        </Button>
      )}
    </div>
  );
}

export default DocumentUpload;
