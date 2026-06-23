import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelector } from 'react-redux';
import { HolderOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import styles from './TaskBoard.module.scss';
import { useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  chuaCoNguoiThucHien: {
    defaultMessage: 'Chưa có người thực hiện'
  },
  xacNhanXoa: {
    defaultMessage: 'Xác nhận xóa'
  },
  xoa: {
    defaultMessage: 'Xóa'
  },
  huy: {
    defaultMessage: 'Hủy'
  },
  keoDeDiChuyen: {
    defaultMessage: 'Kéo để di chuyển'
  },
  xoaCongViec: {
    defaultMessage: 'Xóa công việc'
  },
  banCoChacMuonXoaCongViecName: {
    defaultMessage: 'Bạn có chắc muốn xóa công việc "{name}"?'
  }
});


function BoardCard({ task, onDelete }) {
    const { users } = useSelector((state) => state.user);
    const intl = useIntl();
    const assignedUser = users.find((u) => u.id === task.userId);
    const userName = assignedUser ? assignedUser.name : intl.formatMessage(messages.chuaCoNguoiThucHien);
    const timeString = task.expectedTime ? `${Number((task.expectedTime / 60).toFixed(2))}h` : '--';

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: { ...task } // Lưu kèm data để lúc thả ra mình biết đang kéo task nào
    });

    const dynamicStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        borderColor: isDragging ? '#1677ff' : '#e0e0e0', // Chuyển màu viền mượt mà
        boxShadow: isDragging ? '0 0 0 2px rgba(22,119,255,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        Modal.confirm({
            title: intl.formatMessage(messages.xacNhanXoa),
            content: intl.formatMessage(messages.banCoChacMuonXoaCongViecName, { name: task.name }),
            okText: intl.formatMessage(messages.xoa),
            cancelText: intl.formatMessage(messages.huy),
            okButtonProps: { danger: true },
            onOk: () => onDelete(task.id),
        });
    };

    return (
        <div 
            ref={setNodeRef} 
            className={styles.boardCard}
            style={dynamicStyle} 
            {...attributes}
        >
            <span
                {...listeners}
                className={styles.dragHandle}
                title={intl.formatMessage(messages.keoDeDiChuyen)}
            >
                <HolderOutlined />
            </span>

            <div className={styles.cardContent}>
                <span className={styles.taskName}>
                    {task.name}
                </span>
                <span className={styles.taskInfo}>
                    {userName} - {timeString}
                </span>
            </div>
            
            <span
                onClick={handleDeleteClick}
                className={styles.deleteButton}
                title={intl.formatMessage(messages.xoaCongViec)}
            >
                <DeleteOutlined />
            </span>
        </div>
    );
}

export default BoardCard;