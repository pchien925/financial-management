import React, { useMemo } from 'react';
import { Table, Button, Popconfirm, Space, Tooltip, message } from 'antd';
import { EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useIntl, defineMessages } from 'react-intl';

import DragableRow from './DragableRow';
import styles from './TasksTable.module.scss';

const messages = defineMessages({
  daThayDoiViTriCongViec: {
    defaultMessage: 'Đã thay đổi vị trí công việc!'
  },
  stt: {
    defaultMessage: 'STT'
  },
  tenCongViec: {
    defaultMessage: 'Tên công việc'
  },
  thoiGianHtDuKien: {
    defaultMessage: 'Thời gian HT dự kiến'
  },
  nguoiDung: {
    defaultMessage: 'Người dùng'
  },
  khongXacDinh: {
    defaultMessage: 'Không xác định'
  },
  ngayTao: {
    defaultMessage: 'Ngày tạo'
  },
  hanhDong: {
    defaultMessage: 'Hành động'
  },
  sua: {
    defaultMessage: 'Sửa'
  },
  xoaCongViec: {
    defaultMessage: 'Xóa công việc'
  },
  banCoChacMuonXoaCongViecNay: {
    defaultMessage: 'Bạn có chắc muốn xóa công việc này?'
  },
  xoa: {
    defaultMessage: 'Xóa'
  },
  huy: {
    defaultMessage: 'Hủy'
  }
});


function TasksTable({ dataSource, onEdit, onDelete, onReorder, hideUserColumn }) {
  const { users } = useSelector((state) => state.user);
  const intl = useIntl();

  // Cấu hình kích hoạt kéo thả: Di chuyển chuột 5px mới drag để tránh lỗi khi click nút hành động
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Xử lý sự kiện sau khi thả hàng công việc
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      if (onReorder) {
        onReorder(active.id, over.id); // Trả id về component cha để xử lý reorder trong list tổng
      }
      message.success(intl.formatMessage(messages.daThayDoiViTriCongViec));
    }
  };

  const allColumns = [
    {
      title: '',
      key: 'sort',
      width: 40,
      align: 'center',
      render: () => (
        // Nút icon hiển thị cho người dùng biết chỗ này dùng để nắm kéo
        <MenuOutlined style={{ cursor: 'move', color: '#999' }} />
      ),
    },
    {
      title: intl.formatMessage(messages.stt),
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: intl.formatMessage(messages.tenCongViec),
      dataIndex: 'name',
      key: 'name',
      width: 300,
    },
    {
      title: intl.formatMessage(messages.thoiGianHtDuKien),
      dataIndex: 'expectedTime',
      key: 'expectedTime',
      width: 200,
      render: (text) => (text ? `${Number((text / 60).toFixed(2))}h` : ''),
    },
    {
      title: intl.formatMessage(messages.nguoiDung),
      dataIndex: 'userId',
      key: 'userName',
      width: 140,
      render: (userId) => {
        const found = users.find((u) => u.id === userId);
        return found ? found.name : intl.formatMessage(messages.khongXacDinh);
      },
    },
    {
      title: intl.formatMessage(messages.ngayTao),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (text) => {
        if (!text) return '';
        const parts = text.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return text;
      },
    },
    {
      title: intl.formatMessage(messages.hanhDong),
      key: 'action',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        // Chặn onMouseDown để hành động click sửa/xóa không kích hoạt cơ chế Drag hành hạ UI
        <Space onMouseDown={(e) => e.stopPropagation()}>
          <Tooltip title={intl.formatMessage(messages.sua)}>
            <Button
              type="text"
              icon={<EditOutlined />}
              className={styles.editButton}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title={intl.formatMessage(messages.xoaCongViec)}
            description={intl.formatMessage(messages.banCoChacMuonXoaCongViecNay)}
            okText={intl.formatMessage(messages.xoa)}
            cancelText={intl.formatMessage(messages.huy)}
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.id)}
          >
            <Tooltip title={intl.formatMessage(messages.xoa)}>
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columns = useMemo(() => {
    return hideUserColumn
      ? allColumns.filter((col) => col.key !== 'userName')
      : allColumns;
  }, [hideUserColumn, users]);

  return (
    <div className={styles.tableWrapper}>
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={dataSource.map((i) => i.id)} 
          strategy={verticalListSortingStrategy}
        >
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id"
            scroll={{x: 'max-content'}}
            pagination={false}
            size="middle"
            components={{
              body: {
                row: DragableRow, // Ép Antd Table sử dụng Custom Row kéo thả của chúng ta
              },
            }}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default TasksTable;