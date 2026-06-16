import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import { Table, Button, Popconfirm, Space, Tooltip, message } from 'antd';
import { EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons'; // Thêm MenuOutlined
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './TasksTable.module.scss';
import { useDispatch, useSelector } from 'react-redux';

const DragHandleContext = createContext(null);

// Component này sẽ hiển thị icon 3 gạch và nhận quyền "được phép kéo"
const DragHandle = () => {
  const drag = useContext(DragHandleContext);
  return (
    <MenuOutlined
      ref={drag} // Gắn ref drag vào chính xác cái icon này
      style={{ cursor: 'grab', color: '#999', fontSize: 16 }}
      title="Giữ để di chuyển"
    />
  );
};

const type = 'DraggableBodyRow';

const DraggableBodyRow = ({ index, moveRow, onDrop, className, style, ...restProps }) => {
  const ref = useRef(null);

  // Cấu hình Drop (Điểm thả - áp dụng cho toàn bộ hàng)
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) return {};
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    hover: (item, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Cấu hình Drag (Điểm kéo) -> Trả về thêm preview
  const [{ isDragging }, drag, preview] = useDrag({
    type,
    item: { index, originalIndex: index },
    end: (item, monitor) => {
      if (item.index !== item.originalIndex) {
        if (onDrop) onDrop();
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Áp dụng điểm thả (drop) và ảnh mờ khi kéo (preview) cho toàn bộ thẻ <tr>
  drop(preview(ref));

  return (
    // Dùng Provider để ném hàm 'drag' xuống cho các ô con bên trong (cụ thể là DragHandle)
    <DragHandleContext.Provider value={drag}>
      <tr
        ref={ref}
        className={`${className}${isOver ? dropClassName : ''}`}
        // Xóa cursor: 'grab' ở đây vì giờ chỉ icon mới có hình bàn tay
        style={{ ...style }} 
        {...restProps}
      />
    </DragHandleContext.Provider>
  );
};

function TasksTable({ dataSource, onEdit, onDelete, onReorder, hideUserColumn }) {
  const [data, setData] = useState(dataSource);
  const dataRef = useRef(data);
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);

  // Cập nhật dữ liệu khi dataSource thay đổi
  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Hàm này sẽ được gọi khi một hàng được thả xuống vị trí mới
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      const newData = [...data];
      
      newData.splice(dragIndex, 1);
      newData.splice(hoverIndex, 0, dragRow);
      
      setData(newData);
    },
    [data],
  );

  const handleDrop = useCallback(() => {
    message.success('Đã thay đổi vị trí công việc!');
    if (onReorder) {
      onReorder(dataRef.current);
    }
  }, [onReorder]);

  const allColumns = [
    {
      key: 'sort',
      align: 'center',
      width: 40,
      render: () => <DragHandle />,
    },
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
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
      render: (_, record) => (
        <Space>
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

  const columns = hideUserColumn
    ? allColumns.filter((col) => col.key !== 'userName')
    : allColumns;

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  return (
    <div className={styles.tableWrapper}>
      <DndProvider backend={HTML5Backend}>
        <Table
          columns={columns}
          dataSource={data}
          components={components}
          rowKey="id"
          pagination={false}
          size="middle"
          onRow={(_, index) => ({
            index,
            moveRow,
            onDrop: handleDrop,
          })}
        />
      </DndProvider>
    </div>
  );
}

export default TasksTable;