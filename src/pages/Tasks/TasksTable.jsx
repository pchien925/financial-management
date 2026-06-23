import React, { useMemo } from 'react';
import { Table, Button, Popconfirm, Space, Tooltip, message } from 'antd';
import { EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import DragableRow from './DragableRow';
import styles from './TasksTable.module.scss';

function TasksTable({ dataSource, onEdit, onDelete, onReorder, hideUserColumn }) {
  const { users } = useSelector((state) => state.user);

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
      message.success('Đã thay đổi vị trí công việc!');
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
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên công việc',
      dataIndex: 'name',
      key: 'name',
      width: 300,
    },
    {
      title: 'Thời gian HT dự kiến',
      dataIndex: 'expectedTime',
      key: 'expectedTime',
      width: 200,
      render: (text) => (text ? `${Number((text / 60).toFixed(2))}h` : ''),
    },
    {
      title: 'Người dùng',
      dataIndex: 'userId',
      key: 'userName',
      width: 140,
      render: (userId) => {
        const found = users.find((u) => u.id === userId);
        return found ? found.name : 'Không xác định';
      },
    },
    {
      title: 'Ngày tạo',
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
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        // Chặn onMouseDown để hành động click sửa/xóa không kích hoạt cơ chế Drag hành hạ UI
        <Space onMouseDown={(e) => e.stopPropagation()}>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className={styles.editButton}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa công việc"
            description="Bạn có chắc muốn xóa công việc này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.id)}
          >
            <Tooltip title="Xóa">
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