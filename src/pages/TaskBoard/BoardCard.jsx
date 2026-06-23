import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelector } from 'react-redux';
import { HolderOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import styles from './TaskBoard.module.scss';

function BoardCard({ task, onDelete }) {
    const { users } = useSelector((state) => state.user);
    const assignedUser = users.find((u) => u.id === task.userId);
    const userName = assignedUser ? assignedUser.name : 'Chưa có người thực hiện';
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
            title: 'Xác nhận xóa',
            content: `Bạn có chắc muốn xóa công việc "${task.name}"?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
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
                title="Kéo để di chuyển"
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
                title="Xóa công việc"
            >
                <DeleteOutlined />
            </span>
        </div>
    );
}

export default BoardCard;