import { useState } from 'react';
import { Button, Input, Popconfirm, Tooltip, message } from 'antd';
import { DeleteOutlined, DownloadOutlined, UploadOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import styles from './DocumentUpload.module.scss';

const CLOUD_NAME = 'dby0mgpvn';
const UPLOAD_PRESET = 'Reactjs';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

const MAX_DOCUMENTS = 5;

/**
 * DocumentUpload - Component upload tài liệu lên Cloudinary
 * Props:
 *   - value: Array<{ name: string, link: string }> — danh sách tài liệu đã upload
 *   - onChange: (documents: Array<{ name: string, link: string }>) => void
 */
function DocumentUpload({ value = [{ name: '', link: '' }], onChange, readOnly = false }) {
  const [uploadingIndex, setUploadingIndex] = useState(null);

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
      message.success(`Tải "${fileName}" lên thành công!`);
    } catch (error) {
      message.error('Tải tài liệu lên thất bại!');
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
    // Reset input để có thể chọn lại cùng file
    e.target.value = '';
  };

  // Xoá tài liệu
  const handleDelete = (index) => {
    const newDocs = value.filter((_, i) => i !== index);
    onChange(newDocs);
    message.success('Đã xoá tài liệu!');
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
      message.warning(`Tối đa ${MAX_DOCUMENTS} tài liệu!`);
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
        <span style={{ color: '#8c8c8c', fontStyle: 'italic' }}>Không có tài liệu đính kèm</span>
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
                placeholder="Tên tài liệu"
              />
              <div className={styles.actionButtons}>
                {!readOnly && (
                  <Popconfirm
                    title="Xóa tài liệu"
                    description="Bạn có chắc muốn xóa tài liệu này?"
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleDelete(index)}
                  >
                    <Tooltip title="Xóa">
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className={styles.deleteBtn}
                      />
                    </Tooltip>
                  </Popconfirm>
                )}
                <Tooltip title="Tải về">
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
                    placeholder="Tên tài liệu"
                    className={styles.fileNameInput}
                    value={uploadingIndex === index ? 'Đang tải lên...' : ''}
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
                  <Tooltip title="Tải lên">
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
          Thêm Tài liệu
        </Button>
      )}
    </div>
  );
}

export default DocumentUpload;
